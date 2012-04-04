package se.nicklasgavelin.request.base;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

public class Session
{
	private String appuuid;
	private String host;
	private int port;

	private static Map<String, Session> instances = new HashMap<String, Session>();

	public Session( String host, int port )
	{
		this.host = host;
		this.port = port;
	}
	
	public Session( String appuuid, String host, int port )
	{
		this.appuuid = appuuid;
		this.host = host;
		this.port = port;

		// Set instance
		setInstance( this );
	}

	public void setAppUUID( String appuuid )
	{
		this.appuuid = appuuid;
		setInstance( this );
	}
	
	public String getAppUUID()
	{
		return this.appuuid;
	}

	public String getHost()
	{
		return this.host;
	}

	public int getPort()
	{
		return this.port;
	}

	public URI getURI()
	{
		try
		{
			return new URI( "http://" + this.host + ":" + this.port );
		}
		catch( URISyntaxException e )
		{
			e.printStackTrace();
			return null;
		}
	}

	private static void setInstance( Session s )
	{
		instances.put( s.getAppUUID(), s );
	}

	public static Session getInstance( String appuuid )
	{
		if( instances.containsKey( appuuid ) )
			return instances.get( appuuid );

		return new Session( "", 0 );
	}
}
