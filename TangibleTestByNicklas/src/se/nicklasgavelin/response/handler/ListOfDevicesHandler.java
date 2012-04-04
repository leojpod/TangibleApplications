package se.nicklasgavelin.response.handler;

import se.nicklasgavelin.http.TangibleDevice;
import se.nicklasgavelin.response.ListOfDevicesResponse;

public class ListOfDevicesHandler implements Handler
{

	@Override
	public void handle( ResponseEvent responseEvent )
	{
		ListOfDevicesResponse response = (ListOfDevicesResponse) responseEvent.getResponse();
		for( TangibleDevice device : response.getDevices() )
		{
//			System.out.println( device.getType() );
		}
	}
}
