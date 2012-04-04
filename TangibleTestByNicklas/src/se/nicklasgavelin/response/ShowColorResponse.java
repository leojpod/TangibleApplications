package se.nicklasgavelin.response;

import se.nicklasgavelin.response.base.Response;

public class ShowColorResponse extends Response
{
	public String msg;

	@Override
	public boolean isSuccess()
	{
		return( this.msg.equals( "OK" ) );
	}
}
