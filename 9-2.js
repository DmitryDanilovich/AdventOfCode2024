const fs = require('node:fs');

let input;

try {
    input = fs.readFileSync('./9-input.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const dataArray = input.split('').map((value, index) => ({
    value: +value,
    initialIndex: index % 2 === 0 ? index / 2 : null,
}));

const memoryBlocks = [];

const endOfLineIndex = dataArray.length % 2
    ? dataArray.length - 1
    : dataArray.length - 2;

for (let i = endOfLineIndex; i >= 0; i -= 2) {
    const currentElement = dataArray[i];

    if (!currentElement.value) {
        continue;
    }

    for (let j = 1; j < i; j += 2) {
        const emptyPlace = dataArray[j].value;

        if (emptyPlace >= currentElement.value) {
            dataArray.splice(i, 1, 
                ...[
                    { value: 0, initialIndex: null },
                    { value: currentElement.value, initialIndex: null },
                    { value: 0, initialIndex: null }
                ]);

            dataArray.splice(j, 1, 
                ...[
                    { value: 0, initialIndex: null },
                    currentElement,
                    { value: emptyPlace - currentElement.value, initialIndex: null },
                ]);

            i += 2;
            break;
        }
    }
}

for (let i = 0; i < dataArray.length; i++) {
    let symbol;

    const length = dataArray[i].value;

    if (i % 2 === 0) {
        symbol = dataArray[i].initialIndex;
    } else {
        symbol = null;
    }

    memoryBlocks.push(...Array.from({ length: length }, () => symbol));
}

const result = memoryBlocks
    .reduce((acc, value, index) => {
        acc += value * index;
        return acc;
    }, 0);

console.log(result);