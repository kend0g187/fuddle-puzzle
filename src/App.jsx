import { useState, useEffect, createContext } from 'react'
import './App.css'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import WinScreen from './components/WinScreen'
import raw from './assets/test_list.txt'

//used to store globals
export const AppContext = createContext();

//static globals can be declared outside of component functions
const boardDefault = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

const colorGridDefault = [
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
];

const keyColorDefault = [
  { letter: "A", color: "gray" },
  { letter: "B", color: "gray" },
  { letter: "C", color: "gray" },
  { letter: "D", color: "gray" },
  { letter: "E", color: "gray" },
  { letter: "F", color: "gray" },
  { letter: "G", color: "gray" },
  { letter: "H", color: "gray" },
  { letter: "I", color: "gray" },
  { letter: "J", color: "gray" },
  { letter: "K", color: "gray" },
  { letter: "L", color: "gray" },
  { letter: "M", color: "gray" },
  { letter: "N", color: "gray" },
  { letter: "O", color: "gray" },
  { letter: "P", color: "gray" },
  { letter: "Q", color: "gray" },
  { letter: "R", color: "gray" },
  { letter: "S", color: "gray" },
  { letter: "T", color: "gray" },
  { letter: "U", color: "gray" },
  { letter: "V", color: "gray" },
  { letter: "W", color: "gray" },
  { letter: "X", color: "gray" },
  { letter: "Y", color: "gray" },
  { letter: "Z", color: "gray" }
];

const word_list = ["RIGHT", "WRONG", "NORTH", "SOUTH", "FUNKY", "BAKER", "DIETY", "FUNNY", "ARROW", "BINGE", "JUNKY"];
const correctWord = word_list[Math.floor(Math.random() * word_list.length)];

function App() {

  //variables affecting the DOM should use state
  const [board, setBoard] = useState(boardDefault);
  const [colorGrid, setColorGrid] = useState(colorGridDefault);
  const [keyColors, setKeyColors] = useState(keyColorDefault);
  const [currAttempt, setCurrAttempt] = useState({
    attempt: 0,
    letterPos: 0,
    keyVal: ""
  });
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(true);

  /* //read in the word list when website loads
  useEffect(() => {
    console.log("Website has loaded!");
    fetchTextFile();
  }, []);

  //fetch word list
  const fetchTextFile = () => {
    fetch(raw)
      .then((response) => response.text())
      .then((text) => {
        const arrayOfStrings = text.split("\n").map((line) => line.trim());
        setWordList(arrayOfStrings);
      })
      .catch((error) => console.error("Error fetching the text file:", error));
  } */
  
  //handle when user enters a letter
  function handleLetter(letter_input) {
    //if user has already entered five letters, do nothing
    if (currAttempt.letterPos > 4) return;
    else {
      //update the board
      const newBoard = [...board];
      newBoard[currAttempt.attempt][currAttempt.letterPos] = letter_input;
      setBoard(newBoard);

      //move to next letter position
      currAttempt.letterPos += 1;
    }
  }

  //handle when user enters backspace
  function handleDelete() {
    //if user hasn't entered a letter yet, do nothing
    if (currAttempt.letterPos === 0) return;
    else {
      //update the board
      const newBoard = [...board];
      newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
      setBoard((prev) => newBoard);

      //move to previous letter position
      currAttempt.letterPos -= 1;
    }
  }

  //handle when user hits enter
  function handleEnter() {
    //if user hasn't entered five letters yet, do nothing
    if (currAttempt.letterPos < 5) return;
    else {

      //build the word
      let word_entered = "";
      for (let i=0; i<5; i++) {
        word_entered = word_entered + board[currAttempt.attempt][i];
      }

      //check if word is in list
      if (!word_list.includes(word_entered)) {
        alert("Word not in list!");
      }
      else {
        let new_colors = ["dark", "dark", "dark", "dark", "dark"];  //this holds Tile colors for the current row
        let taken = [];                                             //this holds indices of 'taken' letters
        let temp_word = correctWord;                                //duplicate of the correct word that we can modify
        
        //check for green
        for (let i=0; i<5; i++) {
          if (word_entered[i] === correctWord[i]) {
            new_colors[i] = "green";                    //update new_colors array
            taken.push(i);                              //add index to 'taken' array
            temp_word = removeChar(i, temp_word);       //remove the character from temp_word
            replaceKeyColor(word_entered[i], "green");  //replace the color of the Keyboard key
          }
        }

        //check for yellow
        for (let i=0; i<5; i++) {
          if (taken.includes(i)) continue;  //don't check 'taken' letters
          else if (temp_word.includes(word_entered[i])) {
            new_colors[i] = "yellow";                                                                   //update new_colors array
            let letter_index = getIndexOfFirstChar(word_entered[i], temp_word)                          //remove the letter from temp_word
            temp_word = temp_word.slice(0, letter_index) + temp_word.slice(letter_index + 1);
            if (getColorFromKey(word_entered[i])=="gray") replaceKeyColor(word_entered[i], "yellow");   //replace the color of the Keyboard key
          }
          else {
            //key must be gray
            if (getColorFromKey(word_entered[i]) == "gray") replaceKeyColor(word_entered[i], "dark");   //replace the color of the Keyboard key
          }
        }

        //update the board
        const newColorGrid = [...colorGrid];
        //this doesn't work for some reason??
        //newColorGrid[currAttempt.attempt] = new_colors;
        for (let i=0; i<5; i++) {
          newColorGrid[currAttempt.attempt][i] = new_colors[i];
        }
        setColorGrid(newColorGrid);
        
        //advance to next row
        currAttempt.attempt += 1;
        currAttempt.letterPos = 0;

        //check for end of game
        if (word_entered === correctWord) {
          setWin((prev) => true);
          setGameOver(true);
        }
        else if (currAttempt.attempt === 6) {
          setWin(false);
          setGameOver(true);
        }
      }
    }
  }

  //function to get the letter position of the first occurance of that letter
  function getIndexOfFirstChar( the_char, the_string ) {
    for (let i=0; i<the_string.length; i++) {
      if (the_char === the_string[i]) return i;
    }
    return -1;
  }

  //function to remove a character from a string
  function removeChar( index, the_string ) {
    let new_str = "";
    for (let i=0; i<the_string.length; i++) {
      if (i === index) new_str = new_str.concat("_");
      else new_str = new_str.concat(the_string[i]);
    }
    return new_str;
  }

  //function to replace a key color
  function replaceKeyColor( the_key, the_color ) {
    const new_object = {letter: the_key, color: the_color};
    const foundIndex = keyColors.findIndex(x => x.letter == the_key);
    keyColors[foundIndex] = new_object;
  }
  
  //function to get color from key
  function getColorFromKey( the_key ) {
    const foundIndex = keyColors.findIndex(x => x.letter == the_key);
    return keyColors[foundIndex].color;
  }

  //this is necessary because using the keyboard is different than clicking a key
  function eventToString(event){
    handleInput(event.key);
  }

  //global function to handle when user inputs something
  function handleInput(inputkey) {
    //using the keyboard registers "Enter" and "Backspace", clicking the Key registers the displayed name
    if (inputkey === "Enter" || inputkey === "ENTER") {
      handleEnter();
    } else if (inputkey === "Backspace" || inputkey === "DELETE") {
      handleDelete();
    } else if (["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
                "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].includes(inputkey)) 
    {  
      handleLetter(inputkey.toUpperCase());
    }
  }
  
  return (
    <div className='App'>
      <nav>
        <h1>Fuddle Puzzle</h1> 
      </nav>
      <AppContext.Provider
        value={{
          board,
          colorGrid,
          currAttempt,
          handleInput,
          eventToString,
          correctWord,
          win,
          getColorFromKey
        }}
      >
        <div className="game">
          {gameOver ? <><Board /><WinScreen /></> : <><Board /><Keyboard /></>}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
