const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./10-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const trailMap = input.split('\n').map(row => row.split('').map(cell => +cell));

let endsCount = 0;

const getEndsCount = (i, j, visited) => {
    if (trailMap[i][j] === 9) {
        return 1;
    }

    let count = 0;
    const nextValue = trailMap[i][j] + 1;

    if (j > 0 && trailMap[i][j - 1] === nextValue) {
        count += getEndsCount(i, j - 1);
    }

    if (i > 0 && trailMap[i - 1][j] === nextValue) {
        count += getEndsCount(i - 1, j);
    }

    if (j < trailMap[i].length - 1 && trailMap[i][j + 1] === nextValue) {
        count += getEndsCount(i, j + 1);
    }

    if (i < trailMap.length - 1 && trailMap[i + 1][j] === nextValue) {
        count += getEndsCount(i + 1, j);
    }

    return count;
};

for (let i = 0; i < trailMap.length; i++) {
    for (let j = 0; j < trailMap[i].length; j++) {
        if (trailMap[i][j] === 0) {
            endsCount += getEndsCount(i, j);
        }
    }
}

console.log(endsCount);