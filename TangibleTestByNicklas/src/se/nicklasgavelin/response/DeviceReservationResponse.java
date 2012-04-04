package se.nicklasgavelin.response;

import se.nicklasgavelin.response.base.Response;

public class DeviceReservationResponse extends Response
{
	public String msg;

	public String getRegisteredDeviceId()
	{
		return this.msg;
	}

	@Override
	public boolean isSuccess()
	{
		return( this.msg != null );
	}
}
