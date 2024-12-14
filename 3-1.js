const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./3-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const mul = (a, b) => a * b;

const multiplicationStrings = [...input
    .matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)/g)]
    .reduce((acc, match) => acc + eval(match[0]), 0);

console.log(multiplicationStrings);
