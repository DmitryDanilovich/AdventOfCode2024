const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./13-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const machines = input.split('\n\n')
    .map(description => {
        const lines = description.split('\n');
        const A = {
            x: +lines[0].matchAll(/X\+([0-9]+)/g).next().value[1],
            y: +lines[0].matchAll(/Y\+([0-9]+)/g).next().value[1],
        };

        const B = {
            x: +lines[1].matchAll(/X\+([0-9]+)/g).next().value[1],
            y: +lines[1].matchAll(/Y\+([0-9]+)/g).next().value[1],
        };

        const prize = {
            x: +lines[2].matchAll(/X\=([0-9]+)/g).next().value[1],
            y: +lines[2].matchAll(/Y\=([0-9]+)/g).next().value[1],
        }

        return {
            A,
            B,
            prize,
        };
    });

const pressLimit = 100;

let result = 0;

const findCheapestPath = (machine) => {
    const maxXCountA = Math.floor(machine.prize.x / machine.A.x);
    const maxXCountALimited = Math.min(maxXCountA, pressLimit);

    const possibleSolutions = [];

    for (let i = 0; i <= maxXCountALimited; i++) {
        const maxXDistanceA = i * machine.A.x;
        const restXDistanceB = machine.prize.x - maxXDistanceA;

        if ( restXDistanceB % machine.B.x !== 0) {
            continue;
        }

        const n = i;
        const m = restXDistanceB / machine.B.x;

        if (m > pressLimit) {
            continue;
        }

        const doesMatchY = (machine.A.y * n) + (machine.B.y * m) === machine.prize.y;

        if (doesMatchY) {
            possibleSolutions.push([i, restXDistanceB / machine.B.x]);
        }
    }

    return possibleSolutions
        .map(([a, b]) => (3 * a) + b)
        .sort()
        .reverse()[0] ?? 0;
};

for (let machine of machines) {
    result += findCheapestPath(machine);
};

console.log(result);