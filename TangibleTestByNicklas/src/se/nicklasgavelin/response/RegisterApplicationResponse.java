package se.nicklasgavelin.response;

import se.nicklasgavelin.response.base.Response;

public class RegisterApplicationResponse extends Response
{
	public String msg;
	
	public String getAppUUID()
	{
		return this.msg;
	}

	@Override
	public boolean isSuccess()
	{
		return( this.msg.contains( "-" ) );
	}
}
