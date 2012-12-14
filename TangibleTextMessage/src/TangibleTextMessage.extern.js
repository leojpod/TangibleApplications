/*jslint devel: true,  */
/*global TangibleAPI: false, tangibleComponent: false, config4Satin: false */
function make_TangibleTextMessage(device_label, default_text_color, 
		default_background_color, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
		tAPI,
		devId = null,
		config = config4Satin(), 
		tangibleCategory = 'tangible',
		text_color,
		bg_color;
	
	function assertColor(supposedColor, defaultColor) {
		var regex = /^([a-f]|[0-9]){6}$/i;
		return (regex.test(supposedColor)) ? supposedColor : defaultColor;
	}
	function convertToRGB(hexColor) {
		var rgb = {
			r : parseInt(hexColor.substring(0, 2), 16),
			g : parseInt(hexColor.substring(2, 4), 16),
			b : parseInt(hexColor.substring(4, 6), 16)
		};
		return rgb;
	}
	function convertToHex(rgbColor) {
		var rgb = rgbColor.b + (rgbColor.g * Math.pow(2, 8))
				+ (rgbColor.r * Math.pow(2, 16));
		return rgb.toString(16);
	}

	function show_message(msg) {
		tAPI.showColor(devId, bg_color, function () {
			tAPI.showText(devId, msg, text_color, function () {
				//done!
			}, function (d) {
				console.log('woops: ' + d.msg);
			});
		}, function (d) {
			console.log('woops: ' + d.msg);
		});
	}

	function initComponent() {
		componentAPI.useDevice(device_label,
				function (device_id) {
					devId = device_id;
					tAPI = componentAPI.getAPI();
				},
				function (data) {
					console.log('something went wrong : ' + data.msg);
				});
	}
	
	text_color = assertColor(default_text_color, 'ffffff');
	bg_color = assertColor(default_background_color, 'ffffff');
	console.log('about to initialise the component');
	
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
		text : function (msg) {
			show_message(msg);
		},
		new_text_color: function (c_str) {
			text_color = assertColor(c_str, text_color);
		},
		new_background_color: function (c_str) {
			bg_color = assertColor(c_str, text_color);
		}
	};
}