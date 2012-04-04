package se.nicklasgavelin.request.base;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;

public class Post extends HttpPost implements Request
{
	private Session session;
	private HttpParams params;

	public Post( String appuuid )
	{
		super();
		this.session = Session.getInstance( appuuid );
		this.params = new BasicHttpParams();
		
		super.setParams( params );
	}
	
	public Post()
	{
		this("");
	}

	public Post( Session session )
	{
		super();
		this.session = session;
	}
	
	public void addParam( String key, Object value )
	{
		this.params.setParameter( key, value );
	}

	@Override
	public HttpParams getParams()
	{
		super.setParams( this.params );
		return this.params;
	}
	
	public Session getSession()
	{
		return this.session;
	}
	
	@Override
	public void setSession( Session session )
	{
		this.session = session;
		super.setURI( this.session.getURI() );
	}
}
