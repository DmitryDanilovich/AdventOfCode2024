const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./17-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const [ regAString, regBString, regCString, _, programString ] = input.split('\n');

const program = programString.match(/[0-9,]+/g)[0]
    .split(',')
    .map(x => +x);

const runProgram = (initialA) => {
    let A = initialA;
    let B = 0n;
    let C = 0n;
    
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
        const denominator = 2n ** BigInt(comboOperand);
        return ~~(A / BigInt(denominator));
    }
    
    const instructions = {
        0: (operand) => {
            A = xdv(operand);
        },
        1: (operand) => {
            const result = B ^ BigInt(operand);
            B = result;
        },
        2: (operand) => {
            const comboOperand = comboOperands[operand]();
            const result = BigInt(comboOperand) % 8n;
            B = result;
        },
        3: (operand) => {
            if (A === 0n) {
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
            const result = comboOperand % 8n;
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

    return output;
}


//0     2,4  B = A % 8       
//2     1,1  B = B xor 1     
//4     7,5  C = (A/2^B)     
//6     1,5  B = B xor 5     
//8     4,0  B = B xor C     
//10    0,3  A = (A/8)       
//12    5,5  push B % 8      
//14    3,0  jump 0          if A !== 0

const findA = () => {
    let A = 0n;
    for (let i = program.length - 1; i >= 0; i--) {
        const expectedValue = program[i];

        let nextA = A * 8n;

        while (true) {
            const output = runProgram(nextA);

            const doMatch = output.reduce(
                (acc, val, index) => acc && (val == BigInt(program[index + i])),
                true
            );

            if (doMatch) {
                A = nextA;
                break;
            }

            nextA++;
        }
    }

    return A;
};

console.log(findA());
