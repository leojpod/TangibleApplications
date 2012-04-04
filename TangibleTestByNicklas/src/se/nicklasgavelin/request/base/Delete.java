package se.nicklasgavelin.request.base;

import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.client.methods.HttpDelete;
import org.apache.http.message.BasicNameValuePair;

public class Delete extends HttpDelete implements Request
{
	private Session session;
	private Params uriParams;
	private Params params;

	public Delete( String appuuid )
	{
		this( Session.getInstance( appuuid ) );
	}
	
	public Delete()
	{
		this("");
	}

	public Delete( Session session )
	{
		super( session.getURI() );
		this.session = session;
		this.uriParams = new Params();

		this.params = new Params();
		this.params.setSeparator( "=" );
		this.params.setEndSeparator( "&" );

		// Set header
		this.addHeader( "Accept", "application/json" );
		this.addHeader( "Content-Type", "application/json" );
		
//		if( session.getAppUUID() != null )
//			this.addURIParam( session.getAppUUID() );
	}

	public void addURIParam( String key, String value )
	{
		this.uriParams.add( new BasicNameValuePair( key, value ) );
	}

	public void addParam( String key, String value )
	{
		this.params.add( new BasicNameValuePair( key, value ) );
	}

	public void addURIParam( String value )
	{
		this.uriParams.add( new BasicNameValuePair( "-ignore-" + value + "-ignore-", value ) );
	}
	
	public Params getURIParams()
	{
		return this.uriParams;
	}

	@Override
	public URI getURI()
	{
		try
		{
			return new URI( "http", this.session.getHost() + ":" + this.session.getPort(), "/tangibleapi/" + ( this.session.getAppUUID() != null ? this.session.getAppUUID() + "/" : "" ) + this.uriParams, null, null );
//			return new URI( "http", this.session.getHost() + ":" + this.session.getPort(), "/tangibleapi/" + this.uriParams, null, null );
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
