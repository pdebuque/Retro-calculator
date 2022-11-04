// take an input of a single number. Output should be 9 digits long, including decimal
function truncate(number) {
    // turn it into an array of three elements: pre-decimal, decimal, and post-decimal
    const numArray = String(number).split('.');

    //if there is a decimal, truncate the decimals
    while (totalLength(numArray) > 9 && numArray[2]) {
        numArray[2].slice(0, numArray[2].length - 1);
    };

    // if there is only a decimal at the end, cut it off
    if (totalLength(numArray) > 9 && numArray[1]) {
        numArray[1] = '';
    };

    // if we're still above 9 characters, use exponents
    if (totalLength(numArray) > 9) {
        return sciNot(numArray[0]);
    }

    // if (numString.contains('.')) {
    //     while (numString.length>9 && numString.contains('.')){ // if there is still a decimal and 
    //         numString.slice(0,numString.length-1)
    //     }
    // }

    // if last digit is decimal, chop it off
    return numArray.join('');
}

//mini-function to detect the number of characters in  an entire array
function totalLength(array) {
    let sum = 0;
    for (let el of array) {
        sum += el.length;
    }
    return sum
}

// function to convert a string number into scientific notation
function sciNot(stringNum) {
    const length = stringNum.length;
    const sna = stringNum.split(''); // sna = string number array
    const newNumArr = [sna[0], '.', sna[1], sna[2], sna[3], ' ', 'e', stringNum.length - 1];
    return newNumArr.join('');
}

export default truncate