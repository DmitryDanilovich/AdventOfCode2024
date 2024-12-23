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

const cache = new Map();

const checkIsPossible = (design) => {
    if (design.length === 0) {
        return 1;
    }

    let options = 0

    for (let towel of towels) {
        if (design.slice(0, towel.length) === towel){
            if (cache.has(design.slice(towel.length))) {
                options += cache.get(design.slice(towel.length));
            }
            else {
                const newOptions = checkIsPossible(design.slice(towel.length));
                cache.set(design.slice(towel.length), newOptions);
                options += newOptions;
            }
        }
    }

    return options;
};

const result = designs
    .map(checkIsPossible)
    .reduce((acc, val) => acc + val, 0);

console.log(result);
