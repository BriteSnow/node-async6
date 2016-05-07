
Minimalistic, zero dependency, async utilities for ES6, ES2015, node v6. This library assume node v6 or above with ES2015 Promise and generators. It has no dependency. 

## Promisify

Promisify a function which follow the standard callback(err, result) pattern. 

```js
const promisify = require("async6").promisify;

const glob   = require('glob');
const pglob  = promisify(glob);

// the call back way
glob("**/*.js", options, function (er, files) {
  // files is an array of filenames. 
})

// the promise way
pglob("**/*.js").then(files => console.log(files));
```

- Use the default Node v6, es2015 Promise. 
- Does not use ```bind()``` as there are some performance issues. 


## run

Run a generator function or generator function "instance" (after first call) that supports direct value, promise in yields, and return a ES2015 Promise which result with the return of the generator function.

```js
const run = require("async6").run;

function* mygen(val){
    val = val || 0;
    var a = yield 12;
    var b = yield getB();
    var c = yield getPromiseForC(); // can be any promise that have a then function.
    return a + b + c;
}
// assuming getB() return 8, and getPromiseForC() will resolve to 10.

run(mygen).then(v => console.log(v)); // 30

run(mygen(10)).then(v => console.log(v)); // 40
```

## Combining promise, yield, generator

```js
const async6 = require("async6").promisify;
const promisify = async6.promisify;
const run = async6.run;

const glob   = promisify(require('glob'));

// using generators, promise, and async6.run (see below)
function* listWebFiles(root){
    root = root || ""
    var jsFiles  = yield pglob(root + "**/*.js");
    var cssFiles = yield pglob(root + "**/*.css");
    return {jsFiles, cssFiles};
}

run(listWebFiles).then(r => console.log(`jsFiles:\n${r.jsFiles} \ncssFiles:\n${r.cssFiles}`));
// or
run(listWebFiles("./dist/")).then(r => console.log(`jsFiles:\n${r.jsFiles} \ncssFiles:\n${r.cssFiles}`));

```

