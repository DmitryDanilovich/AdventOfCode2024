const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./8-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const locationMap = input.split('\n').map(row => row.split(''));

const antennasPositions = new Map();

for (let i = 0; i < locationMap.length; i++) {
    for (let j = 0; j < locationMap[i].length; j++) {
        if (locationMap[i][j] == '.') {
            continue;
        }

        const existingPosition = antennasPositions.get(locationMap[i][j], [[i, j]]);

        if (existingPosition) {
            existingPosition.push([i, j]);

        } else {
            antennasPositions.set(locationMap[i][j], [[i, j]]);
        }
    }
}

const antinodeLocations = new Map();

const isInRange = (position) => position[0] >= 0
        && position[0] < locationMap.length
        && position[1] >= 0
        && position[1] < locationMap[position[0]].length;

antennasPositions.forEach((positions, antenna) => {
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const firstAntenna = positions[i];
            const secondAntenna = positions[j];

            const distance = [
                firstAntenna[0] - secondAntenna[0],
                firstAntenna[1] - secondAntenna[1]
            ];

            const firstAntinode = [
                firstAntenna[0] + distance[0],
                firstAntenna[1] + distance[1]
            ];

            const secondAntinode = [
                secondAntenna[0] - distance[0],
                secondAntenna[1] - distance[1]
            ];

            [firstAntinode, secondAntinode]
                .filter(isInRange)
                .forEach(antinode => {
                    antinodeLocations.set(JSON.stringify(antinode), antinode);
                });
        }
    }
});

console.log(antinodeLocations.size);