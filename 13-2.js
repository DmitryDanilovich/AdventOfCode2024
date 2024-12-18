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
            x: +lines[2].matchAll(/X\=([0-9]+)/g).next().value[1] + 10000000000000,
            y: +lines[2].matchAll(/Y\=([0-9]+)/g).next().value[1] + 10000000000000,
        }

        return {
            A,
            B,
            prize,
        };
    });

let result = 0;

const findCheapestPath = (machine) => {
    const determinant = (machine.A.x * machine.B.y) - (machine.B.x * machine.A.y);

    const inverseDeterminant = 1 / determinant;

    const inverseMatrix = [
        [machine.B.y * inverseDeterminant, -machine.B.x * inverseDeterminant],
        [-machine.A.y * inverseDeterminant, machine.A.x * inverseDeterminant],
    ];

    const answers = [
        inverseMatrix[0][0] * machine.prize.x + inverseMatrix[0][1] * machine.prize.y,
        inverseMatrix[1][0] * machine.prize.x + inverseMatrix[1][1] * machine.prize.y,
    ];

    const pressA = Math.round(answers[0] * 100) / 100;
    const pressB = Math.round(answers[1] * 100) / 100;

    if (pressA < 0 
        || pressB < 0 
        || pressA % 1 !== 0
        || pressB % 1 !== 0) {
        return 0;
    }

    return (3 * pressA) + pressB;
};

for (let machine of machines) {
    result += findCheapestPath(machine);
};

console.log(result);