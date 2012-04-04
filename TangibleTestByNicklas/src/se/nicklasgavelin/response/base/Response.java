package se.nicklasgavelin.response.base;

public abstract class Response
{
	public String flow;
	
	public String getFlow()
	{
		return this.flow;
	}
	
	public boolean isSuccess()
	{
		return true;
	}
}
