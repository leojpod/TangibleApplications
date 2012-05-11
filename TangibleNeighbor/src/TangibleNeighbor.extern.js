/*jslint devel: true,  */
/*global TangibleAPI: false, tangibleComponent: false, onErrorMaker: false */
function make_TangibleNeighbor(first_device_label, second_device_label, reportingOption, id, env) {
	"use strict";
	var componentAPI = tangibleComponent(),
		fstDevId,
		sndDevId;

	function initComponent() {
		componentAPI.useDevice(first_device_label,
			function (device_id) {
				fstDevId = device_id;
				componentAPI.useDevice(second_device_label,
						function (device_id_bis) {
							sndDevId = device_id_bis;
							if (reportingOption === 'onNeighborAdded' || reportingOption === 'onBoth') {
								componentAPI.subscribeToEvent(fstDevId, 'neighborAdded',
										function (params) {
											if (params.neighborId === sndDevId) {
												env.onNeighbor({type: 'added', cubeSide: params.cubeSide, neighborSide: params.neighborSide});
											}
										}, onErrorMaker("subscribtion failure: "));
							}
							if (reportingOption === 'onNeighborRemoved' || reportingOption === 'onBoth') {
								componentAPI.subscribeToEvent(fstDevId, 'neighborRemoved',
										function (params) {
											if (params.neighborId === sndDevId) {
												env.onNeighbor({type: 'removed', cubeSide: params.cubeSide, neighborSide: params.neighborSide});
											}
										}, onErrorMaker("subscribtion failure: "));
							}
						},
						onErrorMaker("couldn't request " + second_device_label + " due to: ")
				);
			},
			onErrorMaker("couldn't request " + first_device_label + " due to: "));
	}
	if (componentAPI.isReady()) {
		initComponent();
	} else {
		componentAPI.onReadyCallback(initComponent);
	}
	return {};
}
