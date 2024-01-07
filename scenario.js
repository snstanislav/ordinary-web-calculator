let frstBinOperand = undefined;
let scndBinOperand = undefined;
let binaryOperation = undefined;
let currCalcResult = undefined;
let currScreenValue = undefined;
let isFloatPointOn = false;

/* Temporary log container */
let stateDisplay;

let addingOperation = (first, second) => Number(first)+Number(second);
let subtractOperation = (first, second) => Number(first)-Number(second);
let multipleOperation = (first, second) => Number(first)*Number(second);
let divideOperation = (first, second) => Number(first)/Number(second);
let sqrootOperation = value => Math.sqrt(value);
let percentOperation = value => value*0.01;

function init(document) {
  currScreenValue = document.getElementById("calcScreen");

  let buttonsCollection = document.querySelectorAll(".buttonsRow > div");

  ///
  stateDisplay = document.querySelector("body > div > p");

  for (let elem of buttonsCollection) {
    elem.addEventListener("click", performClick);
  }

  ///
  snapshot("after init");
}

function performClick(event) {
  let buttonElement = event.target;
  if (buttonElement.className == "digit") {
    applyDigit(buttonElement.innerText);
  }
  switch (buttonElement.id) {
    case "reset":
      applyReset();
      ///
      snapshot("case: afret reset");
      break;
    case "backspace":
      applyBackspace();
      ///
      snapshot("case: after backspace");
      break;
    case "flpoint":
      applyFloatPoint(buttonElement.innerText);
      ///
      snapshot("case: after float point");
      break;
    case "sqroot":
      setScreenValue(sqrootOperation(getFromScreen()));
      ///
      snapshot("case: after square root");
      break;
    case "percent":
      setScreenValue(percentOperation(getFromScreen()));
      ///
      snapshot("case: after percent");
      break;
    case "equals":
      if (frstBinOperand != undefined && binaryOperation != undefined) {
        processBinary(binaryOperation);

        ///
        snapshot("case: after equals");
      } else {
        snapshot("Equals will not perform");
      }
      break;
    case "divide":
      ///
      snapshot("case: before divide");
      processBinary(divideOperation);
      ///
      //snapshot("case: after divide");
      break;
    case "multiple":
      ///
      snapshot("case: before multip");
      processBinary(multipleOperation);
      ///
     // snapshot("case: after multip");
      break;
    case "subtract":
      ///
      snapshot("case: before subtra");
      processBinary(subtractOperation);
      ///
     // snapshot("case: after substra");
      break;
    case "add":
      ///
      snapshot("case: before add");
      processBinary(addingOperation);
      ///
     // snapshot("case: after add");
      break;
  }
}

function processBinary(currentOperation) {
  binaryOperation = currentOperation;
  if (frstBinOperand == undefined && scndBinOperand == undefined) {
    
    frstBinOperand = getFromScreen();
    snapshot("processBinary - first stage");
    currCalcResult = undefined;
  } else if (frstBinOperand != undefined && scndBinOperand == undefined) {
    scndBinOperand = getFromScreen();

   setScreenValue(equalsOperation(frstBinOperand, scndBinOperand,
      binaryOperation));
      /*
setScreenValue(currentOperation(frstBinOperand, scndBinOperand));
*/

    snapshot("processBinary - second stage");

  } else if (frstBinOperand != undefined && scndBinOperand != undefined &&
  binaryOperation != undefined) {

    currCalcResult = undefined;

    setScreenValue(equalsOperation(frstBinOperand, scndBinOperand,
      binaryOperation));

    /*setScreenValue(currentOperation(frstBinOperand, scndBinOperand));*/
/*
     frstBinOperand = scndBinOperand;
      scndBinOperand = undefined;
binaryOperation = undefined;*/

    snapshot("processBinary - third stage");

  }
}

function equalsOperation(tempFrstOp, tempScndOp, tempBinOp) {
  currCalcResult = undefined;

  snapshot("===equalsOperation called===");

  if (tempFrstOp != undefined && tempScndOp != undefined && tempBinOp != undefined) {

    const result = tempBinOp(tempFrstOp, tempScndOp);
    frstBinOperand = result;
    // scndBinOperand = undefined;
    return result;
  }
}

function getFromScreen() {
  return currScreenValue.innerText;
}
function setScreenValue(value) {
  currScreenValue.innerText = value;
}
function appendScreenValue(value) {
  currScreenValue.innerText += value;
}

function applyReset() {
  setScreenValue("0");
  frstBinOperand = undefined;
  scndBinOperand = undefined;
  binaryOperation = undefined;
  currCalcResult = undefined;
}

function applyDigit(buttValue) {
  if ((frstBinOperand == undefined && scndBinOperand == undefined) ||
    frstBinOperand != undefined && binaryOperation != undefined /*&&
      scndBinOperand == undefined*/) {

    if (currCalcResult == undefined) {
      setScreenValue(buttValue);
      currCalcResult = NaN;
    } else
      appendScreenValue(buttValue);
  }

  if (getFromScreen().charAt(0) == "0" && getFromScreen().length > 1 && getFromScreen().charAt(1) != ".") {
    setScreenValue(
      getFromScreen().substring(1));
  }
}

function applyBackspace() {
  if (!getFromScreen().includes(".")) {
    isFloatPointOn = false;
  }
  if ((frstBinOperand == undefined && scndBinOperand == undefined) ||
    frstBinOperand != undefined && binaryOperation != undefined /*&&
        scndBinOperand == undefined*/) {
    if (currCalcResult != undefined) {
      setScreenValue(getFromScreen().substring(0, getFromScreen().length-1));

      if (getFromScreen().length < 1) {
        setScreenValue("0");
      }
    }
  }
}

function applyFloatPoint(buttValue) {
  if (!getFromScreen().includes(".")) {
    isFloatPointOn = false;
  }
  if ((frstBinOperand == undefined && scndBinOperand == undefined) ||
    frstBinOperand != undefined && binaryOperation != undefined /*&&
        scndBinOperand == undefined*/) {
    if (currCalcResult != undefined &&
      isFloatPointOn == false) {
      appendScreenValue(buttValue);
      isFloatPointOn = true;
    }
  }
}

function snapshot(place) {
  stateDisplay.innerText = 
    "source --- " + place + 
    "\nonScreen -- " + getFromScreen() + "\nfirst bin. operand -- " +
    frstBinOperand + 
    "\nsecond bin. operand -- " + scndBinOperand +
    "\nbinary operation :: " + binaryOperation + "\n\ncurrCalcResult -- " + currCalcResult +
    "\nisFloatPointOn -- " + isFloatPointOn;

  console.log("source -- " + place + "\nonScreen -- " + getFromScreen() + "\nfirst bin. operand -- " +
    frstBinOperand + 
    "\nsecond bin. operand -- " + scndBinOperand +
    "\nbinary operation -- " + binaryOperation + "\n\ncurrCalcResult -- " + currCalcResult +
    "\nisFloatPointOn -- " + isFloatPointOn);
}