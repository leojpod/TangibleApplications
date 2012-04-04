package se.nicklasgavelin.request;

import se.nicklasgavelin.http.TangibleDevice;
import se.nicklasgavelin.request.base.Delete;
import se.nicklasgavelin.request.base.Session;

public class DeviceUnreserveRequest extends Delete
{
	private TangibleDevice device;
	
	public DeviceUnreserveRequest( Session s, TangibleDevice device )
	{
		super( s );
		
		this.addURIParam( "device", "reservation" );
		
		if( device != null )
		{
			this.addURIParam( device.getId() );
			this.device = device;
		}
	}
	
	public DeviceUnreserveRequest( Session s )
	{
		this( s, null );
	}
	
	public TangibleDevice getDevice()
	{
		return this.device;
	}
}
