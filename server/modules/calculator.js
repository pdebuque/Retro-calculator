function calculate(num1, num2, operator) {

    switch (operator) {
        case 'plus':
            return Number(num1) + Number(num2);
            break;
        case 'minus':
            return Number(num1) - Number(num2);
            break;
        case 'times':
            return Number(num1) * Number(num2);
            break;
        case 'divide':
            return Number(num1) / Number(num2);
            break;
    }
}

module.exports = calculate