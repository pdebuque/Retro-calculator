const state = {
    num1: '',
    num2: '',
    operator: '',
    operation: '',
    display: '',
    prevResult: '',
}

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


// click number alters state of num1 or num2 and renders display
function clickNumber() {
    // if operator has not been set, click number should update num1
    if (!state.operator) {
        state.num1 += $(this).data().val;
        state.operation = state.num1;
        state.display = state.num1;
        renderDisplays();

    } else { // if operator has been set, click number updates num2
        state.num2 += $(this).data().val;
        state.operation += state.num2;
        state.display = state.num2;
        renderDisplays();
    }
}

// click operator alters state of operator and renders display
function clickOperator() {

    // special instructions if there is no previous result
    if (!state.prevResult) {
        const currentOp = $(this).data().operator; // take operator from DOM data
        state.operator = currentOp; // save that operator to state
        state.operation += currentOp; // add that operator to the current operation
        state.display = currentOp; // display that operator on the screen
        renderDisplays();

    } else { // if there is a previous result, it becomes num1 and num2 clears
        const currentOp = $(this).data().operator;
        state.num1 = state.prevResult;
        state.operator = currentOp;
        state.num2 = '';
        state.operation = state.prevResult + currentOp;
        state.display = currentOp;
        renderDisplays();
    }
}

function clickEqual() {
    if (!state.num1 || !state.num2 || !state.operator) { // error handling
        state.display = 'ERROR';
        renderDisplays();
    } else {
        state.operation = state.num1 + state.operator + state.num2 // this allows for repeated equal presses
        postEqual(state);
    }
}

function renderDisplays() {
    $('#large-display').empty().html(state.display);
    $('#small-display').empty().html(state.operation);
}

// create a state equal to the corresponding values using the data in the dom, then run postEqual
function rerunOperation() {
    const historyData = $(this).data();
    const historyState = {
        num1: historyData.num1,
        num2: historyData.num2,
        operator: historyData.operator
        // display: state.display
    }
    state.operation = historyState.num1 + historyState.operator + historyState.num2; // unclog the small display
    postEqual(historyState);
}

function clear() {
    // set all values back to zero and re-render
    state.num1 = '';
    state.num2 = '';
    state.operator = '';
    state.display = '';
    state.operation = '';
    state.prevResult = '';
    renderDisplays();
}


// --------------------------------------------- SERVER INTERACTIONS ---------------------------------------------

// POST request upon hitting equal or rerun operation
function postEqual(state) {
    // send ajax POST request
    $.ajax({
        type: 'POST',
        url: '/calculate',
        data: {
            num1: state.num1,
            num2: state.num2,
            operator: state.operator
        }
    }).then((res) => {
        getResults();
    }).catch((err) => {
        console.log('posting went wrong!', err)
    })
}

// GET request to fetch results array
function getResults() {
    $.ajax({
        type: 'GET',
        url: '/calculate'
    }).then((res) => {
        // update state accordingly
        if (res.length) { // array will have entries if we came from postEqual. If we came from clear history we don't need to do any of this.
            const lastResult = res[res.length - 1].result; // fetches the most recent result value from the array
            state.num1 = lastResult;
            state.display = state.num1;
            state.operation += `=${state.num1}`;
            state.prevResult = lastResult;
            renderDisplays();
            renderHistory(res);
        }
    }).catch((err) => {
        console.log('getResult went wrong: ', err);
    })
}

function clearHistory() {
    // clear the history
    $('#history').empty();
    $.ajax({
        type: 'DELETE',
        url: 'calculate'
    }).then((res) => {
        getResults();
    }).catch((err) => {
        console.log('could not delete: ', err)
    })
}

// render array of objects into the past operations area.
function renderHistory(array) {
    $('#history').empty();
    $('large-display').html(truncate(state.prevResult));
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



