const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./11-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const blink = (stone) => {
    if (stone === 0) {
        return [ 1 ];
    }

    const stoneString = `${stone}`;

    if (stoneString.length % 2 === 0) {
        const middle = stoneString.length / 2;
        return [+stoneString.slice(0, middle), +stoneString.slice(middle)];
    }

    return [ stone * 2024 ];
}

let result = input.split(' ').map(cell => +cell);

for (let i = 0; i < 25; i++) {
    result = result.map(blink).flat();
}

console.log(result.length);