const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./16-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const map = input
    .split('\n')
    .map(row => row.split('').map(x => {
        if (x === '.') {
            return {
                type: '.',
                visited: false,
            };
        }

        if (x === '#') {
            return {
                type: '#',
            };
        }

        return x;
    }));


let currentPosition;
let endPosition;

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 'S') {
            currentPosition = [ i, j ];
        }

        if (map[i][j] === 'E') {
            endPosition = [ i, j ];
        }

        if (currentPosition && endPosition) {
            break;
        }
    }
}

map[currentPosition[0]][currentPosition[1]] = { type: '.', visited: true, visitScore: 0 };
map[endPosition[0]][endPosition[1]] = { type: '.', isEnd: true };


const move = (position, direction = [0, 1], currentScore = 0) => {
    const results = [];

    const sameDirectionContext = {
        direction: [...direction],
        addedScore: 1,
    };

    const leftDirectionContext = {
        direction: [-direction[1], direction[0]],
        addedScore: 1001,
    };

    const rightDirectionContext = {
        direction: [direction[1], -direction[0]],
        addedScore: 1001,
    };

    const contexts = [
        sameDirectionContext,
        leftDirectionContext,
        rightDirectionContext
    ];

    for (let context of contexts) {
        const nextPosition = [position[0] + context.direction[0], position[1] + context.direction[1]];
        const nextCell = map[nextPosition[0]]?.[nextPosition[1]];

        const nextScore = currentScore + context.addedScore;

        const turnFee = context.addedScore === 1 ? 1000 : 0;

        if (!nextCell
            || nextCell.type === '#'
            || (nextCell.visited && (nextCell.visitScore < (nextScore - turnFee)))) {
            continue;
        }

        nextCell.visited = true;
        if (nextCell.visitScore > nextScore || !nextCell.visitScore) {
            nextCell.visitScore = nextScore;
        }

        if (nextCell.isEnd) {
            return [{nextCell, score: nextScore}];
        }

        if (nextCell.type === '.') {
            const scores = move(nextPosition, context.direction, nextScore);
            if (!scores.length) {
                continue;
            }
            results.push(...scores, {nextCell, score: scores[0].score});
        }
    }

    return results.reduce((acc, x) => {
        const resultFirst = acc[0];

        if (!resultFirst || x.score < resultFirst.score) {
            return [x];
        }

        if (x.score === resultFirst.score) {
            acc.push(x);
        }

        return acc;
    }, []);
};

const results = move(currentPosition);

const resultsUnique = results.reduce((acc, x) => {
    if (!acc.some(y => y.nextCell === x.nextCell)) {
        acc.push(x);
    }

    return acc;
}, []);


console.log(resultsUnique.length + 1);
