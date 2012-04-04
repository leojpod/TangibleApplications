package se.nicklasgavelin.request;

import se.nicklasgavelin.http.TangibleDevice;
import se.nicklasgavelin.request.base.Put;
import se.nicklasgavelin.request.base.Session;

public class ShowColorRequest extends Put
{
	private TangibleDevice device;
	
	public ShowColorRequest( TangibleDevice device, String hexvalue )
	{
		super();
		this.addURIParam( "device_methods" );
		this.addURIParam( device.getId() );
		this.addURIParam( "show_color" );
		this.addParam( "color", hexvalue );
		
		this.device = device;
	}

	public ShowColorRequest( Session s, TangibleDevice device, String hexvalue )
	{
		super( s );
		this.addURIParam( "device_methods" );
		this.addURIParam( device.getId() );
		this.addURIParam( "show_color" );
		this.addParam( "color", hexvalue );
		
		this.device = device;
	}
	
	public TangibleDevice getDevice()
	{
		return this.device;
	}
}
