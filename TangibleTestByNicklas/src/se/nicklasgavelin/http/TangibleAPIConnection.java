package se.nicklasgavelin.http;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonStreamParser;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.DefaultHttpClient;
import se.nicklasgavelin.request.InitializationRequest;
import se.nicklasgavelin.request.RegisterApplicationRequest;
import se.nicklasgavelin.request.base.Request;
import se.nicklasgavelin.request.base.Session;
import se.nicklasgavelin.response.InitializationResponse;
import se.nicklasgavelin.response.RegisterApplicationResponse;
import se.nicklasgavelin.response.event.EventResponse;
import se.nicklasgavelin.response.handler.ResponseHandler;

public class TangibleAPIConnection
{
	private Session session;
	private HttpClient client;
	private String appUUID = null;
	private SendingThread sendingThread;
	private Gson g;

	private List<EventThread> eventThreads;

	private static final int BUFFER_SIZE = 4096;

	public TangibleAPIConnection( String host, int port )
	{
		this.g = new Gson();
		this.eventThreads = new LinkedList<EventThread>();
		this.session = new Session( null, host, port );
	}

	private void createHttpClient()
	{
		this.client = new DefaultHttpClient();
	}

	public boolean connect()
	{
		try
		{
			// Create our client
			this.createHttpClient();
			this.performHandshake();
		}
		catch( Exception e )
		{
			error( "Failed to connect to API", e );
		}

		return true;
	}

	public Session getSession()
	{
		return this.session;
	}

	private void performHandshake() throws ClientProtocolException, IOException
	{
		// Perform initialization
		HttpResponse response = this.performIntitializationRequest();
		InitializationResponse r = this.g.fromJson( readString( response ), InitializationResponse.class );

		if( r.isSuccess() )
			performApplicationRegistration();
		else
			throw new UnableToConnectException();// error(
// "Failed to perform initialization request to the API" );
	}

	private void performApplicationRegistration() throws ClientProtocolException, IOException
	{
		HttpResponse response = this.performRegisterApplicationRequest();
		RegisterApplicationResponse regResp = this.g.fromJson( readString( response ), RegisterApplicationResponse.class );

		if( regResp.isSuccess() )
		{
			log( "Successfully registered application with appuuid " + regResp.getAppUUID() );
			this.session.setAppUUID( regResp.getAppUUID() );
			startSendingReceivingThreads( regResp );
		}
		else
			throw new UnableToRegisterApplicationException();
	}

	private void startSendingReceivingThreads( RegisterApplicationResponse regResp )
	{
		this.appUUID = regResp.getAppUUID();
		this.sendingThread = new SendingThread( this.client );
		this.sendingThread.start();
	}

	private HttpResponse performIntitializationRequest() throws ClientProtocolException, IOException
	{
		InitializationRequest inReq = new InitializationRequest( session );
		return client.execute( inReq );
	}

	private HttpResponse performRegisterApplicationRequest() throws ClientProtocolException, IOException
	{
		RegisterApplicationRequest reApp = new RegisterApplicationRequest( session, "Something", "Something lame" );
		return client.execute( reApp );
	}

	public String readString( HttpResponse response ) throws IllegalStateException, IOException
	{
		return this.readString( response.getEntity() );
	}

	public String readString( HttpEntity entity ) throws IllegalStateException, IOException
	{
		return this.readString( entity.getContent() );
	}

	public String readString( InputStream in )
	{
		String result = "";
		byte[] buff = new byte[ BUFFER_SIZE ];
		int read = -1;
		try
		{
			do
			{
				read = in.read( buff );
				for( int i = 0; i < read; i++ )
					result += Character.toString( (char) buff[i] );
			} while( read != -1 );
		}
		catch( IOException e )
		{
			error( "Failed to read string from input stream", e );
			return null;
		}

		return result;
	}

	public class Pair<X, Y>
	{
		private X x;
		private Y y;

		public Pair( X x, Y y )
		{
			this.x = x;
			this.y = y;
		}

		public X getFirst()
		{
			return this.x;
		}

		public Y getSecond()
		{
			return this.y;
		}
	}

	private class SendingThread extends Thread
	{
		private HttpClient client;
		private boolean stop = false;
		private BlockingQueue<HttpRequestBase> queue;
		private ResponseHandler responseHandler;

		private SendingThread( HttpClient client )
		{
			this.client = client;
			this.responseHandler = new ResponseHandler( TangibleAPIConnection.this );
			this.queue = new LinkedBlockingQueue<HttpRequestBase>();
		}

		private void send( HttpRequestBase request )
		{
			this.queue.add( request );
		}

		public void stopThread()
		{
			this.stop = true;
		}

		@Override
		public void run()
		{
			while( !stop )
			{
				// Wait for elements
				HttpRequestBase request;
				try
				{
					request = this.queue.take();
					( (Request) request ).setSession( TangibleAPIConnection.this.session );

					Logger.getLogger( this.getClass().getCanonicalName() ).info( "Performing request " + request.getURI() + " (" + request.getClass().getCanonicalName() + ")" );

					HttpResponse response = client.execute( request );
					responseHandler.handle( request, response );
				}
				catch( Exception e )
				{
					error( "Failed to execute client request", e );
				}
			}
		}
	}

	public void createEventListener( int port )
	{
		try
		{
			EventThread e = new EventThread( port );
			this.eventThreads.add( e );
			e.start();
		}
		catch( Exception e1 )
		{
		}

	}

	public class EventThread extends Thread
	{
		private boolean stop = false;
		private Socket s;
		private InputStream in;
		private ResponseHandler handler;

		public EventThread( int port ) throws UnknownHostException, IOException
		{
			this.s = new Socket( InetAddress.getLocalHost(), port );
			this.in = s.getInputStream();
			this.handler = getResponseHandler();
		}

		public void stopThread()
		{
			this.stop = true;
		}

		@Override
		public void run()
		{
			Logger.getLogger( this.getClass().getCanonicalName() ).info( "Started event listener on " + session.getHost() + ":" + this.s.getPort() );

			while( !stop )
			{
				try
				{
					JsonStreamParser reader = new JsonStreamParser( new InputStreamReader( in, "UTF-8" ) );
					while( reader.hasNext() )
					{
						JsonElement json = reader.next();
						Logger.getLogger( this.getClass().getCanonicalName() ).info( json.toString() );
						EventResponse message = g.fromJson( json, EventResponse.class );
						handler.handle( message );
					}
				}
				catch( IOException e )
				{
					e.printStackTrace();
				}
			}
		}
	}

	public ResponseHandler getResponseHandler()
	{
		return this.sendingThread.responseHandler;
	}

	public void send( HttpRequestBase request )
	{
		this.sendingThread.send( request );
	}

	private void log( String msg )
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).info( msg );
	}

	private void error( String msg )
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).severe( msg );
	}

	private void error( String msg, Throwable e )
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, msg, e );
	}
}
