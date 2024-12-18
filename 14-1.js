const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./14-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const robots = input.split('\n')
    .map(description => {
        const positionMatch = description.matchAll(/p\=([0-9]+),([0-9]+)/g).next().value;
        const velocityMatch = description.matchAll(/v\=(-?[0-9]+),(-?[0-9]+)/g).next().value;


        return {
            p: [+positionMatch[1], +positionMatch[2]],
            v: [+velocityMatch[1], +velocityMatch[2]],
        };
    });

const width = 101;
const length = 103;

const time = 100;

const quadrants = [
    0, 0,
    0, 0,
];

for (let robot of robots) {
    const finalPositionX = (robot.p[0] + (robot.v[0] * time)) % width;
    const finalPositionY = (robot.p[1] + (robot.v[1] * time)) % length;

    const finalPosition = [
        finalPositionX >= 0 ? finalPositionX : width + finalPositionX,
        finalPositionY >= 0 ? finalPositionY : length + finalPositionY,
    ]

    if (finalPosition[0] < (width - 1) / 2) {
        if (finalPosition[1] < (length - 1) / 2) {
            quadrants[0]++;
        }

        if (finalPosition[1] > (length - 1) / 2) {
            quadrants[1]++;
        }
    } 
    
    if (finalPosition[0] > (width - 1) / 2) {
        if (finalPosition[1] < (length -1) / 2) {
            quadrants[2]++;
        } 
        if (finalPosition[1] > (length - 1) / 2) {
            quadrants[3]++;
        }
    }
}


const result = quadrants.reduce((acc, value) => {
    return acc * value;
}, 1);

console.log(result);