package se.nicklasgavelin.request.base;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;

public class Put extends HttpPut implements Request
{
	private Session session;
	private Params uriParams;
	private Params params;

	public Put( String appuuid )
	{
		this( Session.getInstance( appuuid ) );
	}

	public Put()
	{
		this( "" );
	}

	public Put( Session session )
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

// if( session.getAppUUID() != null )
// this.addURIParam( session.getAppUUID() );
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

	private void updateEntity()
	{
		try
		{
			StringEntity entity = new StringEntity( this.params.toString(), "UTF-8" );
			entity.setContentType( "application/json" );
			this.setEntity( entity );
		}
		catch( UnsupportedEncodingException e )
		{
			e.printStackTrace();
		}
	}

	@Override
	public URI getURI()
	{
		this.updateEntity();

		try
		{
			return new URI( "http", this.session.getHost() + ":" + this.session.getPort(), "/tangibleapi/" + ( this.session.getAppUUID() != null ? this.session.getAppUUID() + "/" : "" ) + this.uriParams, null, null );
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
	public void setSession( Session session )
	{
		this.session = session;
		super.setURI( session.getURI() );
	}

	@Override
	public String toString()
	{
		return this.getURI().toString();
	}
}
