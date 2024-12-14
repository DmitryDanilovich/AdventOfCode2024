const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./4-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const parsedInput = input.split('\n');

let xCount = 0;

const hasXmas = (i, j) => {
    if (parsedInput[i][j] !== 'A') {
        return false;
    }

    const firstDiagonal = `${parsedInput[i - 1][j - 1]}${parsedInput[i + 1][j + 1]}`;
    const secondDiagonal = `${parsedInput[i - 1][j + 1]}${parsedInput[i + 1][j - 1]}`;

    if ((firstDiagonal === 'MS' || firstDiagonal === 'SM')
        && (secondDiagonal === 'MS' || secondDiagonal === 'SM')) {
        xCount++;
    }
}

for (let i = 1; i < parsedInput.length - 1; i++) {
    for (let j = 1; j < parsedInput[i].length -1; j++) {
        hasXmas(i, j);
    }
}

console.log(xCount);