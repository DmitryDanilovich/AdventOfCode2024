const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./6-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const labMap = input.split('\n').map(row => row.split(''));

let currentRow = labMap.findIndex(row => row.includes('^'));
let currentColumn = labMap[currentRow].indexOf('^');

let currentDirection = [-1, 0];

let visitedPositions = 0;

while (true) {
    if (labMap[currentRow][currentColumn] !== 'X') {
        visitedPositions++;
    }
    
    labMap[currentRow][currentColumn] = 'X';

    const nextRow = currentRow + currentDirection[0];
    const nextColumn = currentColumn + currentDirection[1];

    if (nextRow < 0
        || nextRow >= labMap.length
        || nextColumn < 0 
        || nextColumn >= labMap[nextRow].length) {
            break;
    }

    if (labMap[nextRow][nextColumn] === '#') {
        currentDirection = [currentDirection[1], -currentDirection[0]];
    }

    currentRow = currentRow + currentDirection[0];
    currentColumn = currentColumn + currentDirection[1];
}

console.log(visitedPositions);