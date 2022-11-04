$(document).ready(onReady)


function onReady() {
    console.log('jquery ready');
    $('.number').on('click', clickNumber);
    $('.operator').on('click', setOperator);
    $('#equal').on('click', clickEqual);
    $('#clear').on('click', clear);
    $('#clear-history').on('click', clearHistory);
    $('#history').on('click', '.rerun-btn', historyRerun)
}

// ------------------------------------------ CLIENT-SIDE CALC FUNCTIONALITY -------------------------------

const calcState = {
    num1: '',
    num2: '',
    operator: '',
    inputField: ''
}

const operators = ['/', '*', '+', '-']
// clicking a number concatenates its data onto the input field, then renders the input
function clickNumber() {
    // after operator entry, need to clear the inputField

    if (operators.includes(calcState.inputField)) {// this is hacky. i'd like to find a different way
        calcState.inputField = '';
        renderInput()
    }

    if (calcState.inputField.length < 8) {
        calcState.inputField += $(this).data().val;
        console.log(calcState.inputField)
        renderInput();
    }
}

function renderInput() {
    $('#number-field').empty();
    $('#number-field').html(calcState.inputField);
}

// upon clicking an operator, save the inputfield as num1, clear the results input, replace with the operation at hand, 
function setOperator() {
    calcState.num1 = calcState.inputField;
    calcState.inputField = $(this).data().symbol;
    calcState.operator = $(this).data().operator;
    renderInput();
}

function clickEqual() {
    // save inputField as num2 and clear inputField
    calcState.num2 = calcState.inputField;
    calcState.inputField = ''
    console.log('sending operation: ', calcState)
    renderInput()
    // with everything packaged, send to postEqual
    postEqual(calcState);
}

// create a state equal to the corresponding values using the data in the dom, then run postEqual
function historyRerun() {
    console.log('in historyRerun()');

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
        operator: historyData.operation,
        inputField: calcState.inputField
    }

    postEqual(historyState);
}

function clear() {
    // set input field to zero, set all values to zero, render
    calcState.num1 = '';
    calcState.num2 = '';
    calcState.operator = '';
    calcState.inputField = '';
    renderInput();
}


// --------------------------------------------- SERVER INTERACTIONS ---------------------------------------------

// upon clicking equal, save the inputfield as num2, clear the results input, make the POST request
function postEqual(state) {
    // get values
    // error validation: only post if num1 and num2 exist
    if (!calcState.num1 || !calcState.num2) {
        calcState.inputField = 'ERROR';
        renderInput();
    } else {

        $.ajax({
            type: 'POST',
            url: '/calculate',
            data: {
                num1: state.num1,
                num2: state.num2,
                operation: state.operator
            }
        }).then((res) => {
            console.log('received data: ', res);
            getResult();
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
function getResult() {

    console.log('in getResults()');
    $.ajax({
        type: 'GET',
        url: '/calculate'
    }).then((res) => {
        console.log('successfully received data');
        renderDisplay(res);
    }).catch((err) => {
        console.log('getResult went wrong: ', err);
    })

}

function clearHistory() {
    console.log('in clearHistory()');
    $.ajax({
        type: 'DELETE',
        url: 'calculate'
    }).then((res) => {
        console.log('successfully cleared history');
        getResult();
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

function renderDisplay(array) {
    $('#history').empty();
    if (array.length) {
        $('#number-field').html(array[array.length - 1].result);


        for (let calculation of array) {
            $('#history').append(`
        <div class="operation-container">
            <button data-num1=${calculation.num1} data-num2 = ${calculation.num2} data-operation = ${calculation.operation} class = "rerun-btn">
                <img class = "rerun-btn-img" src="rerun-icon.png" alt="rerun icon">
            </button>
            <span class = "past-operation">
                ${calculation.num1} ${calculation.operation} ${calculation.num2} = ${calculation.result}
            </span>
        </div>    
            `);
        }

    }
}


// STRETCH

// CONVERT INTERFACE
// limit characters in the number field - both for inputs and outputs ✅ outputs solved with scrolling
// add decimals
// more bug fixes - what happens when you hit two operators in a row?
// equal saves into num1

// POST only if inputs are ready ✅

// create clear history button (DELETE request) ✅

// arm entries on history list
// format entries nicely