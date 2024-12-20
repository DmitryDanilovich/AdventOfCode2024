const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./17-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const [ regAString, regBString, regCString, _, programString ] = input.split('\n');

let A = +(regAString.match(/[0-9]+/g)[0]);
let B = +(regBString.match(/[0-9]+/g)[0]);
let C = +(regCString.match(/[0-9]+/g)[0]);

const program = programString.match(/[0-9,]+/g)[0]
    .split(',')
    .map(x => +x);

const comboOperands = {
    0: () => 0,
    1: () => 1,
    2: () => 2,
    3: () => 3,
    4: () => A,
    5: () => B,
    6: () => C,
    7: () => { throw new Error('Invalid operand') },
};

let pointer = 0;
const output = [];

const xdv = (operand) => {
    const comboOperand = comboOperands[operand]();
    return Math.floor(A / Math.pow(2, comboOperand));
}

const instructions = {
    0: (operand) => {
        A = xdv(operand);
    },
    1: (operand) => {
        const result = B ^ operand;
        B = result;
    },
    2: (operand) => {
        const comboOperand = comboOperands[operand]();
        const result = comboOperand % 8;
        B = result;
    },
    3: (operand) => {
        if (A === 0) {
            return false;
        }

        pointer = operand;
        return true;
    },
    4: (operand) => {
        const result = B ^ C;
        B = result;
    },
    5: (operand) => {
        const comboOperand = comboOperands[operand]();
        const result = comboOperand % 8;
        output.push(result);
    },
    6: (operand) => {
        B = xdv(operand);
    },
    7: (operand) => {
        C = xdv(operand);
    },
};

while (pointer < program.length) {
    const instructionCode = program[pointer];
    const operand = program[pointer + 1];

    const isJump = instructions[instructionCode](operand);

    if (!isJump) {
        pointer += 2;
    }
};

console.log(output.join(','));