/*jslint devel: true,  */
/*global TangibleAPI: false */

var beforeunloadHandlers = [];
function make_TangibleAPI(appName, description, id, env) {
	"use strict";
	var tAPI = new TangibleAPI();
	return {
		api_access : function () {
			return tAPI;
		},
		get_reserved_device : function () {
			var list = tAPI.getReservedDevices(), dev, IdList;
			while ((dev = list.shift()) !== undefined) {
				IdList.push(dev.id);
			}
			return IdList;
		},
		reserve_new_device_sync : function () {
			var devId;
			tAPI.requestAnyDevice(
				function (data) {
					devId = data.msg;
				},
				function (data) {
					console.log('a reservation failed: ' + data.msg);
				}, 
				false
				);
			return devId;
		},
		reserve_new_device : function (onReserved) {
			tAPI.requestAnyDevice(onReserved,
				function (data) {
					console.log('an error arised while requesting the device: ' + data.msg);
				});
		}
	};
}
