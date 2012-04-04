package se.nicklasgavelin.response;

import se.nicklasgavelin.response.base.Response;

public class InitializationResponse extends Response
{
	public String msg;

	public boolean isSuccess()
	{
		return( this.msg.startsWith( "Welcome" ) );
	}
}
