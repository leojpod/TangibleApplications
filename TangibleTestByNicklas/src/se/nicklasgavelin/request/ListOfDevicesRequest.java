package se.nicklasgavelin.request;

import se.nicklasgavelin.request.base.Get;
import se.nicklasgavelin.request.base.Session;

public class ListOfDevicesRequest extends Get
{
	public ListOfDevicesRequest( Session s )
	{
		super( s );
		super.addParam( "device" );
	}
}
