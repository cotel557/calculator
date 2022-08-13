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
  chosenOp: "",
  prevText: "",
  lastKind: "clear"
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
  if (c.lastKind === "num") {
    c.displayText = c.displayText + char;
  } else {
    c.displayText = "" + char;
  }
  c.lastKind = "num";
}

// if 'clear' is pressed
function chooseClear(c, char) {
  c.displayText = "";
  c.chosenOp = "";
  c.prevText = "";
  c.lastKind = "clear";
}

// if '=' is pressed
function chooseEquals(c, char) {
  if (c.chosenOp && c.lastKind === "num") {
    c.prevText = "" + operate(c.chosenOp, parseInt(c.prevText), parseInt(c.displayText));
    c.displayText = c.prevText;
    c.chosenOp = "";
    c.lastKind = "equals";
  }
}

// if an operator (+, -, *, /) is pressed
function chooseOp(c, char) {
  if (c.displayText) {
    if (!c.chosenOp) {
      c.prevText = c.displayText;
      c.chosenOp = char;
      c.lastKind = "op";
    } else if (c.lastKind === "num") {
      c.prevText = "" + operate(c.chosenOp, parseInt(c.prevText), parseInt(c.displayText));
      c.displayText = c.prevText;
      c.chosenOp = char;
      c.lastKind = "op";
    } else if (c.lastKind === "op") {
      c.chosenOp = char;
      c.lastKind = "op";
    }
  }
}

// update appearance of calculator
function updateDisplay(c) {
  display.textContent = c.displayText;
}

buttons = document.querySelectorAll('.key');
display = document.querySelector('#display');
buttons.forEach(b => b.addEventListener('click', clickButton));
