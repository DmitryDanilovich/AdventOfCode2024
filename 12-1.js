const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./12-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const fenceMap = input.split('\n')
    .map(row => row.split('').map(letter => ({ letter, visited: false })));

const findRegion = (i, j, initialDirection = [0, 1]) => {
    let perimeter = 0;
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
            perimeter++;
            continue;
        }

        if (nextCell.visited && nextCell.letter === letter) {
            continue;
        }

        const { perimeter: nextPerimeter, area: nextArea } = findRegion(
            nextI,
            nextJ,
            currentDirection,
        );

        perimeter += nextPerimeter;
        area += nextArea;
    }

    return {perimeter, area};
};

let result = 0;

const addRegion = (i, j) => {
    const { perimeter, area } = findRegion(i, j);
    result += area * perimeter;
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