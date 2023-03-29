"use strict";

const screenMain = document.querySelector(".screen__main");
const screenExpression = document.querySelector(".screen__expression");
const buttons = document.querySelector(".calculator__buttons");
const numbersKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const actionsKeys = ["*", "/", "^", "+", "-"];

let operands = [""];
let newOperandIndex;
let currentOperand;
let completed = false;
let result = "";
let stackNumbers = [];
let stackOperators = [];
let currentOperator;

const priority = {
  "*": 2,
  "/": 2,
  "+": 1,
  "-": 1,
};

const operations = {
  "*": (a, b) => a * b,
  "/": (a, b) => b / a,
  "+": (a, b) => a + b,
  "-": (a, b) => b - a,
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
            makeCalc();
            currentOperator = stackOperators[stackOperators.length - 1];
          } while (priority[el] <= priority[currentOperator]);
          stackOperators.push(el);
        }
    }
  });

  if (stackOperators.length === 2) makeCalc();
  if (stackOperators.length === 1) makeCalc();

  screenMain.textContent = operands[0] = result = stackNumbers[0];
  completed = true;

  clearStack();

  console.log(operands);
}

function enterNumber(target) {
  if (completed) {
    operands = [""];
    stackNumbers = [];
    screenMain.textContent = "0";
    screenExpression.textContent = "0";
  }
  if (operands.length === 1) {
    completed = false;
    target !== "."
      ? (operands[0] += target)
      : operands[0].includes(".")
      ? null
      : (operands[0] += target);
    // a = a.length > 10 ? a.slice(0, -1) : a;
    screenMain.textContent = operands[0];
  } else {
    target !== "."
      ? (operands[newOperandIndex] += target)
      : operands[operands.length].includes(".")
      ? null
      : (operands[newOperandIndex] += target);
    screenMain.textContent = operands[newOperandIndex];
    // b = b.length > 10 ? b.slice(0, -1) : b;
  }
  screenExpression.textContent = operands.join(" ");
  console.log(operands);
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

// buttons.addEventListener("keypress", (e) => {
//   if (numbersKeyboard.includes(e.key)) {
//     enterNumber(e.key);
//   } else if (actionsKeyboard.includes(e.key)) {
//     addAction(e.key);
//   } else if (e.key === "=") {
//     calculate(e.key);
//   } else return;
// });

buttons.addEventListener("click", (e) => {
  if (!e.target.classList.contains("button")) return;

  switch (e.target.id) {
    case "number":
      enterNumber(e.target.value);

      break;

    case "action":
      {
        addAction(e.target.value);
      }
      break;

    case "equal":
      {
        calculate(operands);
      }

      break;

    case "clear":
      clearAll();
      break;

      // case "action--delete":
      //   {
      //     if (a.includes(".")) {
      //       a = a.slice(0, -1);
      //       a = a.endsWith(".") ? a.slice(0, -1) : a;
      //       screen.textContent = a;
      //     }
      //     console.log(a);
      //   }

      break;
  }
});
