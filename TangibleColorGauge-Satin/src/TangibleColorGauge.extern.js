/*jslint devel: true,  */
/*global TangibleAPI: false, tangibleComponent: false */


function make_TangibleColorGauge(device_label, min_level, max_level, min_color, max_color,
		id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
		tAPI,
		devId = null,
		bColor,
		mColor,
		med_level,
		eColor;
	
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

	function getComplementaryColor(a_color, another_color) {
		var add_color = {}, complementary = {}, c;
		for (c in a_color) {
			if (a_color.hasOwnProperty(c)) {
				add_color[c] = a_color[c] + another_color[c];
				if (add_color[c] > 255) {
					add_color[c] = 255;
				}
				complementary[c] = 255 - add_color[c];
			}
		}
		return complementary;
	}

	function linearGradient(b_rgb, e_rgb, percent) {
		var diff = {}, gradRGB = {}, c;
		for (c in b_rgb) {
			if (b_rgb.hasOwnProperty(c)) {
				diff[c] = e_rgb[c] - b_rgb[c];
				gradRGB[c] = b_rgb[c] + diff[c] * percent;
				gradRGB[c] = Math.floor(gradRGB[c]);
			}
		}
		return gradRGB;
	}
	function complementaryGradient(b_rgb, m_rgb, e_rgb, percent) {
		var diff = {}, gradRGB = {}, c;
		if (percent < 0.5) {
			percent = percent * 2;
			return linearGradient(b_rgb, m_rgb, percent);
		} else {
			percent = (percent - 0.5) * 2;
			return linearGradient(m_rgb, e_rgb, percent);
		}
	}

	function show_measurement(mes) {
		var prefix = "";
		// console.log('min_level = ' + min_level + ' \t max_level = ' + max_level);
		mes = parseFloat(mes, 10);
		// console.log('mes = ' + mes);
		if (mes < min_level) {
			mes = min_level;
			prefix = "< ";
		} else if (mes > max_level) {
			mes = max_level;
			prefix = "> ";
		}
		// var percent = (0.0 + mes - min_level) / (0.0 + max_level - min_level),
		var percent = (mes - min_level) / (max_level - min_level),
			color = convertToHex(complementaryGradient(bColor, mColor, eColor, percent));
		// console.log('mes = ' + mes + ' \t percent = ' + percent );
		tAPI.showColor(devId, color, function () {
			tAPI.showText(devId, prefix + mes, '000000', function () {
				console.log('gauge updated: ' + prefix + mes);
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
	
	bColor = convertToRGB(assertColor(min_color, '00ff00'));
	eColor = convertToRGB(assertColor(max_color, 'ff0000'));
	mColor = getComplementaryColor(bColor, eColor);
	med_level = (min_level + max_level) / 2;
	console.log('about to initialise the component');
	if (componentAPI.isReady()) {
		initComponent();
	} else {
		componentAPI.onReadyCallback(initComponent);
	}

	return {
		measurement : function (str) {
			if (devId !== undefined) {
				show_measurement(str);
			} else {
				console.log('the component is not ready yet');
			}
		}
	};
}