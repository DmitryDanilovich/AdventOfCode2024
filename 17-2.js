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

const comboOperandsHandlers = {
    0: (value) => 0 === value,
    1: (value) => 1 === value,
    2: (value) => 2 === value,
    3: (value) => 3 === value,
    4: (value, registers) => {
        registers.A = value;
        return true;
    },
    5: (value, registers) => {
        registers.B = value;
        return true;
    },
    6: (value, registers) => {
        registers.C = value;
        return true;
    },
    7: () => { throw new Error('Invalid operand') },
};

const updateCombinedRegister = (operand)

const updateResult = (result, handler) => {
    const newResult = {
        registers: {
            A: result.registers.A,
            B: result.registers.B,
            C: result.registers.C,
        },
        outputValue: result.outputValue,
        jump: result.jump,
    };

    const success = handler(newResult);

    if (!success) {
        return null;
    };

    return newResult;
};

const xdv = (operand) => {
    const comboOperand = comboOperands[operand]();
    return Math.floor(A / Math.pow(2, comboOperand));
}

const reverseInstructions = {
    0: (operand, expectedResult) => {
        return function*() {
            if (expectedResult.registers.A === undefined) {
                return expectedResult;
            };

            // the combo operand never actually take the value from a register,
            // so this case is ignored for now
            const multiplier = Math.pow(2, operand);

            for (let i = 0; i < multiplier; i++) {
                const prevA = (expectedResult.registers.A * multiplier) + i;
                const result = updateResult(expectedResult, (result) => {
                    result.registers.A = prevA;
                    return true;
                });

                if (!result) {
                    continue;
                }

                yield result;
            }

            return null;
        };
    },
    1: (operand, expectedResult) => {
        return function*() {
            if (expectedResult.registers.B === undefined) {
                return expectedResult;
            };

            const prevB = expectedResult.registers.B ^ operand;

            const result = updateResult(expectedResult, (result) => {
                result.registers.B = prevB;
                return true;
            });

            if (result) {
                yield result;
            }

            return null;
        };
    },
    2: (operand, expectedResult) => {
        return function*() {
            let prevB = expectedResult.registers.B;

            while (true) {
                const updateOperand = (result) => {
                    const handler = comboOperandsHandlers[operand];
                    return handler(prevB, result.registers);
                };

                const result = updateResult(expectedResult, updateOperand);

                if (result) {
                    yield result;
                };

                B += 8;
            }
        };
    },
    3: (operand, expectedResult) => { // to update
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

const doesRegistersMatch = (registers, expectedRegisters) => {
    return (expectedRegisters.A === undefined || registers.A === expectedRegisters.A)
        && (expectedRegisters.B === undefined || registers.B === expectedRegisters.B)
        && (expectedRegisters.C === undefined || registers.C === expectedRegisters.C);
};

const findRegisterValues = (
    pointer = program.length - 2,
    resultPointer = program.length - 1,
    expectedRegisters = {},
) => {
    const instructionCode = program[pointer];
    const operand = program[pointer + 1];

    const expectedResult = {
        registers: {
            A: expectedRegisters.A,
            B: expectedRegisters.B,
            C: expectedRegisters.C,
        },
        outputValue: program[resultPointer],
        isOutputLeft: pointer < 0 && resultPointer >= 0, 
    };

    const nextExpectedResult = reverseInstructions[instructionCode](operand, expectedResult);



    if (result.outputValue 
        && (result.outputValue === program[resultPointer])
        && doesRegistersMatch(registers, expectedRegisters)) {
            resultPointer -= 1;
            return registers;
    }

    if (pointer === 0 && resultPointer >= 0) {
        return;
    }

    findRegisterValues(pointer - 2, resultPointer, expectedRegisters);
};

// 2,4  B = A % 8       
// 1,1  B = B xor 1     
// 7,5  C = (A/8)       
// 1,5  B = B xor 5     
// 4,0  B = B xor C     A % 8 xor 1 xor 5 xor (A/8) % 8 === <next element from tail>  
// 0,3  A = (A/8)       A / 8 === <0 for last element from tail and anything but 0 for the rest>
// 5,5  push B % 8      
// 3,0  jump 0          A === 0