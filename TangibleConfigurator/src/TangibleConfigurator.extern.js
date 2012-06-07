/*jslint devel: true,  */
/*global TangibleAPI: false, tangibleComponent: false, onErrorMaker: false */
function make_TangibleConfigurator(tangible_server, id, env) {
	"use strict";
	var tComp = tangibleComponent();
	tComp.init(tangible_server);
	tComp.init = undefined;
	return {};
}
