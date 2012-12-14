/*jslint bitwise: false, continue: false, debug: false, eqeq: false,
	es5: false, evil: false, forin: false, newcap: false, nomen: false,
	plusplus: false, regexp: false, undef: false, unparam: false, sloppy: false,
	stupid: false, sub: false, todo: false, vars: false, white: false, css: false,
	cap: false, on: false, fragment: false, browser: true, adsafe: false,
	devel: true, indent: 4, maxlen: 80 */
/*global jQuery: false*/

/**
 * @constructor
 */
function NotificationDiv(trigger_action, custom_message, device_label) {
	var div = document.createElement('div');
	jQuery(div);
	return div;
}

function PopupDiv(trigger_action, custom_message, device_label) {
	var div = new NotifivationDiv(trigger_action, device_label);
	function initGUIMobile_1_2_0(adiv) {
		jQuery(adiv).attr({
			'data-role': 'popup',
			id: 'confirm-popup-' + id,
			'class': 'ui-content',
			'data-transition': 'slideup'
		});
		jQuery(adiv).append('<a href="#" data-rel="back" ' + 
				'data-role="button" data-icon="delete" ' + 
				'data-iconpos="notext" class="ui-btn-right">Close</a>');
		jQuery(adiv).append('<h6>Confirmation required</h6>');
		jQuery(adiv).append('<p>Please, ' + trigger_action
				+ ' your cube to confirm ' 
				+ custom_message + ' or close this dialog to ignore');
		jQuery(adiv).appendTo(jQuery('#main_div')).trigger('create');
	}
	function initGUIDialog(adiv) {
		var	popup_opener = document.createElement('a'), 
			popup_closer = document.createElement('a');
		jQuery(adiv).attr({
			'data-role': 'page',
			id: 'confirm-popup-' + id,
			'class': 'ui-content',
			'data-transition': 'slideup'
		});
		jQuery(popup_closer).attr({
			href: '#',
			'data-rel': 'back',
			id: 'confirm-popup-closer-' + id,
			'data-icon': 'delete',
			'data-iconpos': 'notext',
			'class': 'ui-btn-right',
			'data-transision': 'slideup',
			'data-reverse': true
		}).text('Close').appendTo(adiv);
	//	jQuery(popup_div).append('<a href="#" data-rel="back" ' + 
	//			'data-role="button" id="confirm-popup-closer-' + id + '" ' + 
	//			'data-icon="delete" ' + 
	//			'data-iconpos="notext" class="ui-btn-right">Close</a>');
		jQuery(popup_opener).attr({
			id: 'confirm-popup-opener-' + id,
			'data-rel': 'dialog',
			'data-transition': 'slideup',
			style: 'display:none',
			href: '#confirm-popup-' + id
		});
		jQuery(adiv).append(
			'<div data-role="header"><h6>Confirmation required</h6></div>'
		).append(
			'<div data-role="content"><p>Please, ' + 
				trigger_action + ' your cube to confirm ' 
				+ custom_message + ' or close this dialog to ignore</p></div>'
		).appendTo(jQuery('body'))
			.data('popup-open', function () {
				jQuery(popup_opener).trigger('click');
				popup_poped = true;
			}).data('popup-close', function () {
				jQuery(popup_closer).trigger('click');
				popup_poped = false;
			}).trigger('create');
	}
	if (jQuery('script[src*="jquery.mobile-1.2.0.min.js"]').size() < 1) {
//	initGUISimpleDialog();
		initGUIjQueryDialog(div);
	} else {
		initGUIMobile1_2_0(div);
	}
	jQuery(div).data('ask-confirmation', function () {
		(div.data('popup-open'))();
	});
	jQuery(div).data('end-confirmation', function () {
		(div.data('popup-close'))();
	});
	return div;
}
function StaticNotificationDiv(id,
		trigger_action, custom_message, device_label) {
	var div = new NotificationDiv(trigger_action, custom_message, device_label);
	jQuery(div).attr
	return div;
}

function make_PolyTangibleCubeConfirmation(
	device_label, 
	trigger_action, 
	custom_message, 
	gui_element, 
	id, 
	env
) {
	
}