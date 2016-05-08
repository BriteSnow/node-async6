// zero dependency, yeah!

module.exports = {
	promisify,
	run
};

// --------- Async Run Generator --------- //
// A simple method to run a generator method or instanced
// usage: 
//   run(mygen); // pass the function 
//   run(mygen()); // pass the instantiation of the generator
// returns: 
//   a promise;
function run(it){

	var ret;

	// if the "it" is a Function, then, run it (assume it is a generator). 
	if (it instanceof Function){
		it = it();
	}

	return new Promise(function(resolve, reject){
		function iterate(val){
			try{
				ret = it.next(val);			
				if (!ret.done){
					// Note: To support only es2015 Promise we could have had "... instanceof Promise",
					//       but checking .then allows to support other Promise libraries, like Bluebird.
					if (!isNull(ret.value) && ret.value.then instanceof Function){

						// on success, just iterate
						ret.value.then(v => {
							iterate(v);
						});
						// on reject, we throw on the iterator

						ret.value.catch(e => {
							reject(e);
							return;
						});
					}else{
						// If we have a direct value, then, just iterate at the end of this event loop (i.e. after but in the same loop).
						process.nextTick(function(){
							iterate(ret.value);
						});
					}
				}else{
					// we resolve this master Promise
					resolve(ret.value);
					return;
				}
			}catch(err){
				reject(err);
				return;
			}
		}

		iterate();
	}).catch(e => {
		console.log("ERROR run ", e, e.stack);
		// TODO: needs to undertand this better.
		it.throw(e);
	});
}
// --------- /Async Run Generator --------- //

// --------- Promisify --------- //
// A minimalistic promisify method. 
// - Avoiding .bind() as some perf tests performance issues -even when running the bound method-.
// - Using only ES2015 Promise (might not be as performant as bluebird, but there is value to minimize dependencies)
function promisify(fn, ctx){
	return function(){
		var args = arguments;

		return new Promise(function(resolve, reject){

			function callback(err, result){
				if (err){
					reject(new Error(err));
				}else{
					resolve(result);
				}
			}			

			try{
				// add the callback method to the arguments
				// see http://stackoverflow.com/a/13611033/686724 (in short, no need to shallow copy the arguments)
				Array.prototype.push.call(args, callback);
				// execute the function with the new callback
				fn.apply(ctx,args);
			}catch(e){
				console.log("ERROR - promisify method run error", e);
				reject(e);
			}
		});		
	};
}
// --------- /Promisify --------- //

// --------- Object Utils --------- //
var UD = "undefined";
// return true if value is null or undefined
function isNull(v){
	return (typeof v === UD || v === null);
}
// --------- /Object Utils --------- //
