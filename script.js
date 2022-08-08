function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function div(a, b) {
  return a / b;
}

function operate(a, b, operator) {
  return operator(a, b);
}

let displayValue = "";
buttons = document.querySelectorAll('.key');
display = document.querySelector('#display');

function clickButton(e) {
  const char = e.target.textContent;
  const num = parseInt(char);
  if (!isNaN(num)) {
    displayValue = displayValue + num;
  } else if (char === "C") {
    displayValue = "";
  }
  display.textContent = displayValue;
}

buttons.forEach(b => b.addEventListener('click', clickButton));
