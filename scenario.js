let firstBinaryOperand = undefined;
let secondBinaryOperand = undefined;
let binaryOperation = undefined;
let currScreenValue = undefined;
let currentResult = 0;
let isFloatPointOn = false;
let isFrstInput = false;
let isScndInput = false;

let addingOperation = (first, second) => Number(first)+Number(second);
let subtractOperation = (first, second) => first-second;
let multipleOperation = (first, second) => first*second;
let divideOperation = (first, second) => first/second;
let sqrootOperation = value => Math.sqrt(value);
let percentOperation = value => value*0.01;

function init(document) {
  currScreenValue = document.getElementById("calcScreen");

  let buttonsCollection = document.querySelectorAll(".buttonsRow > div");

  isFrstInput = true;
  isScndInput = false;

  for (let elem of buttonsCollection) {
    elem.addEventListener("click", perform);
  }
}

function perform(event) {
  let buttonElement = event.target;
  if (buttonElement.className == "digit") {
    if (isFrstInput && !isScndInput) {
      increaseScreen(buttonElement.innerText);
    }
    if (!isFrstInput && !isScndInput) {
      showOnScreen(buttonElement.innerText);
      isScndInput = true;
    } else if (!isFrstInput && isScndInput) {
      increaseScreen(buttonElement.innerText);
    }

    if (getFromScreen().charAt(0) == "0" && getFromScreen().length > 1 && getFromScreen().charAt(1) != ".") {
      showOnScreen(
        getFromScreen().substring(1));
    }
  }
  switch (buttonElement.id) {
    case "reset":
      showOnScreen("0");
      firstBinaryOperand = undefined;
      secondBinaryOperand = undefined;
      binaryOperation = undefined;
      isFrstInput = true;
      isScndInput = false;

      snapshot("===afret reset===")
      break;
    case "backspace":
      if (isFrstInput || isScndInput) {
        showOnScreen(getFromScreen().substring(0, getFromScreen().length-1));
        if (!getFromScreen().includes(".")) {
          isFloatPointOn = false;
        }
        if (getFromScreen().length < 1) {
          showOnScreen("0");
        }
      }
      break;
    case "flpoint":
      if (isFloatPointOn == false) {
        increaseScreen(buttonElement.innerText);
        isFloatPointOn = true;
      }
      break;
    case "sqroot":
      showOnScreen(sqrootOperation(getFromScreen()));
      break;
    case "percent":
      showOnScreen(percentOperation(getFromScreen()));
      break;
    case "equals":
      if (firstBinaryOperand != undefined) {
        processBinary(binaryOperation);

      } else {
        snapshot("Equals will not perform");
      }
      break;
    case "divide":
      processBinary(divideOperation);
      break;
    case "multiple":
      processBinary(multipleOperation);
      break;
    case "subtract":
      processBinary(subtractOperation);
      break;
    case "add":
      processBinary(addingOperation);
      break;
  }
}

function processBinary(currentOperation) {
  binaryOperation = currentOperation;
  isFrstInput = false;
  
  if (firstBinaryOperand == undefined && secondBinaryOperand == undefined) {
    firstBinaryOperand = getFromScreen();
    snapshot("===processBinary first stage===");

  } else if (firstBinaryOperand != undefined && secondBinaryOperand == undefined) {
    secondBinaryOperand = getFromScreen();

    showOnScreen(equalsOperation(firstBinaryOperand, secondBinaryOperand,
      binaryOperation));
    isScndInput = false;
    snapshot("===processBinary second stage===");

  } else if (firstBinaryOperand != undefined && secondBinaryOperand != undefined) {
     isFrstInput = false;
      isScndInput = false;

    showOnScreen(equalsOperation(firstBinaryOperand, secondBinaryOperand,
      binaryOperation));

    snapshot("===processBinary third stage===");

  }
}

function equalsOperation(tempFrstOp, tempScndOp, tempBinOp) {
  snapshot("===equalsOperation called===");

  if (tempFrstOp != undefined && tempScndOp != undefined && tempBinOp != undefined) {

    const result = tempBinOp(tempFrstOp, tempScndOp);
    firstBinaryOperand = result;
    return result;
  }
}

function getFromScreen() {
  return currScreenValue.innerText;
}
function showOnScreen(value) {
  currScreenValue.innerText = value;
}
function increaseScreen(value) {
  currScreenValue.innerText += value;
}

function snapshot(place) {
  console.log(place + "\n" + getFromScreen() + "\nfirstBinaryOperand " +
    firstBinaryOperand + "\nsecondBinaryOperand " + secondBinaryOperand +
    "\nbinaryOperation " + binaryOperation + "\nisFrstInput " + isFrstInput +
    "\nisScndInput " + isScndInput
    + "\n----------------");
}