"use strict";

const screen = document.querySelector(".calculator__screen");
const buttons = document.querySelector(".calculator__buttons");
const numbersKeyboard = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const actionsKeyboard = ["*", "/", "^", "+", "-"];

const operations = {
  "*"(a, b) {
    return +a * +b;
  },
  "/"(a, b) {
    return +a / +b;
  },
  "+"(a, b) {
    return +a + +b;
  },
  "-"(a, b) {
    return +a - +b;
  },
  "^"(a, b) {
    return a ** +b;
  },
  "√"(a) {
    return Math.sqrt(a);
  },
};

let a = "";
let b = "";
let action = "";

function enterNumber(target) {
  if (b === "" && action === "") {
    target !== "." ? (a += target) : a.includes(".") ? null : (a += target);
    screen.textContent = a;
  } else {
    target !== "." ? (b += target) : b.includes(".") ? null : (b += target);
    screen.textContent = b;
  }
}

function calculate(target) {
  a = target === "√" ? operations["√"](a) : operations[`${action}`](a, b);
  screen.textContent = a;
  b = "";
}

function addAction(target) {
  action = target;
  screen.textContent = action;
}

buttons.addEventListener("keypress", (e) => {
  if (numbersKeyboard.includes(e.key)) {
    enterNumber(e.key);
  } else if (actionsKeyboard.includes(e.key)) {
    addAction(e.key);
  } else if (e.key === "=") {
    calculate(e.key);
  } else return;
});

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
        calculate(e.target.textContent);
      }

      break;

    case "clear":
      {
        a = "";
        b = "";
        action = "";
        screen.textContent = "0";
      }

      break;

    case "action--delete":
      {
        if (a.includes(".")) {
          a = a.slice(0, -1);
          a = a.endsWith(".") ? a.slice(0, -1) : a;
          screen.textContent = a;
        }
        console.log(a);
      }

      break;
  }
});
