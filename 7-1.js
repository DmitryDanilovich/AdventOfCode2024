const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./7-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const equations = input
    .split('\n')
    .map(equationString => {
        const [resultString, valuesString] = equationString.split(': ');
        const values = valuesString.split(' ').map(value => +value);

        return {
            result: +resultString,
            values,
        };
    });

const isSolvable = (equation) => {

    if (equation.values.length === 1) {
        return equation.result === equation.values[0];
    }

    const multipliedEquation = {
        result: equation.result,
        values: [equation.values[0] * equation.values[1], ...equation.values.slice(2)],
    };

    const addedEquation = {
        result: equation.result,
        values: [equation.values[0] + equation.values[1], ...equation.values.slice(2)],
    };

    return isSolvable(multipliedEquation) || isSolvable(addedEquation);
};

const result = equations
    .reduce((acc, eq) => {
        if (isSolvable(eq)) {
            acc += eq.result;
        }

        return acc;
    }, 0);

console.log(result);
