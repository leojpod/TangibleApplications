var beforeunloadHandlers = [];
function addUnloadHandler(h) {
	"use strict";
	beforeunloadHandlers.push(h);
}

function make_TangibleColorGauge(min_level, max_level, min_color, max_color, id, env) {
	"use strict";
	var tAPI = new TangibleAPI(),
		devId = null,
		bColor,
		eColor;
	//  var exitOver = false;
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
		var rgb = rgbColor.b | (rgbColor.g << 8) | (rgbColor.r << 16);
		return rgb.toString(16);
	}
	function linearGradient(b_rgb, e_rgb, percent) {
		var diff = {}, gradRGB = {}, c;
		for (c in b_rgb) {
			if (b_rgb.hasOwnProperty(c)) {
				diff[c] = e_rgb[c] - b_rgb[c];
			}
		}
		for (c in diff) {
			if (diff.hasOwnProperty(c)) {
//				console.log('diff[' + c + '] = ' + diff[c]);
				gradRGB[c] = b_rgb[c] + diff[c] * percent;
//				console.log('grad[' + c + '] = ' + gradRGB[c]);
			}
		}
		return gradRGB;
	}

	function show_measurement(mes) {
		//console.log('min_level = ' + min_level + ' \t max_level = ' + max_level);
		mes = parseInt(mes,10);
		//console.log('mes = ' + mes);
		if (mes < min_level) {
			mes = min_level;
		} else if (mes > max_level) {
			mes = max_level;
		}
		var percent = (0.0 + mes - min_level) / (0.0 + max_level - min_level),
			color = convertToHex(linearGradient(bColor, eColor, percent));
		//console.log('mes = ' + mes + ' \t percent = ' + percent );
		tAPI.showColor(devId, color,
			function () {
				console.log('gauge updated');
			},
			function (d) {
				console.log('woops : ' + d.msg);
			}
			);
	}


	function init(step) {
		if (step === undefined) {
			console.log('step is undefined');
			step = 0;
		}
		console.log('init step #' + step);
		switch (step) {
		case 0:
			//first register
			tAPI.register('TangibleColorGauge', "A SATIN component that reserve one cube a display colors on it to represent a given measurement",
				function (data) {
					console.log('application registered: ' + data.msg);
					init(1);
				}, function (data) {
					console.log('impossible to register: ' + data.msg);
				});
			break;
		case 1:
			//then request a device
			tAPI.requestAnyDevice(
				function (data) {
					console.log('reservation made: ' + data.msg);
					devId = data.msg;
					init(2);
				},
				function (data) {
					console.log('reservation failed: ' + data.msg);
					init(2);
				}
			);
			break;
		case 2:
			//let's make sure that we exit properly
			var exitProperly = function (e) {
				var inAnyCase = function () {
					var weAreDonePopup = function () {
						//                exitOver = true;
						console.log('component perfectly ready to exit');
					};
					tAPI.unregister(weAreDonePopup, weAreDonePopup, false);
				};
				tAPI.releaseAllDevices(inAnyCase, inAnyCase, false);
			};
			addUnloadHandler(exitProperly);
			//and let's setup the gauge at the min_level
			show_measurement(min_level);
			break;
		default:
			break;
		}
	}
	bColor = convertToRGB(assertColor(min_color, '00ff00'));
	eColor = convertToRGB(assertColor(max_color, 'ff0000'));
	console.log('about to initialise the component');
	init();

	return {
		measurement: show_measurement
	};
}

window.onbeforeunload = function (e){
	"use strict";
	var handler;
	while ((handler = beforeunloadHandlers.shift()) !== undefined) {
		handler(e);
	}
	console.log('we are done with all the components');
};