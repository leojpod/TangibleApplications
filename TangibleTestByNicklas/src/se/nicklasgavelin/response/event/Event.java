package se.nicklasgavelin.response.event;

import se.nicklagavelin.util.json.Params;

public class Event
{
	private String flow;
	private EventInstance msg;
	
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
