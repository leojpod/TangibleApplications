/*jslint devel: true,  */
/*global TangibleAPI: false */

//function make_TangibleColorDisplayOld(id, env) {
//  var componentUUID;
//  var cubeId;
//  var availableDevs;
//  var idx = 0;
//  function init(step){
//    if(typeof step == 'undefined'){
//      step = 0;
//    }
//    switch(step){
//      case 0:
//        //Register:
//        registerApplication("TangibleColorDisplay", "A SATIN component that reserve one cube a display colors on it",
//          function(isSuccess, data){
//            if(isSuccess){
//              console.log('component registered!');
//              componentUUID = data.msg;
//              init(1);
//            }else{
//              console.log("Coudn't register the component in the tangibleAPI");
//            }
//          });
//        break;
//      case 1:
//        //get The list of available devices
//        getDeviceList(componentUUID,
//          function(isSuccess, data){
//            if(isSuccess){
//              availableDevs = data.msg;
//              if(availableDevs.length == 0){
//                console.log("no available devices");
//              }else{
//                init(2);
//              }
//            }else{
//              console.log("problem retriving the available devices");
//            }
//          });
//        break;
//      case 2:
//        //request a device
//        reserveDeviceById(componentUUID, availableDevs[idx].id,
//          function(s, data){
//            if(s){
//              //worked
//              cubeId = data.msg;
//            }else{
//              if(idx > availableDevs.length){
//                console.log('let\'s forget about it');
//              }else{
//                idx ++;
//                init(2);
//              }
//            }
//          });
//        break;
//      default:
//    }
//  }
//
//  init();
//
//  //Return the compulsory SATIN structure!
//  return {
//    color: function(color){
//      currentColor = color;
//      showColor(componentUUID, cubeId, color,
//        function(s, data){
//          if(s){
//            console.log('yipii');
//          }else{
//            console.log('we failed');
//          }
//        });
//    }
//  };
//}

var beforeunloadHandlers = [];
function addUnloadHandler(h) {
	beforeunloadHandlers.push(h);
}
function make_TangibleColorDisplay(id, env) {
	var tAPI = new TangibleAPI(), devId = null;
	// var exitOver = false;
	function init(step) {
		if (step === undefined) {
			step = 0;
		}
		switch (step) {
		case 0:
			// first register
			tAPI.register('TangibleColorDisplay',
					"A SATIN component that reserve one cube a display colors on it",
					function (data) {
						console.log('application registered: ' + data.msg);
						init(1);
					}, function (data) {
						console.log('impossible to register: ' + data.msg);
					});
			break;
		case 1:
			// then request a device
			tAPI.requestAnyDevice(function (data) {
				console.log('reservation made: ' + data.msg);
				devId = data.msg;
			}, function (data) {
				console.log('reservation failed: ' + data.msg);
			});
			init(2);
			break;
		case 2:
			// let's make sure that we exit properly
			var exitProperly = function (e) {
				var inAnyCase = function () {
					var weAreDonePopup = function () {
						// exitOver = true;
						console.log('component perfectly ready to exit');
					};
					tAPI.unregister(weAreDonePopup, weAreDonePopup, false);
				};
				tAPI.releaseAllDevices(inAnyCase, inAnyCase, false);
			};
			addUnloadHandler(exitProperly);
			break;
		default:
		}
	}
	init();

	// function getExitover(){ return exitOver;}

	// function fibowaiting(e_1,e_2){
	// var i;var e_i_minus_1 = e_2;var e_i_minus_2 = e_1;
	// for(i = 3; !getExitover(); i++){
	// var e_i = e_i_minus_1 + e_i_minus_2;
	// e_i_minus_2 = e_i_minus_1;
	// e_i_minus_1 = e_i;
	// }
	// console.log('while waiting for the requests to be done, I had time to
	// compute fibo('+i+')='+e_i+' ...');
	// }
	// Return the compulsory SATIN structure!
	return {
		color : function (color) {
			tAPI.showColor(devId, color, function () {
				console.log('color displayed!');
			}, function (data) {
				console.log('woops : ' + data.msg);
			});
		}
	};
}
window.onbeforeunload = function (e) {
	var handler;
	while ((handler = beforeunloadHandlers.shift()) !== undefined) {
		handler(e);
	}
	console.log('we are done with all the components');
};
