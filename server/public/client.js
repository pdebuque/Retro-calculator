$(document).ready(onReady)


function onReady() {
    console.log('jquery ready')
    $('.operator').on('click', setOperator);
    $('#equal').on('click', postEqual);
    $('#clear').on('click', clearInputs);
}

let operator;

function setOperator() {
    console.log('in updateOperator()')
    operator = $(this).data().operator;
    console.log('the operator is now', operator)
}

function postEqual() {
    // get values

    $.ajax({
        type: 'POST',
        url: '/calculate',
        data: {
            num1: $('#num1').val(),
            num2: $('#num2').val(),
            operation: operator
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

// this function sends a GET request to the server, which has calculated the result
function getResult() {
    console.log('in getResults()')
    $.ajax({
        type: 'GET',
        url: '/calculate'
    }).then((res) => {
        console.log('successfully received data')
        renderDisplay(res)
    }).catch((err) => {
        console.log('something went wrong: ', err)
    })

}

function clearInputs() {
    $('#num1').val('');
    $('#num2').val('');
}

// takes the array and renders to the display. 
// elements are objects of the form {
//     num1: ...
//     num2: ...
//     operation:
//     result:
// }

function renderDisplay(array) {
    $('#results').empty();

    for (let calculation of array) {
        $('#results').append(`
        ${calculation.num1} ${calculation.operation} ${calculation.num2} = ${calculation.result}`);
    }
}