package se.nicklasgavelin.response.handler;

import java.io.IOException;
import java.io.InputStream;
import java.util.Observable;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpRequestBase;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import se.nicklasgavelin.http.TangibleAPIConnection;
import se.nicklasgavelin.response.RegisterEventResponse;
import se.nicklasgavelin.response.base.Response;
import se.nicklasgavelin.response.event.EventResponse;
import se.nicklasgavelin.response.handler.Handler;
import se.nicklasgavelin.response.handler.Handler.ResponseEvent.RESPONSE_TYPE;

public class ResponseHandler extends Observable
{
	private Gson gson;
	private TangibleAPIConnection connection;

	public ResponseHandler( TangibleAPIConnection connection )
	{
		this.connection = connection;
		this.gson = constructGsonElement( new Class[] { TangibleAPIConnection.class } );
	}

	public void handle( EventResponse event )
	{
		notifyListenersAboutIncommingEvent( event );
	}

	private void notifyListenersAboutIncommingEvent( EventResponse event )
	{
		this.setChanged();
		this.notifyObservers( new Handler.ResponseEvent( RESPONSE_TYPE.EVENT_RECEIVED, event ) );
	}

	public void handle( HttpRequestBase request, HttpResponse response )
	{
		try
		{
			switch ( response.getStatusLine().getStatusCode() )
			{
				case 200:
					String responseString = readString( response );
					Logger.getLogger( this.getClass().getCanonicalName() ).info( "Received: " + responseString );

					Logger.getLogger( this.getClass().getCanonicalName() ).info( "Creating response " + getResponseClassFromRequestInstance( request ) );
					Response responseInstance = (Response) this.gson.fromJson( responseString, getResponseClassFromRequestInstance( request ) );

					if( responseInstance == null ) // FUL LÖSNING!
						responseInstance = (Response) getResponseClassFromRequestInstance( request ).newInstance();

					try
					{
						Handler handler = (Handler) getHandlerClassFromRequestInstance( request ).newInstance();
						handler.handle( new Handler.ResponseEvent( RESPONSE_TYPE.RESPONSE_RECEIVED, responseInstance, request ) );
					}
					catch( HandlerNotFoundException e )
					{

					}

					if( responseInstance instanceof RegisterEventResponse )
						registerEventListener( responseInstance );

					notifyListenersAboutIncommingResponse( Handler.ResponseEvent.RESPONSE_TYPE.RESPONSE_RECEIVED, responseInstance, request );
					break;
				default:
					Logger.getLogger( this.getClass().getCanonicalName() ).severe( "Failed request " + request.getClass().getCanonicalName() + ", CODE: " + response.getStatusLine().getStatusCode() );

					// TODO: Should we handle this kind of event in a specific handler?

					notifyListenersAboutIncommingResponse( Handler.ResponseEvent.RESPONSE_TYPE.ERROR_RECEIVED, request );
					break;
			}
		}
		catch( Exception e )
		{
			Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, "Invalid message type received", e );
		}
		finally
		{
			request.abort();
		}
	}

	private void registerEventListener( Response response )
	{
		RegisterEventResponse eResponse = (RegisterEventResponse) response;
		this.connection.createEventListener( eResponse.getPort() );
	}

	private void notifyListenersAboutIncommingResponse( Handler.ResponseEvent.RESPONSE_TYPE responseType, HttpRequestBase request )
	{
		this.setChanged();
		this.notifyObservers( new Handler.ResponseEvent( responseType, request ) );
	}

	private void notifyListenersAboutIncommingResponse( Handler.ResponseEvent.RESPONSE_TYPE responseType, Response response, HttpRequestBase request )
	{
		this.setChanged();
		this.notifyObservers( new se.nicklasgavelin.response.handler.Handler.ResponseEvent( responseType, response, request ) );
	}

	private Class<?> getHandlerClassFromRequestInstance( HttpRequestBase request ) throws HandlerNotFoundException
	{
		String c = request.getClass().getCanonicalName();
		String replace = "Request";
		String replaceWith = "Handler";
		int replaceLength = replace.length();

		c = c.substring( 0, c.length() - replaceLength );
		c += replaceWith;

		String replaceClass = ".request.";
		String replaceTo = ".response.handler.";

		try
		{
			return Class.forName( c.replace( replaceClass, replaceTo ) );
		}
		catch( ClassNotFoundException e )
		{
			throw new HandlerNotFoundException();
		}
	}

	private Class<?> getResponseClassFromRequestInstance( HttpRequestBase request ) throws ClassNotFoundException
	{
		String c = request.getClass().getCanonicalName();
		String replace = "Request";
		String replaceWith = "Response";
		int replaceLength = replace.length();

		c = c.substring( 0, c.length() - replaceLength );
		c += replaceWith;

		String replaceClass = ".request.";
		String replaceTo = ".response.";

		return Class.forName( c.replace( replaceClass, replaceTo ) );
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
		byte[] buff = new byte[ 4096 ];
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
			Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, "Failed to read string from input stream", e );
			return null;
		}

		return result;
	}

	private Gson constructGsonElement( final Class<?>[] skipClasses )
	{
		return new GsonBuilder().setExclusionStrategies( new ExclusionStrategy() {
			@Override
			public boolean shouldSkipField( FieldAttributes f )
			{
				return false;
			}

			@Override
			public boolean shouldSkipClass( Class<?> clazz )
			{
				for( Class<?> c : skipClasses )
					if( clazz.getCanonicalName().equals( c.getCanonicalName() ) )
						return true;
				return false;
			}
		} ).serializeNulls().create();
	}
}
