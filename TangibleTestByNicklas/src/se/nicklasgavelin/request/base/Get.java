package se.nicklasgavelin.request.base;

import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;

public class Get extends HttpGet implements Request
{
	private Session session;
	private Params params;

	public Get( String appuuid )
	{
		this( Session.getInstance( appuuid ) );
	}
	
	public Get()
	{
		this("");
	}

	public Get( Session session )
	{
		super( session.getURI() );
		this.session = session;
		this.params = new Params();

//		if( session.getAppUUID() != null )
//			this.addParam( session.getAppUUID() );

		this.addHeader( "Accept", "application/json" );
		this.addHeader( "Content-Type", "application/json" );
	}

	public void addParam( String key, String value )
	{
		this.params.add( new BasicNameValuePair( key, value ) );
	}

	public void addParam( String value )
	{
		this.params.add( new BasicNameValuePair( "-ignore-" + value + "-ignore-", value ) );
	}

	@Override
	public URI getURI()
	{
		try
		{
			return new URI( "http", this.session.getHost() + ":" + this.session.getPort(), "/tangibleapi/" + ( this.session.getAppUUID() != null ? this.session.getAppUUID() + "/" : "" ) + this.params, null, null );
//			return new URI( "http", this.session.getHost() + ":" + this.session.getPort(), "/tangibleapi/" + this.params, null, null );
		}
		catch( URISyntaxException e )
		{
			e.printStackTrace();
			return null;
		}
	}

	public Session getSession()
	{
		return this.session;
	}

	@Override
	public String toString()
	{
		return this.getURI().toString();
	}

	@Override
	public void setSession( Session session )
	{
		this.session = session;
		super.setURI( this.session.getURI() );
	}
}
