package se.nicklagavelin.util.json;

import se.nicklasgavelin.response.event.EVENT_TYPE;

public class Params
{
	public String x;
	public String y;
	public String z;

	public String neighborId;
	public String cubeSide;
	public String neighborSide;

	public int getX()
	{
		return Integer.parseInt( x );
	}

	public int getY()
	{
		return Integer.parseInt( y );
	}

	public int getZ()
	{
		return Integer.parseInt( z );
	}

	public String getNeighborId()
	{
		return this.neighborId;
	}

	public CUBE_SIDE getCubeSide()
	{
		return CUBE_SIDE.valueOf( this.cubeSide.toUpperCase() );
	}

	public CUBE_SIDE getNeighborSide()
	{
		return CUBE_SIDE.valueOf( this.neighborSide.toUpperCase() );
	}

	public boolean isNeighboringEvent()
	{
		return( neighborId != null );
	}
}
