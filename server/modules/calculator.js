function calculate(num1, num2, operator) {

    switch (operator) {
        case '+':
            return Number(num1) + Number(num2);
            break;
        case '-':
            return Number(num1) - Number(num2);
            break;
        case '×':
            return Number(num1) * Number(num2);
            break;
        case '÷':
            return Number(num1) / Number(num2);
            break;
    }
}

module.exports = calculate