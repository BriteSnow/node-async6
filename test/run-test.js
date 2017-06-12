var run = require("../index.js").run;






function wait(ms){
	return new Promise(function(resolve, fail){
		setTimeout(function(){
			resolve();
		}, ms);
	});
}