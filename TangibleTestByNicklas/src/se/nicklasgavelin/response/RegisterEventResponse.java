package se.nicklasgavelin.response;

import se.nicklagavelin.util.json.Port;
import se.nicklasgavelin.response.base.Response;

public class RegisterEventResponse extends Response
{
	public Port msg;

	@Override
	public boolean isSuccess()
	{
		try
		{
			this.msg.getPort();
		}
		catch( Exception e )
		{
			return false;
		}

		return true;
	}
	
	public int getPort()
	{
		return this.msg.getPort();
	}
}
