"use strict";

const screenMain = document.querySelector(".screen__main");
const screenExpression = document.querySelector(".screen__expression");
const buttons = document.querySelector(".calculator__buttons");
const operandKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const operatorKeys = ["*", "/", "^", "+", "-", "√"];

let operands = [""];
let newOperandIndex; 
let completed = false;
let stackNumbers = [];
let stackOperators = [];
let currentOperator;

// Priority of operators
const priority = {
  "^": 3,
  "√": 3,
  "*": 2,
  "/": 2,
  "+": 1,
  "-": 1,
};

// Calculations of each operator
const operations = {
  "*": (operand1, operand2) => operand1 * operand2,
  "/": (operand1, operand2) => operand2 / operand1,
  "+": (operand1, operand2) => operand1 + operand2,
  "-": (operand1, operand2) => operand2 - operand1,
  "√": (operand1) => Math.sqrt(operand1),
  "^": (operand1, operand2) => Math.pow(operand2, operand1),
};

// Clearing stack of main function
function clearStack() {
  stackNumbers = [];
  stackOperators = [];
}

// Starting from the beginnin 
function clearAll() {
  operands = [""];
  screenExpression.textContent = 0;
  screenMain.textContent = 0;
}

// Main function
function calculate(array) {
  // Transforming operands from string to number
  array = array.map((el) => (!operatorKeys.includes(el) ? +el : el));

  // Calculating stack
  function calculateStack() {
    stackNumbers.push(
      operations[stackOperators.pop()](stackNumbers.pop(), stackNumbers.pop())
    );
  }

  // Calculating square root
  function calculateStackSqrt() {
    stackNumbers.push(operations[stackOperators.pop()])(stackNumbers.pop());
  }

  
  array.forEach((el) => {
    // Pushing operands into the operands stack
    switch (typeof el) {
      case "number":
        stackNumbers.push(el);

        break;
      // Pushing operators into the operators stack
      case "string":
        if (
          priority[el] > priority[stackOperators[stackOperators.length - 1]] ||
          stackOperators.length === 0
        )
          stackOperators.push(el);
        else if (
          priority[el] <= priority[stackOperators[stackOperators.length - 1]]
        ) {
          // If priority of new operator is less or equal to the last in stack making calculations
          do {
            el === '"√"' ? calculateStackSqrt() : calculateStack();
            currentOperator = stackOperators[stackOperators.length - 1];
          } while (priority[el] <= priority[currentOperator]);
          stackOperators.push(el);
        }
    }
  });

  // Finishing calculations when one or two operators are left 
  if (stackOperators.length === 2) calculateStack();
  if (stackOperators.length === 1) calculateStack();

  // Rounding the output
  if (stackNumbers[0] %1 !== 0 && toString(stackNumbers[0].length > 10))
    stackNumbers[0] = stackNumbers[0].toFixed(6);
  
  screenMain.textContent = operands[0] = stackNumbers[0];
  completed = true;
  console.log(operands);
  clearStack();
}

function addOperand(target) {
  if (completed) {
    operands = [""];
    clearStack();
  }
  
  // Deleting of digits after the dot
  if (target === "<" && operands[newOperandIndex].includes(".")) {
    {
      operands[newOperandIndex] = operands[newOperandIndex].slice(0, -1);
      operands[newOperandIndex] = operands[newOperandIndex].endsWith(".")
        ? operands[newOperandIndex].slice(0, -1)
        : operands[newOperandIndex];
      screenMain.textContent = operands[newOperandIndex];
    }
  }

  // Preventing from inputing more than one dot into the operand
  if (target === "." && operands[newOperandIndex].includes(".")) return;

  // Adding next operands
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


function addOperator(target) {
  // If user decides to calculate the result of previous calculation
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
      addOperand(e.target.value);

      break;

    case "action":
      addOperator(e.target.value);

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
  if (operandKeys.includes(e.key)) {
    addOperand(e.key);
  } else if (operatorKeys.includes(e.key)) {
    addOperator(e.key);
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
