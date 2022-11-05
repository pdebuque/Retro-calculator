// attempting to refactor server-side calculator logic and displays

const state = {
    num1: '',
    num2: '',
    operator: '',
    operation: '',
    display: ''
}

$(onReady)

function onReady() {
    // arm number buttons
    // arm operator buttons

}

function clickNumber() {
    // handle for num1
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

function clickOperator() {
    state.operator = $(this).data().val;
    state.operation += state.operator;
    state.display = state.operator;
    renderDisplays();
}

function clickEqual() {
    // set num2 to num1;
    state.num1 = state.num2;





    // // if there is an operation loaded, do it again
    // if (state.num1 && state.num2 && state.operator) {

    // }
}

function renderDisplays() {
    $('#large-display').empty().html(state.display);
    $('#small-display').empty().html(state.operation);
}

