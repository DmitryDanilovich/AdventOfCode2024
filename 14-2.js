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

const updateRobot = (i) => {
    const robot = robots[i];

    const finalPositionX = (robot.p[0] + robot.v[0]) % width;
    const finalPositionY = (robot.p[1] + robot.v[1]) % length;

    robots[i].p = [
        finalPositionX >= 0 ? finalPositionX : width + finalPositionX,
        finalPositionY >= 0 ? finalPositionY : length + finalPositionY,
    ];
};

const checkChristmasTree = () => {
    for (let robot of robots) {
        const downPart = [robot.p[0] + 1, robot.p[1]];
        const secondDownPart = [robot.p[0] + 2, robot.p[1]];
        const thirdDownPart = [robot.p[0] + 3, robot.p[1]];

        const upperPart = [robot.p[0] + 1, robot.p[1] - 1];
        const secondUpperPart = [robot.p[0] + 2, robot.p[1] - 2];
        const thirdUpperPart = [robot.p[0] + 3, robot.p[1] - 3];

        const looksLikeAThree = [
            downPart,
            secondDownPart,
            thirdDownPart,
            upperPart,
            secondUpperPart,
            thirdUpperPart].reduce((acc, part) => {
            return acc && robots.some(r => (r.p[0] === part[0]) && (r.p[1] === part[1]));
        }, true);

        if (looksLikeAThree) {
            return true;
        }
    }

    return false;
};

const tick = () => {
    for (let i = 0; i < robots.length; i++) {
        updateRobot(i);
    }
};

const renderChristmasTree = () => {
    const map = Array.from({ length }, () => Array.from({ length: width }, () => '.'));

    for (let robot of robots) {
        map[robot.p[1]][robot.p[0]] = '#';
    }

    fs.writeFileSync('./14-output.txt', map.map(row => row.join('')).join('\n'));
};

const findChristmasTree = () => {
    let time = 0;

    while (true) {
        tick();
        time++;

        if (checkChristmasTree()) {
            return time;
        }
    }
};

const result = findChristmasTree();

console.log(result);
console.log(renderChristmasTree());
