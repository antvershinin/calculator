"use strict";

const screen = document.querySelector(".calculator__screen");
const buttons = document.querySelector(".calculator__buttons");
const numbersKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const actionsKeys = ["*", "/", "^", "+", "-"];

let operands = [""];
let newOperandIndex;
let completed = false;

function enterNumber(target) {
  if (completed) {
    operands = [""];
    screen.textContent = "0";
  }
  if (operands.length === 1) {
    completed = false;
    target !== "."
      ? (operands[0] += target)
      : operands[0].includes(".")
      ? null
      : (operands[0] += target);
    // a = a.length > 10 ? a.slice(0, -1) : a;
    screen.textContent = operands[0];
  } else {
    target !== "."
      ? (operands[newOperandIndex] += target)
      : operands[operands.length].includes(".")
      ? null
      : (operands[newOperandIndex] += target);
    // b = b.length > 10 ? b.slice(0, -1) : b;
  }
  console.log(operands);
}

function calculate(operands) {
  operands = operands.map((el) =>
    !actionsKeys.includes(el) && el !== "" ? +el : Symbol(el)
  );

  completed = true;
}

function addAction(target) {
  completed = false;
  operands[operands.length] = target;
  newOperandIndex = operands.length;
  operands.push("");
  console.log(operands);
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
      enterNumber(e.target.textContent);

      break;

    case "action":
      {
        addAction(e.target.textContent);
      }
      break;

    case "equal":
      {
        calculate(operands);
      }

      break;

      // case "clear":
      //   {
      //     a = "";
      //     b = "";
      //     action = "";
      //     screen.textContent = "0";
      //   }

      //   break;

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
