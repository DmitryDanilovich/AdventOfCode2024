const fs = require('node:fs');

let rulesInput;
let ordersInput;

try {
    rulesInput = fs.readFileSync('./5-rules.txt', 'utf8');
    ordersInput = fs.readFileSync('./5-orders.txt', 'utf8');
} catch (err) {
    console.error(err);
}

const rulesMap = new Map();

rulesInput
    .split('\n')
    .map(rule => {
        const [lower, upper] = rule.split('|').map(x => +x);
        rulesMap.get(lower) 
            ? rulesMap.get(lower).push(upper)
            : rulesMap.set(lower, [upper]);
        
    });

const orders = ordersInput
    .split('\n')
    .map(order => order.split(',').map(x => +x));


let result = 0;

orders.forEach(order => {
    const orderCopy = [...order];

    let isReordered = false;

    for (let i = 1; i < orderCopy.length; i++) {
        for (let j = 0; j < i; j++) {
            if (rulesMap.get(orderCopy[i])?.includes(orderCopy[j])) {
                isReordered = true;
                const [itemToMove] = orderCopy.splice(i, 1);
                orderCopy.splice(j, 0, itemToMove);
            }
        }
    }

    if (!isReordered) {
        return;
    }

    const middleIndex = ~~(orderCopy.length / 2);
    result += orderCopy[middleIndex];
});

console.log(result);