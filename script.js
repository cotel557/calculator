function operate(operator, a, b) {
  const opToFunc = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
  }
  return opToFunc[operator](a, b);
}

let calcState = {
  displayText: "",
  chosenOp: "",
  prevText: "",
  lastKind: "clear"
};

function clickButton(e) {
  const char = e.target.textContent;
  const kind = e.target.getAttribute('data-kind');
  const kindToFunc = {
    "num": chooseNum,
    "clear": chooseClear,
    "equals": chooseEquals,
    "op": chooseOp
  }
  const func = kindToFunc[kind];

  func(calcState, char);

  updateDisplay(calcState);
}

function chooseNum(c, char) {
  if (c.lastKind === "num") {
    c.displayText = c.displayText + char;
  } else {
    c.displayText = "" + char;
  }
  c.lastKind = "num";
}

function chooseClear(c, char) {
  c.displayText = "";
  c.chosenOp = "";
  c.prevText = "";
  c.lastKind = "clear";
}

function chooseEquals(c, char) {
  if (c.chosenOp && c.lastKind === "num") {
    c.prevText = "" + operate(c.chosenOp, parseInt(c.prevText), parseInt(c.displayText));
    c.displayText = c.prevText;
    c.chosenOp = "";
    c.lastKind = "equals";
  }
}

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

function updateDisplay(c) {
  display.textContent = c.displayText;
}

buttons = document.querySelectorAll('.key');
display = document.querySelector('#display');
buttons.forEach(b => b.addEventListener('click', clickButton));
