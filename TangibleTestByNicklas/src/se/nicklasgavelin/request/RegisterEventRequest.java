package se.nicklasgavelin.request;

import se.nicklasgavelin.http.TangibleDevice;
import se.nicklasgavelin.request.base.Put;

public class RegisterEventRequest extends Put
{
	private TangibleDevice device;

	public RegisterEventRequest( String deviceid )
	{
		super( "" );
		this.addURIParam( "device_methods" );
		this.addURIParam( deviceid );
		this.addURIParam( "subscribe" );
	}

	public RegisterEventRequest( TangibleDevice device )
	{
		this( device.getId() );
		this.device = device;
	}

	public TangibleDevice getDevice()
	{
		return this.device;
	}
}
