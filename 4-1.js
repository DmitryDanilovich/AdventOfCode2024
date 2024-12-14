const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./4-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const parsedInput = input.split('\n');

const XMAS = 'XMAS';

let xCount = 0;

const hasXmas = (i, j) => {
    if (parsedInput[i][j] !== 'X') {
        return false;
    }

    for (let dirI = -1; dirI <= 1; dirI++) {
        for (let dirJ = -1; dirJ <= 1; dirJ++) {
            if (dirI === 0 && dirJ === 0) {
                continue;
            }

            let y = i + (dirI * 3);
            let x = j + (dirJ * 3);

            if (y < 0 
                || y >= parsedInput.length
                || x < 0
                || x >= parsedInput[i].length) {
                continue; 
            }

            let doesHaveXmas = true;
            
            for (let letterIndex = 1 ; letterIndex < XMAS.length; letterIndex++) {
                const nextI = i + (dirI * letterIndex);
                const nextJ = j + (dirJ * letterIndex);

                if (parsedInput[nextI][nextJ] !== XMAS[letterIndex]) {
                    doesHaveXmas = false;
                }
            }

            if (doesHaveXmas) {
                xCount++;
            }
        }
    }
}

for (let i = 0; i < parsedInput.length; i++) {
    for (let j = 0; j < parsedInput[i].length; j++) {
        hasXmas(i, j);
    }
}

console.log(xCount);