// const truncate = require('./truncate');

const state = {
    num1: '',
    num2: '',
    operator: '',
    operation: '',
    display: '',
    prevResult: '',
}

// const operators = ['/', '*', '+', '-', '×', '÷']

$(onReady);

function onReady() {
    console.log('jquery ready');
    $('.number').on('click', clickNumber);
    $('.operator').on('click', clickOperator);
    $('#equal').on('click', clickEqual);
    $('#clear').on('click', clear);
    $('#clear-history').on('click', clearHistory);
    $('#history').on('click', '.rerun-btn', rerunOperation)
}

// ------------------------------------------ CLIENT-SIDE CALC FUNCTIONALITY -------------------------------


// new click number handles both num1 and num2 saving
function clickNumber() {
    // handle for num1
    // console.log('---------- in clickNumber() ------------');
    // console.log('current state: ', state);
    if (!state.operator) {
        state.num1 += $(this).data().val;
        state.operation = state.num1;
        state.display = state.num1;
        renderDisplays();

    } else { // if there is already an operator, move to num2
        state.num2 += $(this).data().val;
        state.operation += state.num2;
        state.display = state.num2;
        renderDisplays();
    }
}

// clicking a number concatenates its data onto the input field, then renders the input
// function clickNumber2() {
//     // after operator entry, need to clear the inputField
//     if (operators.includes(calcState.inputField)) {// this is hacky. i'd like to find a different way
//         calcState.inputField = '';
//         renderInput()
//     }

//     if (calcState.inputField.length < 9) {
//         calcState.inputField += $(this).data().val;
//         console.log(calcState.inputField)
//         renderInput();
//     }
// }

// function renderInput() {
//     $('#number-field').empty();
//     $('#number-field').html(calcState.inputField);

//     $('#small-field').empty();
//     $('#small-field').html(`
//         ${calcState.num1} ${calcState.operator} ${calcState.num2}
//     `)
// }

function clickOperator() {

    // if this is the first operation, do the following. if it is not [aka num1, num2, and operator already exist], first set some 
    // console.log('in clickOperator()')
    // console.log('current state: ', state);
    if (!state.num2) {
        console.log('beginning first operation');
        console.log(state);
        console.log('data: ', $(this).data());
        const currentOpp = $(this).data().operator;
        state.operator = currentOpp;
        console.log(state.operator);
        state.operation += currentOpp;
        state.display = currentOpp;
        renderDisplays();
    } else {
        console.log('this is not the first operation');
        console.log('previous result: ', state.prevResult)
        const currentOpp = $(this).data().operator;
        state.num1 = state.prevResult;
        state.operator = currentOpp;
        state.num2 = '';
        state.operation = state.prevResult + currentOpp;
        console.log('current state: ', state);
        state.display = currentOpp;
        renderDisplays();

    }

}

// upon clicking an operator, save the inputfield as num1, clear the results input, replace with the operation at hand, 
// function setOperator() {
//     if (!calcState.num1) {
//         calcState.num1 = calcState.inputField;
//     }
//     calcState.inputField = $(this).data().operator;
//     calcState.operator = $(this).data().operator;
//     renderInput();
// }

function clickEqual() {
    console.log('------------- in clickEqual() -----------');
    console.log('current state: ', state);
    state.operation = state.num1 + state.operator + state.num2
    postEqual(state);


}

function renderDisplays() {
    $('#large-display').empty().html(state.display);
    $('#small-display').empty().html(state.operation);
}

// function clickEqual2() {
//     // save inputField as num2 and clear inputField
//     calcState.num2 = calcState.inputField;
//     calcState.inputField = ''
//     console.log('sending operation: ', calcState)
//     renderInput()
//     // with everything packaged, send to postEqual
//     postEqual(calcState);
// }

// create a state equal to the corresponding values using the data in the dom, then run postEqual
function rerunOperation() {
    console.log('--------- in rerunOperation()---------');

    const historyData = $(this).data();

    // console.log($(this).next());
    // const historyText = $(this).next().text();
    // console.log('corresponding text: ', historyText)

    // const historyTextArray = historyText.split(' ').filter(element => {
    //     return element !== '';
    // });
    // console.log(historyTextArray);

    const historyState = {
        num1: historyData.num1,
        num2: historyData.num2,
        operator: historyData.operator
        // display: state.display
    }

    state.operation = historyState.num1 + historyState.operator + historyState.num2;

    postEqual(historyState);
}

function clear() {
    // set input field to zero, set all values to zero, render
    state.num1 = '';
    state.num2 = '';
    state.operator = '';
    state.display = '';
    state.operation = '';
    renderDisplays();
}


// --------------------------------------------- SERVER INTERACTIONS ---------------------------------------------

// upon clicking equal, save the inputfield as num2, clear the results input, make the POST request
function postEqual(state) {
    // get values
    // error validation: only post if num1 and num2 exist. NEXT: USE REGEX TO MAKE SURE NUMS ARE NUMS
    if (!state.num1 || !state.num2) {
        state.display = 'ERROR';
        renderDisplays();
    } else {

        $.ajax({
            type: 'POST',
            url: '/calculate',
            data: {
                num1: state.num1,
                num2: state.num2,
                operator: state.operator
            }
        }).then((res) => {
            console.log('received data: ', res);
            getResults();
        }).catch((err) => {
            console.log('posting went wrong!', err)
        })
        // send ajax POST request

        // in then, send ajax POST to get the result

        // clear inputs
        $('#num1').val('');
        $('#num2').val('');


    }
    // set all state values to default
}

// this function sends a GET request to the server, which has calculated the result
function getResults() {

    console.log('in getResults()');
    $.ajax({
        type: 'GET',
        url: '/calculate'
    }).then((res) => {
        console.log('successfully received data', res);
        //store the result as the new num1
        const lastResult = res[res.length - 1].result;
        console.log('last result: ', lastResult);
        state.num1 = lastResult;
        // state.num2 = ''; 
        // state.operator = ''; //these two are unnecessary and make consecutive calculations messy
        state.display = state.num1;
        state.operation += `=${state.num1}`;
        state.prevResult = lastResult;
        renderDisplays();
        renderHistory(res);
    }).catch((err) => {
        console.log('getResult went wrong: ', err);
    })
}

function clearHistory() {
    console.log('in clearHistory()');
    // clear the history
    $('#history').empty();
    $.ajax({
        type: 'DELETE',
        url: 'calculate'
    }).then((res) => {
        console.log('successfully cleared history');
        getResults();
    }).catch((err) => {
        console.log('could not delete: ', err)
    })
}


// takes the array and renders to the display. 
// elements are objects of the form {
//     num1: ...
//     num2: ...
//     operation:
//     result:
// }

function renderHistory(array) {
    console.log('renderHistory array: ', array)
    $('#history').empty();
    if (array.length) {
        console.log(truncate(array[array.length - 1].result));
        $('large-display').html(truncate(array[array.length - 1].result));


        for (let calculation of array) {
            $('#history').prepend(`
        <div class="operation-container">
            <span class = "past-operation">
                ${calculation.num1} ${calculation.operator} ${calculation.num2} = ${truncate(calculation.result)}
            </span>
            <button data-num1=${calculation.num1} data-num2 = ${calculation.num2} data-operator = ${calculation.operator} class = "rerun-btn">
                <img class = "rerun-btn-img" src="rerun-icon.png" alt="rerun icon"> rerun operation
            </button>
        </div>    
            `);
        }

    }
}


// STRETCH

// CONVERT INTERFACE
//✅ limit characters in the number field - both for inputs and outputs  outputs solved with scrolling
//✅ add decimals
// more bug fixes - what happens when you hit two operators in a row? num1 and num2 regex
//✅ equal saves into num1
// display running operation under main display
//✅ change history to show operations, not 'minus', 'times', etc.
//✅ media query: small screen puts past operations beneath


//✅ POST only if inputs are ready 

//✅ create clear history button (DELETE request)

//✅ arm entries on history list 
//✅ format entries nicely 

// styling
//✅ change colors on certain buttons
// refactor colors into :root
//✅ make fonts work
//✅ clear history button, rerun operation button pretty



//✅ module to handle truncation, rounding, etc. of outputs. require it in client.js

// 

