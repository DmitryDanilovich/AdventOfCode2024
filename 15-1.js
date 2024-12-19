const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./15-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const [ mapString, movesString ] = input.split('\n\n');

const map = mapString
    .split('\n')
    .map(row => row.split(''));

let currentPosition;

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '@') {
            currentPosition = [ i, j ];
            break;
        }
    }
}

map[currentPosition[0]][currentPosition[1]] = '.';

const directionsMap = {
    '^': [ -1, 0 ],
    '>': [ 0, 1 ],
    'v': [ 1, 0 ],
    '<': [ 0, -1 ],
};

const moves = movesString
    .split('\n')
    .join('')
    .split('')
    .map(x => directionsMap[x]);


const moveBoxes = (position, direction) => {
    let lastBoxInRowPosition = [
        position[0] + direction[0],
        position[1] + direction[1],
    ];

    while (map[lastBoxInRowPosition[0] + direction[0]][lastBoxInRowPosition[1] + direction[1]] === 'O') {
        lastBoxInRowPosition = [
            lastBoxInRowPosition[0] + direction[0],
            lastBoxInRowPosition[1] + direction[1],
        ];
    }

    const nextAfterLastBoxInRowPosition = [
        lastBoxInRowPosition[0] + direction[0],
        lastBoxInRowPosition[1] + direction[1],
    ];

    if (map[nextAfterLastBoxInRowPosition[0]][nextAfterLastBoxInRowPosition[1]] === '#'){
        return false;
    }


    let newPosition = nextAfterLastBoxInRowPosition;

    map[newPosition[0]][newPosition[1]] = 'O';
    map[position[0] + direction[0]][position[1] + direction[1]] = '.';

    return true;
};

for (let move of moves) {
    const nextPosition = [
        currentPosition[0] + move[0],
        currentPosition[1] + move[1],
    ];

    if (map[nextPosition[0]][nextPosition[1]] === '#') {
        continue;
    }

    if (map[nextPosition[0]][nextPosition[1]] === 'O'
        && !moveBoxes(currentPosition, move)
    ) {
        continue;
    };

    currentPosition = nextPosition;
}

let result = 0;

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 'O') {
            result += (100 * i) + j;
        }
    }
}

console.log(result);
