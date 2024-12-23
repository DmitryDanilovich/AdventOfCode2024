const fs = require('node:fs');
const { type } = require('node:os');

let input;

try {
    input = fs.readFileSync('./18-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const blocks = input
    .split('\n')
    .map(x => {
        const coordinaters = x.split(',');
        return [coordinaters[1], coordinaters[0]];
    });

const map = Array.from(
    { length: 71 },
    () => Array.from(
        { length: 71 }, 
        () => ({stepCount: Infinity, type: '.'}),
    )
);

for (let i = 0; i < 1024; i++) {
    const [x, y] = blocks[i];
    map[x][y] = { type: '#' };
};

const startingPoint = [0, 0];
const exitPoint = [70, 70];

const printMap = (visitedPoints = []) => {
    const mapToPrint = map.map(x => x.map(y => y.type));
    visitedPoints.forEach(([i, j]) => {
        mapToPrint[i][j] = 'O';
    });

    console.log(mapToPrint.map(x => x.join('')).join('\n'));
};

const step = (point = startingPoint, stepsCount = 0, visitedPoints = []) => {
    const [i, j] = point;

    if (map[i][j].type === '#') {
        return Infinity;
    }

    if (map[i][j].stepCount <= stepsCount) {
        return Infinity;
    }

    map[i][j].stepCount = stepsCount;

    if (i === exitPoint[0] && j === exitPoint[1]) {
        printMap(visitedPoints);
        console.log(stepsCount);

        return stepsCount;
    }

    const results = [];

    let currentDirection = [0, 1];

    for (let d = 0; d < 4; d++) {
        const nextPoint = [i + currentDirection[0], j + currentDirection[1]];
        const nextCell = map[nextPoint[0]]?.[nextPoint[1]];

        if (nextCell
            && nextCell.type === '.'
            && nextCell.stepCount > stepsCount + 1
            && !visitedPoints.some(([x, y]) => x === nextPoint[0] && y === nextPoint[1])){
            resultStepsCount = step(nextPoint, stepsCount + 1, [...visitedPoints, point]);
            results.push(resultStepsCount);
        }

        currentDirection = [currentDirection[1], -currentDirection[0]];
    }

    return Math.min(...results);
};

console.log(step());
