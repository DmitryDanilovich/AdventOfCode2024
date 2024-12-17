const fs = require('node:fs');
const { default: test } = require('node:test');

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

const preCalculated = new Map();

const inputData = input.split(' ').map(cell => +cell);

const iterationsNumber = 75;

const getLengthAfterBlinks = (stones, blinksCount = 0) => {    
    let length = 0;

    const blinksLeft = iterationsNumber - blinksCount;

    if (blinksLeft === 0) {
        return stones.length;
    }

    for (let stone of stones) {
        if (preCalculated.has(`${stone}x${blinksLeft}`)) {
            length += preCalculated.get(`${stone}x${blinksLeft}`);
            continue;
        }
        
        const newStones = blink(stone);
        const newStoneLength = getLengthAfterBlinks(newStones, blinksCount + 1);
        preCalculated.set(`${stone}x${blinksLeft}`, newStoneLength);
        length += newStoneLength;
    }

    return length;
}

console.log(getLengthAfterBlinks(inputData));
