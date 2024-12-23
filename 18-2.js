const fs = require('node:fs');

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

const originalMap = Array.from(
    { length: 71 },
    () => Array.from(
        { length: 71 }, 
        () => ({stepCount: Infinity, type: '.'}),
    )
);

for (let i = 0; i < 1024; i++) {
    const [x, y] = blocks[i];
    originalMap[x][y] = { type: '#' };
};

const getMapCopy = () => originalMap.map(row => row.map(cell => ({ ...cell })));

const startingPoint = [0, 0];
const exitPoint = [70, 70];

const printMap = () => {
    const mapToPrint = originalMap.map(x => x.map(y => y.type));

    console.log(mapToPrint.map(x => x.join('')).join('\n'));
};

const findPath = (point = startingPoint, map) => {
    const [i, j] = point;

    if (map[i][j].type === '#') {
        return false;
    }

    map[i][j].visited = true;

    if (i === exitPoint[0] && j === exitPoint[1]) {
        return true;
    }

    let currentDirection = [0, 1];

    for (let d = 0; d < 4; d++) {
        const nextPoint = [i + currentDirection[0], j + currentDirection[1]];
        const nextCell = map[nextPoint[0]]?.[nextPoint[1]];

        if (nextCell
            && nextCell.type === '.'
            && !nextCell.visited){
            const hasPath = findPath(nextPoint, map);
            if (hasPath) {
                return true;
            }
        }

        currentDirection = [currentDirection[1], -currentDirection[0]];
    }

    return false;
};

for (let b = 1025; b < blocks.length; b++) {
    const [i, j] = blocks[b];
    originalMap[i][j] = { type: '#' };
    if (!findPath(startingPoint ,getMapCopy())) {
        console.log(`${j},${i}`);
        printMap();
        break;
    }
}

