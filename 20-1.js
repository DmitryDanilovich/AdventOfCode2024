const fs = require('node:fs');
const { type } = require('node:os');

let input;

try {
    input = fs.readFileSync('./20-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const map = input
    .split('\n')
    .map(x => x.split('').map(y => ({type: y, stepCount: Infinity})));

let startPoint;
let path = [];

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j].type === 'S') {
            startPoint = [i, j];
            break;
        }
    }

    if (startPoint) {
        break;
    }
}

let point = startPoint;
let stepsCount = 0;

while(true) {
    const [i, j] = point;

    map[i][j].stepCount = stepsCount;
    path.push(point);

    if (map[i][j].type === 'E') {
        break;
    }

    let currentDirection = [0, 1];

    for (let d = 0; d < 4; d++) {
        const nextPoint = [i + currentDirection[0], j + currentDirection[1]];
        const nextCell = map[nextPoint[0]]?.[nextPoint[1]];

        if (nextCell
            && nextCell.type !== '#'
            && nextCell.stepCount > stepsCount + 1){
            point = nextPoint;
            stepsCount++;
            break;
        }

        currentDirection = [currentDirection[1], -currentDirection[0]];
    }
};

const cheats = new Map();

const findCheats = (point, stepsCount) => {
    const [i, j] = point;

    let wallDirection = [0, 1];

    for (let wd = 0; wd < 4; wd++) {
        wallDirection = [wallDirection[1], -wallDirection[0]];

        const wallPoint = [i + wallDirection[0], j + wallDirection[1]];
        const wallCell = map[wallPoint[0]]?.[wallPoint[1]];

        if (!wallCell || wallCell.type !== '#'){
            continue;
        }

        let nextDirection = [-wallDirection[0], -wallDirection[1]];

        for (let d = 0; d < 3; d++) {
            nextDirection = [nextDirection[1], -nextDirection[0]];

            const nextPoint = [wallPoint[0] + nextDirection[0], wallPoint[1] + nextDirection[1]];
            const nextCell = map[nextPoint[0]]?.[nextPoint[1]];

            if (!nextCell || nextCell.type === '#'){
                continue;
            }

            const diff = nextCell.stepCount - stepsCount - 2;

            if (diff > 0) {
                cheats.set(`[${wallPoint}][${nextPoint}]`, diff);
            }
        }
    }
};

for (let point of path) {
    findCheats(point, map[point[0]][point[1]].stepCount);
}

const result = Array.from(cheats.values())
    .filter(x => x >= 100)
    .length;

console.log(result);