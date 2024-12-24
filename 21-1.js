const fs = require('node:fs');
const { get } = require('node:http');

let input;

try {
    input = fs.readFileSync('./21-test-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const codes = input
    .split('\n')
    .map(x => x.split(''));

const numericKeypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', 'A'],
];

const numericKeypadMap = {
    '7': [0, 0],
    '8': [0, 1],
    '9': [0, 2],
    '4': [1, 0],
    '5': [1, 1],
    '6': [1, 2],
    '1': [2, 0],
    '2': [2, 1],
    '3': [2, 2],
    'X': [3, 0],
    '0': [3, 1],
    'A': [3, 2],
};

const directionalKeypad = [
    [null, '^', 'A'],
    ['<', 'v', '>'],
];

const directionalKeypadMap = {
    'X': [0, 0],
    '^': [0, 1],
    'A': [0, 2],
    '<': [1, 0],
    'v': [1, 1],
    '>': [1, 2],
};

const getNewOperator = (isNumeric, operator) => {
    return {
        position: isNumeric ? [3, 2] : [0, 2],
        keypadMap: isNumeric ? numericKeypadMap : directionalKeypadMap,
    };
};

const robot1 = getNewOperator(true);
const robot2 = getNewOperator(false);
const manual = getNewOperator(false);

const pipeline = [robot1, robot2, manual];

const sequences = [];

const symbolToSequence = (handler, symbol, nextHandler) => {
    const symbolPosition = handler.keypadMap[symbol];
    // console.log(symbolPosition);
    // console.log(symbol);
    const distance = [
        symbolPosition[0] - handler.position[0],
        symbolPosition[1] - handler.position[1]
    ];

    handler.position = symbolPosition;

    const horisontalMoves = new Array(Math.abs(distance[1]))
            .fill(distance[1] > 0 ? '>' : '<');

    const verticalMoves = new Array(Math.abs(distance[0]))
            .fill(distance[0] > 0 ? 'v' : '^');

    const emptySymbolPosition = handler.keypadMap['X'];

    if (emptySymbolPosition[0] === symbolPosition[0]
        && emptySymbolPosition[1] === symbolPosition[1]
    ) {
        return [...verticalMoves, ...horisontalMoves, 'A'];
    }

    if (emptySymbolPosition[1] === symbolPosition[1]
        && emptySymbolPosition[0] === symbolPosition[0]) {
        return [...horisontalMoves, ...verticalMoves, 'A'];
    }

    const nextHandlerPosition = nextHandler?.position;

    if (nextHandlerPosition) {
        const horisontalSymbol = distance[1] > 0 ? '>' : '<';
        const verticalSymbol = distance[0] > 0 ? 'v' : '^';

        const horisontalSymbolPosition = nextHandler.keypadMap[horisontalSymbol];
        const verticalSymbolPosition = nextHandler.keypadMap[verticalSymbol];

        const distanceToHorisontal = [
            horisontalSymbolPosition[0] - nextHandlerPosition[0],
            horisontalSymbol[1] - nextHandlerPosition[1]
        ];

        const absoluteHorisontalDistance = Math.abs(distanceToHorisontal[0]) + Math.abs(distanceToHorisontal[1]);

        const distanceToVertical = [
            verticalSymbolPosition[0] - nextHandlerPosition[0],
            verticalSymbolPosition[1] - nextHandlerPosition[1]
        ];

        const absoluteVerticalDistance = Math.abs(distanceToVertical[0]) + Math.abs(distanceToVertical[1]);

        if (absoluteHorisontalDistance < absoluteVerticalDistance) {
            return [...horisontalMoves, ...verticalMoves, 'A'];
        }

        return [...verticalMoves, ...horisontalMoves, 'A'];
    }

    return [...verticalMoves, ...horisontalMoves, 'A'];
}

for (let code of codes) {
    const sequence = [];
    for (let char of code) {
        let currentSequence = [char]
        for (let r = 0; r < pipeline.length; r++) {
            const robot = pipeline[r];
            const nextRobot = pipeline[r + 1];
            const nextSequence = [];
            for (let symbol of currentSequence) {
                nextSequence.push(...symbolToSequence(robot, symbol, nextRobot));
            }
            currentSequence = nextSequence;
        }
        sequence.push(...currentSequence);
    }
    sequences.push({code, sequence});
}

console.log(sequences.map(x => x.sequence.join('')).join('\n'));

const result = sequences.reduce((acc, val) => {
    const number = +(val.code.splice(0, 3).join(''));
    const sequenceLength = val.sequence.length;

    return acc + (number * sequenceLength);
}, 0);

console.log(result);