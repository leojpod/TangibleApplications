package se.nicklasgavelin.http;

import se.nicklasgavelin.request.RegisterEventRequest;
import se.nicklasgavelin.request.ShowColorRequest;

public class TangibleDevice
{
	public String _driver_id;
	public String type;
	public String protocolVersion;
	public String id;

	private TangibleAPIConnection connection;

	protected TangibleDevice( TangibleAPIConnection connection )
	{
		this.connection = connection;
	}
	
	public TangibleDevice()
	{
		
	}

	public void showColor( String color )
	{
		this.connection.send( new ShowColorRequest( this, color ) );
	}
	
	public void registerButtonEvent()
	{
		this.connection.send( new RegisterEventRequest( this ) );
	}

	public String getDriverId()
	{
		return this._driver_id;
	}

	public String getType()
	{
		return this.type;
	}

	public String getProtocolVersion()
	{
		return this.protocolVersion;
	}

	public String getId()
	{
		return this.id;
	}

	@Override
	public String toString()
	{
		return "Device " + this.getType() + ":" + this.getId();
	}

	public void setConnection( TangibleAPIConnection t )
	{
		this.connection = t;
	}
}
