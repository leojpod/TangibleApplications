package se.nicklasgavelin.response.handler;

import org.apache.http.client.methods.HttpRequestBase;

import se.nicklasgavelin.response.base.Response;
import se.nicklasgavelin.response.event.EventResponse;

public interface Handler
{
	public void handle( ResponseEvent responseEvent );

	public static class ResponseEvent
	{
		public enum RESPONSE_TYPE
		{
			RESPONSE_RECEIVED, EVENT_RECEIVED, ERROR_RECEIVED;
		}

		private RESPONSE_TYPE responseType;
		private Response response;
		private HttpRequestBase request;

		public ResponseEvent( RESPONSE_TYPE responseType, Response response )
		{
			this.responseType = responseType;
			this.response = response;
		}

		public ResponseEvent( RESPONSE_TYPE responseType, Response response, HttpRequestBase request )
		{
			this( responseType, response );
			this.request = request;
		}

		public ResponseEvent( RESPONSE_TYPE responseType, HttpRequestBase request )
		{
			this.responseType = responseType;
			this.request = request;
		}

		public RESPONSE_TYPE getResponseType()
		{
			return this.responseType;
		}

		public Response getResponse()
		{
			return this.response;
		}

		public HttpRequestBase getRequest()
		{
			return this.request;
		}
	}
}
