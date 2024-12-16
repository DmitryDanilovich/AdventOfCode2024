const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./10-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const trailMap = input.split('\n').map(row => row.split('').map(cell => +cell));

let endsCount = 0;

const findEnds = (i, j) => {
    if (trailMap[i][j] === 9) {
        return [[ i, j ]];
    }

    const ends = [];
    const nextValue = trailMap[i][j] + 1;

    if (j > 0 && trailMap[i][j - 1] === nextValue) {
        ends.push(...findEnds(i, j - 1));
    }

    if (i > 0 && trailMap[i - 1][j] === nextValue) {
        ends.push(...findEnds(i - 1, j));
    }

    if (j < trailMap[i].length - 1 && trailMap[i][j + 1] === nextValue) {
        ends.push(...findEnds(i, j + 1));
    }

    if (i < trailMap.length - 1 && trailMap[i + 1][j] === nextValue) {
        ends.push(...findEnds(i + 1, j));
    }

    return ends;
};

for (let i = 0; i < trailMap.length; i++) {
    for (let j = 0; j < trailMap[i].length; j++) {
        if (trailMap[i][j] === 0) {
            const ends = new Set(findEnds(i, j).map(end => JSON.stringify(end)));
            endsCount += ends.size;
        }
    }
}

console.log(endsCount);