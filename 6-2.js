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

labMap[currentRow][currentColumn] = '.';

let currentDirection = [-1, 0];

let obstaclesCount = 0;

const checkLoop = () => {
    const obstacleRow = currentRow + currentDirection[0];
    const obstacleColumn = currentColumn + currentDirection[1];

    let loopDirection = [currentDirection[1], -currentDirection[0]]

    let loopRow = currentRow;
    let loopColumn = currentColumn;

    const turnCell = labMap[loopRow + loopDirection[0]][loopColumn + loopDirection[1]];

    if (turnCell.directions
        ?.some(x => x[0] === loopDirection[0] && x[1] === loopDirection[1])) {
        return true;
    }

    const visitedCells = [];

    while (true) {
        if (visitedCells.some(x => x.row === loopRow 
            && x.column === loopColumn 
            && x.direction[0] === loopDirection[0] 
            && x.direction[1] === loopDirection[1])) {
                return true;
        }

        visitedCells.push({
            row: loopRow,
            column: loopColumn,
            direction: loopDirection
        });

        const nextRow = loopRow + loopDirection[0];
        const nextColumn = loopColumn + loopDirection[1];
    
        if (nextRow < 0
            || nextRow >= labMap.length
            || nextColumn < 0 
            || nextColumn >= labMap[nextRow].length) {
            return false;
        }

        if (labMap[nextRow][nextColumn] === '#'
            || (nextRow == obstacleRow && nextColumn == obstacleColumn)) {
            const turnDirection = [loopDirection[1], -loopDirection[0]]
            loopDirection = turnDirection;
            continue;
        }
        
        loopRow = loopRow + loopDirection[0];
        loopColumn = loopColumn + loopDirection[1];
    }
}

while (true) {
    if (labMap[currentRow][currentColumn] === '.') {
        labMap[currentRow][currentColumn] = {
            directions: [],
        };
    }

    if (!labMap[currentRow][currentColumn].directions
        .some(x => x[0] === currentDirection[0] && x[1] === currentDirection[1])) {
        labMap[currentRow][currentColumn].directions.push(currentDirection);
    }

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
        continue;
    }

    if (labMap[nextRow][nextColumn] === '.' && checkLoop()) {
        obstaclesCount++;
    }

    currentRow = nextRow;
    currentColumn = nextColumn;
}

console.log(obstaclesCount);
