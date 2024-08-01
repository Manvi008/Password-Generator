const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //or kuch bhi karna chahiye ? - HW
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //it will give the random interger in between min and max
}

function generateRandomNumber() {
  return getRndInteger(0, 9); //it will give the number from 0 to 9
}
//to take the character between the a to z randomly
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
//to take the character between the A to Z randomly
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
// if checked that particular requirement then we let true other wise flase
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;
  //on true of false basis we are setting the color to the indicator
  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); //use to copy the password on the clipboard this is async operation so until it will finish, do not move forward
    copyMsg.innerText = "copied"; //if promise will resolve then wii will disply the copied over there
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000); //after 2 sec the copy text will be invisible
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
//if the checkbox will check or unchecked
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++; //to check kitne checked hai
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider(); //to show at UI
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});
//use to add the event listener over the slider
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value; //what ever the slider value will be there the password would be of that size
  handleSlider(); //it will takle the UI by showing the length of the password at UI
});
//use to add the event listener over the copy button
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent(); //if there is any non empty password exist then show copy
});

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected

  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let's start the jouney to find new password
  console.log("Starting the Journey");
  //remove old password
  password = "";

  //let's put the stuff mentioned by checkboxes

  // if(uppercaseCheck.checked) {
  //     password += generateUpperCase();
  // }

  // if(lowercaseCheck.checked) {
  //     password += generateLowerCase();
  // }

  // if(numbersCheck.checked) {
  //     password += generateRandomNumber();
  // }

  // if(symbolsCheck.checked) {
  //     password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("COmpulsory adddition done");

  //remaining adddition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }
  console.log("Remaining adddition done");
  //shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling done");
  //show in UI
  passwordDisplay.value = password;
  console.log("UI adddition done");
  //calculate strength
  calcStrength();
});
