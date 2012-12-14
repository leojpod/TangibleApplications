/*jslint devel: true */
/*global TangibleAPI: false, tangibleComponent: false, onErrorMaker: false, config4Satin: false*/
function make_TangibleBreathing(device_label, color, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
		devId,
		isReady = false,
		config = config4Satin(), 
		tangibleCategory = 'tangible';

	function initComponent() {
		componentAPI.useDevice(device_label,
			function (device_id) {
				devId = device_id;
				isReady = true;
			}, onErrorMaker("couldn't request " + device_label + " due to ")
			);
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
	return {
		start_breathing: function () {
			if (isReady) {
				var tAPI = componentAPI.getAPI();
				tAPI.fadeColor(devId, color, null, onErrorMaker("couldn't fade... "));
			}
		},
		stop_breathing : function () {
			if (isReady) {
				var tAPI = componentAPI.getAPI();
				tAPI.showColor(devId, color,  null, onErrorMaker("coudn't stop fading "));
			}
		}
	};
}
