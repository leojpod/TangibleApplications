/*jslint devel: true,  */
/*global TangibleAPI: false, tangibleComponent: false, onErrorMaker: false */

function make_TangibleButton(device_label, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
//		tAPI,
		devId,
		webSocket;
	function initComponent() {
		componentAPI.useDevice(device_label,
			function (device_id) {
				devId = device_id;
//				tAPI = componentAPI.getAPI();
				//we now have access to our device, 
				//so let's set up the streaming and let's filter the messages... 
				componentAPI.subscribeToEvent(devId, 'released',
						function () {
							env.trigger();
						}, onErrorMaker("subscribtion failure: "));
			},
			onErrorMaker("initialisation failure: "));
	}
	if (componentAPI.isReady()) {
		initComponent();
	} else {
		componentAPI.onReadyCallback(initComponent);
	}
	console.log('component initialised!');
}
