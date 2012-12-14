/*jslint devel: true,  */
/*global TangibleAPI: false, tangibleComponent: false */

function make_TangibleColorDisplay(device_label, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
		tAPI,
		config = config4Satin(), 
		tangibleCategory = 'tangible',
		devId;
	function initComponent() {
		componentAPI.useDevice(device_label,
			function (device_id) {
				devId = device_id;
				tAPI = componentAPI.getAPI();
			},
			function (data) {
				console.log('something went wrong: ' + data.msg);
			});
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
	// Return the compulsory SATIN structure!
	return {
		color : function (color) {
			if (devId !== undefined) {
				tAPI.showColor(devId, color, function () {
					console.log('color displayed!');
				}, function (data) {
					console.log('woops : ' + data.msg);
				});
			} else {
				console.log('the component is not ready yet!');
			}
		}
	};
}
