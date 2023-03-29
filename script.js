"use strict";

const screenMain = document.querySelector(".screen__main");
const screenExpression = document.querySelector(".screen__expression");
const buttons = document.querySelector(".calculator__buttons");
const numbersKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const actionsKeys = ["*", "/", "^", "+", "-", "√"];

let operands = [""];
let newOperandIndex;
let completed = false;
let stackNumbers = [];
let stackOperators = [];
let currentOperator;

const priority = {
  "^": 3,
  "√": 3,
  "*": 2,
  "/": 2,
  "+": 1,
  "-": 1,
};

const operations = {
  "*": (operand1, operand2) => operand1 * operand2,
  "/": (operand1, operand2) => operand2 / operand1,
  "+": (operand1, operand2) => operand1 + operand2,
  "-": (operand1, operand2) => operand2 - operand1,
  "√": (operand1) => Math.sqrt(operand1),
  "^": (operand1, operand2) => Math.pow(operand2, operand1),
};

function clearStack() {
  stackNumbers = [];
  stackOperators = [];
}

function clearAll() {
  operands = [""];
  screenExpression.textContent = 0;
  screenMain.textContent = 0;
}

function calculate(array) {
  array = array.map((el) => (!actionsKeys.includes(el) ? +el : el));

  function makeCalc() {
    stackNumbers.push(
      operations[stackOperators.pop()](stackNumbers.pop(), stackNumbers.pop())
    );
  }

  function makeSqrt() {
    stackNumbers.push(operations[stackOperators.pop()])(stackNumbers.pop());
  }

  array.forEach((el) => {
    switch (typeof el) {
      case "number":
        stackNumbers.push(el);

        break;

      case "string":
        if (
          priority[el] > priority[stackOperators[stackOperators.length - 1]] ||
          stackOperators.length === 0
        )
          stackOperators.push(el);
        else if (
          priority[el] <= priority[stackOperators[stackOperators.length - 1]]
        ) {
          do {
            el === '"√"' ? makeSqrt() : makeCalc();
            currentOperator = stackOperators[stackOperators.length - 1];
          } while (priority[el] <= priority[currentOperator]);
          stackOperators.push(el);
        }
    }
  });

  if (stackOperators.length === 2) makeCalc();
  if (stackOperators.length === 1) makeCalc();

  if (stackNumbers[0] % 2 !== 0 && toString(stackNumbers[0].length > 10))
    stackNumbers[0] = stackNumbers[0].toFixed(8);

  screenMain.textContent = operands[0] = stackNumbers[0];
  completed = true;
  console.log(operands);
  clearStack();
}

function enterNumber(target) {
  if (completed) {
    operands = [""];
    clearStack();
  }

  if (target === "<" && operands[newOperandIndex].includes(".")) {
    {
      operands[newOperandIndex] = operands[newOperandIndex].slice(0, -1);
      operands[newOperandIndex] = operands[newOperandIndex].endsWith(".")
        ? operands[newOperandIndex].slice(0, -1)
        : operands[newOperandIndex];
      screenMain.textContent = operands[newOperandIndex];
    }
  }

  if (target === "." && operands[newOperandIndex].includes(".")) return;

  if (operands.length === 1 && target !== "<") {
    completed = false;
    newOperandIndex = 0;
    operands[0] += target;
  } else if (target !== "<") {
    operands[newOperandIndex] += target;
  }
  screenExpression.textContent = operands.join(" ");
  screenMain.textContent = operands[newOperandIndex];
}

function addAction(target) {
  if (completed) {
    operands.splice(1);
  }

  completed = false;
  operands[operands.length] = target;
  newOperandIndex = operands.length;
  operands.push("");
  screenMain.textContent = target;
}

function mouseClick(e) {
  if (!e.target.classList.contains("button")) return;

  switch (e.target.id) {
    case "number":
      enterNumber(e.target.value);

      break;

    case "action":
      addAction(e.target.value);

      break;

    case "equal":
      calculate(operands);

      break;

    case "clear":
      clearAll();
      break;
  }
}

function keyboardPress(e) {
  if (numbersKeys.includes(e.key)) {
    enterNumber(e.key);
  } else if (actionsKeys.includes(e.key)) {
    addAction(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    calculate(operands);
  } else return;
}

buttons.addEventListener("click", (e) => {
  mouseClick(e);
  e.preventDefault();
});

buttons.addEventListener("keypress", (e) => {
  e.preventDefault();
  keyboardPress(e);
});
