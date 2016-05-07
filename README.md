
Minimalistic, zero dependency, async utilities for ES6, ES2015, node v6. This library assume node v6 or above with ES2015 Promise and generators. It has no dependency. 

## run

```js
const run = require("async6");

function* mygen(val){
    val = val || 0;
    var a = yield 12;
    var b = yield getB();
    var c = yield getPromiseForC(); // can be any promise that have a then function.
    return a + b + c;
}
// assuming getB() return 8, and getPromiseForC() will resolve to 10.

run(mygen).then(r => console.log(v)); // 30

run(mygen(10)).then(r => console.log(v)); // 30
```


