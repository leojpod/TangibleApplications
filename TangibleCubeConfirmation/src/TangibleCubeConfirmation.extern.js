/*jslint devel: true, browser: true */
/*global TangibleAPI: false, tangibleComponent: false, onErrorMaker: false, 
	config4Satin:false, setTimeout:false, clearTimeout:false, jQuery:false*/

function make_TangibleCubeConfirmation(device_label, trigger_action, custom_message, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
//		tAPI,
		devId, 
		config = config4Satin(), 
		expecting_confirmation = false,
		timeout_var = null,
		popup_poped = false,
		tangibleCategory = 'tangible',
		confirmationCategory = 'tangibleConfirmation';
	function getTriggerEvent(action) {
		switch (action) {
			case 'shake':
				return 'shakingOver';
			case 'click':
				return 'released';
			case 'flip':
				return 'flipedUp';
			default:
				return 'shakingOver';	
		}
	}
	function just_confirmed() {
		expecting_confirmation = false;
		//let's check that the popup is open... 
		if (popup_poped) {
			(jQuery('#confirm-popup-' + id).data('popup-close'))();
		}
	}
	function initComponent() {
		componentAPI.useDevice(device_label,
			function (device_id) {
				devId = device_id;
//				tAPI = componentAPI.getAPI();
				//we now have access to our device, 
				//so let's set up the streaming and let's filter the messages... 
				componentAPI.subscribeToEvent(devId, getTriggerEvent(trigger_action),
						function () {
							console.log('trigger recevied ...');
							if (expecting_confirmation) {
								just_confirmed();
								if (timeout_var !== null) {
									clearTimeout(timeout_var);
								}
								console.log('confirmation confirmed... :x');
								env.confirmed();
							} else {
								console.log("... but not necessary... ");
							}
						}, onErrorMaker("subscribtion failure: "));
				console.log('event Reserved');
			},
			onErrorMaker("initialisation failure: "));
	}
	
	function initGUIMobile1_2_0() {
		console.log('mobile version');
		var popup_div = document.createElement('div');
		jQuery(popup_div).attr({
			'data-role': 'popup',
			id: 'confirm-popup-' + id,
			'class': 'ui-content',
			'data-transition': 'slideup'
		});
		jQuery(popup_div).append('<a href="#" data-rel="back" ' + 
				'data-role="button" data-icon="delete" ' + 
				'data-iconpos="notext" class="ui-btn-right">Close</a>');
		jQuery(popup_div).append('<h6>Confirmation required</h6>');
		jQuery(popup_div).append('<p>Please, ' + trigger_action + ' your cube to confirm ' 
				+ custom_message + ' or close this dialog to ignore');
		jQuery(popup_div).appendTo(jQuery('#main_div')).trigger('create');
		jQuery(popup_div).data('popup-open', 
				function () { jQuery(popup_div).popup('open'); });
		jQuery(popup_div).data('popup-close', 
				function () { jQuery(popup_div).popup('close'); });
		jQuery(popup_div).popup();
		
	}
	function debugObject(obj) {
//		var attr = null;
		console.log('printing all the elements of : '+obj);
//		for (attr in obj) {
//			console.log(attr + ' -> ' + typeof obj[attr] + ' --> ' + obj[attr]);
//		}
	}
	function initGUIjQueryDialog() {
		var popup_div = document.createElement('div'), 
			popup_opener = document.createElement('a'), 
			popup_closer = document.createElement('a');
		jQuery(popup_div).attr({
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
		}).text('Close').appendTo(popup_div);
//		jQuery(popup_div).append('<a href="#" data-rel="back" ' + 
//				'data-role="button" id="confirm-popup-closer-' + id + '" ' + 
//				'data-icon="delete" ' + 
//				'data-iconpos="notext" class="ui-btn-right">Close</a>');
		jQuery(popup_opener).attr({
			id: 'confirm-popup-opener-' + id,
			'data-rel': 'dialog',
			'data-transition': 'slideup',
			style: 'display:none',
			href: '#confirm-popup-' + id
		});
		jQuery(popup_div).append('<div data-role="header"><h6>Confirmation required</h6></div>');
		jQuery(popup_div).append('<div data-role="content"><p>Please, ' + trigger_action + ' your cube to confirm ' 
				+ custom_message + ' or close this dialog to ignore</p></div>');
		jQuery(popup_div).appendTo(jQuery('body'))
			.data('popup-open', function () {
//				jQuery.mobile.changePage(jQuery(popup_div), { transition:'slideup', role:'dialogue'});
				jQuery(popup_opener).trigger('click');
			}).data('popup-close', function() {
//				jQuery.mobile.changePage(jQuery('div[data-role="page"]').first());
				jQuery(popup_closer).trigger('click');
			}).trigger('create');
		
		
	}
	function initGUISimpleDialog() {
		console.log('simpledialog version');
		function initPopupDialog() {
			console.log('initpopup dialog...');
			var popup_div = document.createElement('div');
			jQuery(popup_div).attr({
				id: 'confirm-popup-' + id
			}).data('popup-open', 
					function () {
						debugObject(jQuery(popup_div));
						jQuery(popup_div).simpledialog2({
					    mode: 'blank',
					    headerText: 'Confirmation required',
					    headerClose: true,
					    blankContent: '<p>Please, ' + trigger_action + ' your cube to confirm ' 
					    + custom_message + ' or close this dialog to ignore</p>'
						});
			});
			jQuery(popup_div).data('popup-close',
					function () { jQuery.mobile.sdCurrentDialog.close(); }
			);
			jQuery(popup_div).appendTo(jQuery('#main_div')).trigger('create');
		}

		if (jQuery('link[href*="jquery.mobile.simpledialog.min.css"]').size() < 1) {
			console.log(';;; need to load script and css...');
			jQuery('<link>').appendTo('head').attr({
				rel: 'stylesheet',
				type: 'text/css',
				href: 'http://dev.jtsage.com/cdn/simpledialog/latest/jquery.mobile.simpledialog.min.css'
			});
			jQuery('<script>').appendTo('head').attr({
				type: 'text/javascript',
				src: 'http://dev.jtsage.com/cdn/simpledialog/latest/jquery.mobile.simpledialog2.min.js'
			});
//			jQuery.getScript('http://dev.jtsage.com/cdn/simpledialog/latest/jquery.mobile.simpledialog2.min.js', 
//					function () {
//				initPopupDialog();
//			});
//			initPopupDialog();
		} else {
			initPopupDialog();
		}
	}
	function initGUI() {
		if (jQuery('script[src*="jquery.mobile-1.2.0.min.js"]').size() < 1) {
//			initGUISimpleDialog();
			initGUIjQueryDialog();
		} else {
			initGUIMobile1_2_0();
		}
	}
//	function initGUI_test() {
//		if (jQuery('script[src*="jquery.mobile-1.2.0.min.js"]').size() < 1) {
//			jQuery('<link>').appendTo('head').attr({
//				rel: 'stylesheet',
//				type: 'text/css',
//				href: 'http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css'
//			});
//			jQuery('<script>').appendTo('head').attr({
//				type: 'text/javascript',
//				src: 'http://code.jquery.com/jquery-1.8.2.min.js'
//			});
//			jQuery('<script>').appendTo('head').attr({
//				type: 'text/javascript',
//				src: 'http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js'
//			});
//			var $jQuery = jQuery.noConflict(true); // http://api.jquery.com/jQuery.noConflict/
//			jQuery = $jQuery; // forces the new jQuery into global
//			console.log('sift to jQuery 1.8 done!');
//			jQuery(document).trigger('create');
//		}
//		initGUIMobile1_2_0();
//	}
	//global init: 
	config.ensureCategory(tangibleCategory, 'Tangible Support');
	config.ensureConfig('tAPI_url', 'Tangible API server location', 'url', 
			tangibleCategory, true, 'localhost');
	config.ensureCategory(confirmationCategory, 'Tangible Confirmation');
	config.ensureConfig('timeout', 'confirmation time out in seconds (0 = infinite time)',
			'number', confirmationCategory, false, 0);
	componentAPI.init(config.value('tAPI_url', tangibleCategory));
	if (componentAPI.isReady()) {
		initComponent();
	} else {
		componentAPI.onReadyCallback(initComponent);
	}
	initGUI();
	return {
		confirmation_required: function () {
			var delay = parseInt(config.value('timeout', confirmationCategory),10) * 1000; 
			expecting_confirmation = true;
			(jQuery('#confirm-popup-' + id).data('popup-open'))();
			if (delay > 0) {
				timeout_var = setTimeout(function () {
					(jQuery('#confirm-popup-' + id).data('popup-close'))();
					expecting_confirmation = false;
					timeout_var = null;
				}, delay);
			}
		}
	};
}
