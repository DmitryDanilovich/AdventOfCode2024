const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./3-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const mul = (a, b) => a * b;

const multiplicationStrings = [...input
    .matchAll(/(^|do\(\))(?:(?!don't\(\)).)*(don't\(\)|$)/g)]
    .reduce((acc, doBlockMatch) => {
        [...doBlockMatch[0]
            .matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)/g)]
            .forEach(mulMatch => {
                acc += eval(mulMatch[0]);
            });

        return acc;
    }, 0);

console.log(multiplicationStrings);
