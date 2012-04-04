package se.nicklasgavelin.response.event;

import se.nicklagavelin.util.json.Params;
import se.nicklasgavelin.response.base.Response;

public class EventResponse extends Response
{
	private Event msg;
	
	public EventResponse()
	{
		super();
	}
	
	public EVENT_TYPE getType()
	{
		return this.msg.getType();
	}
	
	public String getDeviceId()
	{
		return this.msg.getDeviceId();
	}
	
	public Params getParams()
	{
		return this.msg.getParams();
	}
}
