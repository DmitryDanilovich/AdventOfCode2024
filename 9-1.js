const fs = require('node:fs');
const { parse } = require('node:path');

let input;

try {
    input = fs.readFileSync('./9-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const dataArray = input.split('');

const memoryBlocks = [];

let endOfLineIndex = dataArray.length % 2
    ? dataArray.length - 1
    : dataArray.length - 2;

const endOfLineSymbols = [];

const accumulateEndOfLineSymbols = (length) => {
    while (endOfLineSymbols.length < length) {
        const block = Array.from({ length: +dataArray[endOfLineIndex] }, () => endOfLineIndex / 2);
        endOfLineSymbols.splice(0, 0, ...block);

        endOfLineIndex -= 2;
    }
}

const getEndOfLineSymbols = (length) => {
    if (endOfLineSymbols.length <= length) {
        accumulateEndOfLineSymbols(length);
    }

    return endOfLineSymbols.splice(-length, length).reverse();
}

for (let i = 0; i <= endOfLineIndex; i++) {
    let block;

    const length = +dataArray[i];

    if (i % 2 === 0) {
        block = Array.from({ length: length }, () => i / 2);
    } else {
        block = getEndOfLineSymbols(length);
    }

    memoryBlocks.push(...block);
}

memoryBlocks.push(...endOfLineSymbols);

const result = memoryBlocks
    .reduce((acc, value, index) => {
        acc += value * index;
        return acc;
    }, 0);

console.log(result);