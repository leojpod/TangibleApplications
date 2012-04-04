package se.nicklasgavelin.request;

import se.nicklasgavelin.request.base.Put;
import se.nicklasgavelin.request.base.Session;

public class RegisterApplicationRequest extends Put
{
	public RegisterApplicationRequest( Session session, String appname, String description )
	{
		super( session );

		super.addURIParam( "app", "registration" );
		
		super.addParam( "appname", appname );
		super.addParam( "description", description );
	}
}
