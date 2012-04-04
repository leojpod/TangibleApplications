package se.nicklasgavelin.request;

import se.nicklasgavelin.http.TangibleDevice;
import se.nicklasgavelin.request.base.Put;
import se.nicklasgavelin.request.base.Session;

public class DeviceReservationRequest extends Put
{
	private TangibleDevice device;
	
	public DeviceReservationRequest( Session s, TangibleDevice device )
	{
		super( s );
		
		this.addURIParam( "device" );
		this.addURIParam( "reservation", device.getId() );
		
		this.device = device;
	}
	
	public TangibleDevice getDevice()
	{
		return this.device;
	}
}
