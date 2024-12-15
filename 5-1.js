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
    for (let i = 1; i < order.length; i++) {
        for (let j = 0; j < i; j++) {
            if (rulesMap.get(order[i])?.includes(order[j])) {
                return;
            }
        }
    }

    const middleIndex = ~~(order.length / 2);
    result += order[middleIndex];
});

console.log(result);