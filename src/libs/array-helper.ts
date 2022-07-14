// // async function toArray(asyncIterator){ 
// //     const arr=[]; 
// //     for await(const i of asyncIterator) arr.push(i); 
// //     return arr;
// // }


// // export const toArray = (asyncIterator: AsyncIterableIterator) => {
// //     const arr=[]; 
// //     for await(const i of asyncIterator) arr.push(i); 
// //     return arr;
// //   }


async function gen2array<T>(gen: AsyncIterable<T>): Promise<T[]> {
    const out: T[] = []
    for await(const x of gen) {
        out.push(x)
    }
    return out
}

export = gen2array;