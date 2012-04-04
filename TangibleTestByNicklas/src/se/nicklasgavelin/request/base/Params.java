package se.nicklasgavelin.request.base;

import java.util.LinkedList;

import org.apache.http.message.BasicNameValuePair;

public class Params extends LinkedList<BasicNameValuePair>
{
	private static final long serialVersionUID = 8736207411623996054L;
	private String endSeparator = "/";
	private String separator = "/";

	public Params()
	{
		super();
	}

	public void setEndSeparator( String separator )
	{
		this.endSeparator = separator;
	}

	public void setSeparator( String separator )
	{
		this.separator = separator;
	}

	@Override
	public String toString()
	{
		String result = "";
		for( BasicNameValuePair s : this )
		{
			if( s.getName().startsWith( "-ignore-" ) && s.getName().endsWith( "-ignore-" ) )
				result += s.getValue() + this.endSeparator;
			else
				result += s.getName() + this.separator + s.getValue() + this.endSeparator;
		}

		if( result.length() > 0 )
			result = result.substring( 0, result.length() - 1 );
		return result;
	}
}
