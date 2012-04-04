package se.nicklasgavelin.request;

import se.nicklasgavelin.request.base.Get;
import se.nicklasgavelin.request.base.Session;

public class InitializationRequest extends Get
{
	public InitializationRequest( Session s)
	{
		super( s );
	}

	public InitializationRequest( String host, int port )
	{
		this( new Session( null, host, port ) );
	}
}
