// execute operation specified by 'operator' on 'a' and 'b'
function operate(operator, a, b) {
  const opToFunc = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
  }
  return opToFunc[operator](a, b);
}

// current state of the calculator
let calcState = {
  displayText: "",
  chosenOp: null,
  prevResult: null,
  lastKind: "clear",
  errorMessage: null
};

// run if any button on the calculator is clicked
function clickButton(e) {
  // inputs that change calculator state
  const char = e.target.textContent;
  const kind = e.target.getAttribute('data-kind');

  //mutate calculator state according to input
  const kindToFunc = {
    "num": chooseNum,
    "clear": chooseClear,
    "equals": chooseEquals,
    "op": chooseOp
  }
  const func = kindToFunc[kind];
  func(calcState, char);

  // update appearance of calculator
  updateDisplay(calcState);
}

// if a digit (0-9) is pressed
function chooseNum(c, char) {
  let temp = (c.lastKind === "num") ? c.displayText : "";

  if (char === '.') {
    if (!temp.includes('.')) {
      temp += '.';
    }
  } else if (char === 'del') {
    if (temp.length > 0) {
      temp = temp.slice(0, -1);
    } else {
      return;
    }
  } else {
    temp += char;
  }

  c.displayText = temp;
  c.lastKind = "num";
  c.errorMessage = null;
}

// if 'clear' is pressed
function chooseClear(c, char) {
  c.displayText = "";
  c.chosenOp = null;
  c.prevResult = null;
  c.lastKind = "clear";
  c.errorMessage = null;
}

// if '=' is pressed
function chooseEquals(c, char) {
  if (c.chosenOp && c.lastKind === "num") {
    const displayNum = parseFloat(c.displayText);
    if (c.chosenOp === '/' && displayNum === 0) {
      chooseClear(c, char);
      c.errorMessage = "Can't divide by zero!";
    } else {
      c.prevResult = operate(c.chosenOp, c.prevResult, displayNum);
      c.displayText = Math.round(10000 * c.prevResult) / 10000;
      c.chosenOp = null;
      c.lastKind = "equals";
    }
  }
}

// if an operator (+, -, *, /) is pressed
function chooseOp(c, char) {
  if (c.displayText !== "") {
    const displayNum = parseFloat(c.displayText);
    if (c.chosenOp === null) {
      if (c.lastKind !== "equals") {
        c.prevResult = displayNum;
      }
      c.chosenOp = char;
      c.lastKind = "op";
    } else if (c.lastKind === "num") {
      if (c.chosenOp === '/' && displayNum === 0) {
        chooseClear(c, char);
        c.errorMessage = "Can't divide by zero!";
      } else {
        c.prevResult = operate(c.chosenOp, c.prevResult, displayNum);
        c.displayText = Math.round(10000 * c.prevResult) / 10000;
        c.chosenOp = char;
        c.lastKind = "op";
      }
    } else if (c.lastKind === "op") {
      c.chosenOp = char;
      c.lastKind = "op";
    }
  }
}

// update appearance of calculator
function updateDisplay(c) {
  display.textContent = c.errorMessage ?? c.displayText;

  // highlight selected operator
  const ops = Array.from(document.querySelectorAll('.op'));
  ops.forEach(op => op.classList.remove('selected-op'));
  const selectedOp = ops.find(op => op.textContent === c.chosenOp);
  if (selectedOp) {
    selectedOp.classList.add('selected-op');
  }
}

buttons = document.querySelectorAll('.key');
display = document.querySelector('#display');
buttons.forEach(b => b.addEventListener('click', clickButton));

function keyPress(e) {
  const k = e.key;

  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(k)) {
    chooseNum(calcState, k);
  } else if (k === 'Backspace') {
    chooseNum(calcState, 'del');
  } else if (['+', '-', '*', '/'].includes(k)) {
    chooseOp(calcState, k);
  } else if (k === '=') {
    chooseEquals(calcState, k);
  } else if (k === 'C') {
    chooseClear(calcState, k);
  }

  updateDisplay(calcState);
}

window.addEventListener('keydown', keyPress);
