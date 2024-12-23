const fs = require('node:fs');

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

let cheats = 0;

const findCheats = (point) => {
    const [i, j] = point;
    const cell = map[i][j];

    for (let ni = -20; ni <= 20; ni++) {
        const rem = Math.abs(ni);
        for (let nj = -20 + rem; nj <= 20 - rem; nj++) {
            const nextCell = map[i + ni]?.[j + nj];

            if (!nextCell || nextCell.type === '#') {
                continue;
            }

            const distance = Math.abs(ni) + Math.abs(nj);

            const diff = nextCell.stepCount - cell.stepCount - distance;

            if (diff >= 100) {
                cheats++;
            }
        }
    }
};

path.forEach(findCheats);

console.log(cheats);