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
let completed = false;

function enterNumber(target) {
  if (completed) {
    a = "";
    b = "";
    action = "";
    screen.textContent = "0";
  }
  if (b === "" && action === "") {
    completed = false;
    target !== "." ? (a += target) : a.includes(".") ? null : (a += target);
    a = a.length > 10 ? a.slice(0, -1) : a;
    screen.textContent = a;
  } else {
    target !== "." ? (b += target) : b.includes(".") ? null : (b += target);
    b = b.length > 10 ? b.slice(0, -1) : b;
    screen.textContent = b;
  }
}

function calculate(target) {
  a = target === "√" ? operations["√"](a) : operations[`${action}`](a, b);
  screen.textContent = a;
  completed = true;
}

function addAction(target) {
  completed = false;
  b = "";
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
  console.log("a:" + a);
  console.log("b:" + b);
  console.log("action:" + action);
  console.log("-----------");
});
