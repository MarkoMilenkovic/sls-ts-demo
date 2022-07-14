"use strict";
// // async function toArray(asyncIterator){ 
// //     const arr=[]; 
// //     for await(const i of asyncIterator) arr.push(i); 
// //     return arr;
// // }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
// // export const toArray = (asyncIterator: AsyncIterableIterator) => {
// //     const arr=[]; 
// //     for await(const i of asyncIterator) arr.push(i); 
// //     return arr;
// //   }
async function gen2array(gen) {
    var e_1, _a;
    const out = [];
    try {
        for (var gen_1 = __asyncValues(gen), gen_1_1; gen_1_1 = await gen_1.next(), !gen_1_1.done;) {
            const x = gen_1_1.value;
            out.push(x);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (gen_1_1 && !gen_1_1.done && (_a = gen_1.return)) await _a.call(gen_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return out;
}
module.exports = gen2array;
//# sourceMappingURL=array-helper.js.map