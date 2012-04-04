package se.nicklasgavelin.response.event;

import se.nicklagavelin.util.json.Params;

public class EventInstance
{
	private String event;
	private String devId;
	
	private Params params;
	
	public EVENT_TYPE getType()
	{
		return EVENT_TYPE.valueOf( this.event.toUpperCase() );
	}
	
	public String getDeviceId()
	{
		return this.devId;
	}
	
	public Params getParams()
	{
		return this.params;
	}
}
