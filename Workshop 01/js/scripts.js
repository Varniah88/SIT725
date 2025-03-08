function changeText() {
    const textsArray = ["Hello, World!", "Welcome to SIT 725!", "Coding is fun!", "Keep Learning!", "You can do it!"];
    const number = getRandomNumberBetween(0, textsArray.length - 1);
    console.log("Index: ", number);
    document.getElementById("heading").innerHTML = textsArray[number];
  }
  
  function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  