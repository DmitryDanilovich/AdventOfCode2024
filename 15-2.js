const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./15-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const [ mapString, movesString ] = input.split('\n\n');

const mapWideningRules = {
    'O': ['[', ']'],
    '.': ['.', '.'],
    '#': ['#', '#'],
    '@': ['@', '.'],
};

const map = mapString
    .split('\n')
    .map(row => row
        .split('')
        .reduce((acc, cell) => {
            const replacement = mapWideningRules[cell];
            acc.push(...replacement);

            return acc;
        }, []));

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

const getBoxPosition = (position, direction) => {
    if (map[position[0] + direction[0]][position[1] + direction[1]] === '[') {
        return [
            [position[0] + direction[0], position[1] + direction[1]],
            [position[0] + direction[0], position[1] + direction[1] + 1],
        ];
    } else {
        return [
            [position[0] + direction[0], position[1] + direction[1] - 1],
            [position[0] + direction[0], position[1] + direction[1]],
        ];
    }
};

const checkMoveVertical = (position, direction, acc) => {
    const boxPosition = getBoxPosition(position, direction);

    acc.push(boxPosition);

    const nextBoxPositionLeft = [
        boxPosition[0][0] + direction[0],
        boxPosition[0][1] + direction[1],
    ];

    const nextBoxPositionRight = [
        boxPosition[1][0] + direction[0],
        boxPosition[1][1] + direction[1],
    ];

    const nextLeft = map[nextBoxPositionLeft[0]][nextBoxPositionLeft[1]];
    const nextRight = map[nextBoxPositionRight[0]][nextBoxPositionRight[1]];

    if ((nextLeft === '#') || (nextRight === '#')) {
        return false;
    }

    if (nextLeft === '[' && nextRight === ']'
        && !checkMoveVertical(boxPosition[0], direction, acc)
    ) {
        return false;
    }

    if (nextLeft === ']'
        && !checkMoveVertical(boxPosition[0], direction, acc)
    ) {
        return false;
    }

    if (nextRight === '['
        && !checkMoveVertical(boxPosition[1], direction, acc)
    ) {
        return false;
    }

    return true;
};

const moveVertical = (position, direction) => {
    const acc = [];

    if (!checkMoveVertical(position, direction, acc)) {
        return false;
    }

    for (let boxPosition of acc.sort((a, b) => (a[0][0] - b[0][0]) * -direction[0]) ) {
        map[boxPosition[0][0] + direction[0]][boxPosition[0][1] + direction[1]] = '[';
        map[boxPosition[1][0] + direction[0]][boxPosition[1][1] + direction[1]] = ']';
        map[boxPosition[0][0]][boxPosition[0][1]] = '.';
        map[boxPosition[1][0]][boxPosition[1][1]] = '.';
    }

    return true;
};

const moveHorizontal = (position, direction) => {
    let lastBoxInRowPosition = [
        position[0] + direction[0],
        position[1] + direction[1],
    ];

    const sideSymbol = map[lastBoxInRowPosition[0]][lastBoxInRowPosition[1]];

    while (map[lastBoxInRowPosition[0] + (direction[0] * 2)][lastBoxInRowPosition[1] + (direction[1] * 2)] === sideSymbol) {
        lastBoxInRowPosition = [
            lastBoxInRowPosition[0] + (direction[0] * 2),
            lastBoxInRowPosition[1] + (direction[1] * 2),
        ];
    }

    const nextAfterLastBoxInRowPosition = [
        lastBoxInRowPosition[0] + (direction[0] * 2),
        lastBoxInRowPosition[1] + (direction[1] * 2),
    ];

    if (map[nextAfterLastBoxInRowPosition[0]][nextAfterLastBoxInRowPosition[1]] === '#'){
        return false;
    }

    let newPosition = nextAfterLastBoxInRowPosition;

    while ((newPosition[0] !== position[0])
        || (newPosition[1] !== position[1])) {
            const newPositionI = newPosition[0] - direction[0];
            const newPositionJ = newPosition[1] - direction[1];

            map[newPosition[0]][newPosition[1]] = map[newPositionI][newPositionJ];

            newPosition = [
                newPositionI,
                newPositionJ,
            ];
    }

    return true;
};

const moveBox = (position, direction) => {
    const isVertical = !!direction[0];

    if (isVertical) {
        return moveVertical(position, direction);
    }

    return moveHorizontal(position, direction);
};

for (let move of moves) {
    const nextPosition = [
        currentPosition[0] + move[0],
        currentPosition[1] + move[1],
    ];

    if (map[nextPosition[0]][nextPosition[1]] === '#') {
        continue;
    }

    const isBox = ((map[nextPosition[0]][nextPosition[1]] === '[')
        || (map[nextPosition[0]][nextPosition[1]] === ']'));

    if (isBox && !moveBox(currentPosition, move)
    ) {
        continue;
    };
    
    currentPosition = nextPosition;
}

let result = 0;

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '[') {
            result += (100 * i) + j;
        }
    }
}

console.log(result);
