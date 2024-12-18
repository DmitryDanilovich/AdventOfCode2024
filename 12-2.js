const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./12-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const fenceMap = input.split('\n')
    .map(row => row.split('').map(letter => ({ letter, visited: false })));

const findCorners = (i, j, direction) => {
    const left = [ -direction[1], direction[0] ];
    const right = [ direction[1], -direction[0] ];
    const leftDiagonal = [ direction[0] + left[0], direction[1] + left[1] ];
    const rightDiagonal = [ direction[0] + right[0], direction[1] + right[1] ];

    const leftCell = fenceMap[i + left[0]]?.[j + left[1]];
    const rightCell = fenceMap[i + right[0]]?.[j + right[1]];
    const leftDiagonalCell = fenceMap[i + leftDiagonal[0]]?.[j + leftDiagonal[1]];
    const rightDiagonalCell = fenceMap[i + rightDiagonal[0]]?.[j + rightDiagonal[1]];

    const currentCell = fenceMap[i][j];

    const isLeftCorner = leftCell?.letter !== currentCell.letter;
    const isRightCorner = rightCell?.letter !== currentCell.letter;
    const isLeftDiagonalCorner = !isLeftCorner && (leftDiagonalCell?.letter === currentCell.letter);
    const isRightDiagonalCorner = !isRightCorner && (rightDiagonalCell?.letter === currentCell.letter);

    return (isLeftCorner ? 1 : 0) 
        + (isRightCorner ? 1 : 0)
        + (isLeftDiagonalCorner ? 1 : 0)
        + (isRightDiagonalCorner ? 1 : 0);
};

const findRegion = (i, j, initialDirection = [0, 1]) => {
    let corners = 0;
    let area = 1;

    const letter = fenceMap[i][j].letter;
    fenceMap[i][j].visited = true;

    let currentDirection = initialDirection;

    for (let d = 0; d < 4; d++) {
        currentDirection = [ -currentDirection[1], currentDirection[0] ];

        const nextI = i + currentDirection[0];
        const nextJ = j + currentDirection[1];

        const nextCell = fenceMap[nextI]?.[nextJ];

        if (!nextCell || nextCell.letter !== letter) {
            corners += findCorners(i, j, currentDirection);

            continue;
        }

        if (nextCell.visited && nextCell.letter === letter) {
            continue;
        }

        const { corners: nextCorners, area: nextArea } = findRegion(
            nextI,
            nextJ,
            currentDirection,
        );

        corners += nextCorners;
        area += nextArea;
    }

    return {corners, area};
};

let result = 0;

const addRegion = (i, j) => {
    const { corners, area } = findRegion(i, j);
    result += area * corners / 2;
};

for (let i = 0; i < fenceMap.length; i++) {
    for (let j = 0; j < fenceMap[i].length; j++) {
        if (fenceMap[i][j].visited) {
            continue;
        }

        addRegion(i, j);
    }
}

console.log(result);