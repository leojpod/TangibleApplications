/*jslint devel: true,  */
/*global TangibleAPI: false, tangibleComponent: false, onErrorMaker: false, config4Satin:false */

function make_TangibleButton(device_label, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
//		tAPI,
		devId,
		webSocket, 
		config = config4Satin(), 
		tangibleCategory = 'tangible';
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
				console.log('event Reserved');
			},
			onErrorMaker("initialisation failure: "));
	}
	//global init: 
	config.ensureCategory(tangibleCategory, 'Tangible Support');
	config.ensureConfig('tAPI_url', 'Tangible API server location', 'url', 
			tangibleCategory, true, 'localhost');
	
	componentAPI.init(config.value('tAPI_url', tangibleCategory));
	if (componentAPI.isReady()) {
		initComponent();
	} else {
		componentAPI.onReadyCallback(initComponent);
	}
	console.log('component initialised!');
}
