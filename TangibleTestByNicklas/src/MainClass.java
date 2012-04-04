import java.util.HashMap;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;
import java.util.logging.Logger;

import se.nicklasgavelin.http.TangibleAPIConnection;
import se.nicklasgavelin.http.TangibleDevice;
import se.nicklasgavelin.request.DeviceReservationRequest;
import se.nicklasgavelin.request.DeviceUnreserveRequest;
import se.nicklasgavelin.request.ListOfDevicesRequest;
import se.nicklasgavelin.request.base.Session;
import se.nicklasgavelin.response.DeviceReservationResponse;
import se.nicklasgavelin.response.DeviceUnreserveResponse;
import se.nicklasgavelin.response.ListOfDevicesResponse;
import se.nicklasgavelin.response.RegisterEventResponse;
import se.nicklasgavelin.response.ShowColorResponse;
import se.nicklasgavelin.response.base.Response;
import se.nicklasgavelin.response.event.EventResponse;
import se.nicklasgavelin.response.handler.Handler.ResponseEvent;

public class MainClass implements Observer
{
	private Session s;
	private Map<String, TangibleDevice> devices;
	private TangibleAPIConnection t;

	public static void main( String[] args )
	{
		new MainClass();
	}

	private MainClass()
	{
		this.devices = new HashMap<String, TangibleDevice>();

		addUnreserveDevicesShutdownHook();

		t = new TangibleAPIConnection( "localhost", 9998 );
		if( t.connect() )
		{
			this.s = t.getSession();
			t.getResponseHandler().addObserver( this );
			t.send( new ListOfDevicesRequest( s ) );
		}
	}

	private void addUnreserveDevicesShutdownHook()
	{
		// TODO: Fix better shutdown hook....
		Runtime.getRuntime().addShutdownHook( new Thread( new Runnable() {
			@Override
			public void run()
			{
				System.out.println( "Unreserving devices" );
				synchronized( devices )
				{
					for( TangibleDevice k : devices.values() )
					{
						System.out.println( "Unreserving " + k );
						t.send( new DeviceUnreserveRequest( s, k ) );
					}
				}

				Thread waitThread = new Thread( new Runnable() {
					@Override
					public void run()
					{
						try
						{
							Thread.sleep( 1500 );
						}
						catch( InterruptedException e )
						{

						}
					}
				} );

				waitThread.start();

				try
				{
					waitThread.join();
				}
				catch( InterruptedException e )
				{
				}
			}
		} ) );
	}

	@Override
	public void update( Observable o, Object arg )
	{
		if( arg instanceof ResponseEvent )
		{
			ResponseEvent responseEvent = (ResponseEvent) arg;

			switch ( responseEvent.getResponseType() )
			{
				case RESPONSE_RECEIVED:
					Response response = responseEvent.getResponse();

					if( responseEvent.getResponse() != null )
						Logger.getLogger( this.getClass().getCanonicalName() ).info( "Received response of type " + responseEvent.getResponse().getClass().getCanonicalName() );

					if( response instanceof ListOfDevicesResponse )
						handleListOfDevicesResponse( responseEvent );
					else if( response instanceof DeviceReservationResponse )
						handleReservationResponse( responseEvent, response );
					else if( response instanceof DeviceUnreserveResponse )
						handleUnreserveResponse( responseEvent, response );
					else if( response instanceof ShowColorResponse )
						handleShowColorResponse( responseEvent );
					else if( response instanceof RegisterEventResponse )
					{
						if( response.isSuccess() )
						{
							// Socket will open automatically
						}
					}
					break;
				case EVENT_RECEIVED:
					EventResponse event = (EventResponse) responseEvent.getResponse();
					System.out.println( "Received event " + event.getType() );
					break;
				default:
					Logger.getLogger( this.getClass().getCanonicalName() ).severe( "Unknown response received" );
					break;
			}
		}
	}

	private void handleListOfDevicesResponse( ResponseEvent responseEvent )
	{
		ListOfDevicesResponse listResponse = (ListOfDevicesResponse) responseEvent.getResponse();
		
		int i = 0;
		for( TangibleDevice device : listResponse.getDevices() )
			if ( i++ != 0 )
				t.send( new DeviceReservationRequest( s, device ) );
	}

	private void handleUnreserveResponse( ResponseEvent responseEvent, Response response )
	{
		if( response.isSuccess() )
		{
			DeviceUnreserveRequest duRequest = (DeviceUnreserveRequest) responseEvent.getRequest();
			synchronized( devices )
			{
				this.devices.remove( duRequest.getDevice().getId() );
			}
		}
	}

	private void handleReservationResponse( ResponseEvent responseEvent, Response response )
	{
		if( response.isSuccess() )
		{
			DeviceReservationRequest duRequest = (DeviceReservationRequest) responseEvent.getRequest();
			synchronized( devices )
			{
				this.devices.put( duRequest.getDevice().getId(), duRequest.getDevice() );
				Logger.getLogger( this.getClass().getCanonicalName() ).info( "Current number of registered devices: " + this.devices.size() );
				duRequest.getDevice().setConnection( this.t );
				duRequest.getDevice().registerButtonEvent();
			}
		}
	}

	private void handleShowColorResponse( ResponseEvent responseEvent )
	{

	}
}
