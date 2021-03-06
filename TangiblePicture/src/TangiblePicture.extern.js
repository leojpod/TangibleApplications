/*jslint devel: true */
/*global TangibleAPI: false, tangibleComponent: false, onErrorMaker: false, config4Satin: false */
function make_TangiblePicture(device_label, initial_picture, show_at_start, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
		devId,
		tAPI,
		config = config4Satin(), 
		tangibleCategory = 'tangible',
		isReady = false;

	function initComponent() {
		componentAPI.useDevice(device_label,
			function (device_id) {
				devId = device_id;
				tAPI = componentAPI.getAPI();
				isReady = true;
				if (show_at_start === true) {
					tAPI.showPicture(devId, initial_picture, 
							function () {
								console.log('showPicture command excecuted with success');
							}, onErrorMaker("couldn't display the picture: "));
				}
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
	return {
		show_picture : function (url) {
			if (isReady) {
				tAPI.showPicture(devId, url,
						function () {
							console.log("refreshing the picture was successful");
					}, onErrorMaker("couldn't put a new pic: "));
			}
		}
	};
}
