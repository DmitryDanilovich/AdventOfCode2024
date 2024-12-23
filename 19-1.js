const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./19-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const [ towelsString, designStrings ] = input.split('\n\n');

const towels = towelsString.split(', ');
const designs = designStrings.split('\n');

const checkIsPossible = (design) => {
    if (design.length === 0) {
        return true;
    }

    for (let towel of towels) {
        if ((design.slice(0, towel.length) === towel)
            && checkIsPossible(design.slice(towel.length))) {
            return true;
        }
    }

    return false;
};

const result = designs
    .filter(checkIsPossible)
    .length;

console.log(result);
