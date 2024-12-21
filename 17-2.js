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
        // if ((registers.A !== undefined) && (registers.A !== value)) {
        //     return false;
        // }

        registers.A = value;
        return true;
    },
    5: (value, registers) => {
        // if ((registers.B !== undefined) && (registers.B !== value)) {
        //     return false;
        // }

        registers.B = value;
        return true;
    },
    6: (value, registers) => {
        // if ((registers.C !== undefined) && (registers.C !== value)) {
        //     return false;
        // }

        registers.C = value;
        return true;
    },
    7: () => { throw new Error('Invalid operand') },
};

const updateResult = (result, handler) => {
    const newResult = {
        registers: {
            A: result.registers.A,
            B: result.registers.B,
            C: result.registers.C,
        },
        resultPointer: result.resultPointer,
    };

    const success = handler(newResult);

    if (!success) {
        return null;
    };

    return newResult;
};

const xdvInverse = function*(operand, expectedResult, expectedValue){
    if (expectedValue === undefined) {
        return expectedResult;
    };

    // the combo operand never actually take the value from a register,
    // so this case is ignored for now
    const multiplier = Math.pow(2, operand);

    for (let i = 0; i < multiplier; i++) {
        const prevA = (expectedValue * multiplier) + i;
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
}

const reverseInstructions = {
    0: function*(operand, expectedResult){
        yield* xdvInverse(operand, expectedResult, expectedResult.registers.A);
    },
    1: function*(operand, expectedResult){
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
    },
    2: function*(operand, expectedResult){
        let prevB = expectedResult.registers.B; //just hope it exists
        const handler = comboOperandsHandlers[operand];

        while (true) {
            const updateOperand = (result) => handler(prevB, result.registers);
            const result = updateResult(expectedResult, updateOperand);

            if (result) {
                yield result;
            };

            prevB += 8;
            console.log(prevB);
        }
    },
    3: function*(operand, expectedResult){
        // it is always a single loop
        if (expectedResult.resultPointer === program.length - 1) {
            yield updateResult(expectedResult, (result) => {
                result.registers.A = 0;
                return true;
            });
        };

        if (expectedResult.registers.A === 0) {
            return null;
        }

        // would be right to check that A is not 0 in this case
        // but let's ignore it for now 
        yield expectedResult;
        return null;
    },
    4: function*(operand, expectedResult){
        if ((expectedResult.registers.C !== undefined)
            && (expectedResult.registers.B !== undefined)) {
            return updateResult(expectedResult, (result) => {
                result.registers.B = result.registers.B ^ result.registers.C;
                return true;
            });
        };

        if (expectedResult.registers.C !== undefined) {
            return expectedResult;
        };

        if (expectedResult.registers.B !== undefined) {
            let i = 0;

            while (true) {
                yield updateResult(expectedResult, (result) => {
                    result.registers.B = result.registers.B ^ i;
                    result.registers.C = i;
                    return true;
                });

                i++;
            }
        };

        // case where there are no expectations for both B and C registers is ignored
        // let's hope it never happens
        return null;
    },
    5: function*(operand, expectedResult){
        let prevValue = program[expectedResult.resultPointer];
        const handler = comboOperandsHandlers[operand]; 

        while (true) {
            yield updateResult(expectedResult, (result) => {
                const success = handler(program[result.resultPointer], result.registers);

                if (success) {
                    result.resultPointer--;
                }

                return success;
            });

            prevValue += 8;
        }
    },
    6: function*(operand, expectedResult){
        yield* xdvInverse(operand, expectedResult, expectedResult.registers.B);
    },
    7: function*(operand, expectedResult){
        yield* xdvInverse(operand, expectedResult, expectedResult.registers.C);
    },
};

let initialPointer = program.length - 2;

const initialExpectedResult = {
    registers: {
        A: undefined,
        B: undefined,
        C: undefined,
    },
    resultPointer: program.length - 1,
};

const findExpectedResult = (
    pointer = initialPointer,
    expectedResult = initialExpectedResult,
) => {
    console.log(pointer, expectedResult);

    if (pointer < 0) {
        if (expectedResult.resultPointer < 0) {
            return expectedResult;
        }

        if ( expectedResult.registers.A === 0 ) {
            return null;
        }

        // just a hack to go to jump as it is a known cycle
        pointer = initialPointer;
    }

    const instructionCode = program[pointer];
    const operand = program[pointer + 1];

    const instruction = reverseInstructions[instructionCode];
    const generator = instruction(operand, expectedResult);

    let startingResult;

    while (true) {
        const nextOperationResult = generator.next();

        if (nextOperationResult.done && !nextOperationResult.value) {
            return null;
        }

        startingResult = findExpectedResult(
            pointer - 2, 
            nextOperationResult.value
        );

        if (startingResult) {
            return startingResult;
        }
    };
}

// while (resultPointer >= 0) {
//     const instructionCode = program[pointer];
//     const operand = program[pointer + 1];

//     const instruction = reverseInstructions[instructionCode];
//     const generator = instruction(operand, expectedResult);

//     let nextResult;

//     do {
//         nextResult = generator.next();
        
//     } while (!nextResult.done);

//     if (!nextResult.value) {
//         break;
//     }

//     resultPointer = nextResult.value.resultPointer;

// };


const result = findExpectedResult();

console.log(result);

// 2,4  B = A % 8       
// 1,1  B = B xor 1     
// 7,5  C = (A/8)       
// 1,5  B = B xor 5     
// 4,0  B = B xor C     A % 8 xor 1 xor 5 xor (A/8) % 8 === <next element from tail>  
// 0,3  A = (A/8)       A / 8 === <0 for last element from tail and anything but 0 for the rest>
// 5,5  push B % 8      
// 3,0  jump 0          A === 0