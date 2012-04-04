package se.nicklasgavelin.response;

import se.nicklasgavelin.http.TangibleDevice;
import se.nicklasgavelin.response.base.Response;

public class ListOfDevicesResponse extends Response
{
	public TangibleDevice[] msg;

	public TangibleDevice[] getDevices()
	{
		return this.msg;
	}
}
