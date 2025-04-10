import { useState, useEffect, createContext } from 'react'
import './App.css'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import WinScreen from './components/WinScreen'
import InfoScreen from './components/InfoScreen.jsx'
import { 
  boardDefault,       //2d array of blank tile letters
  colorGridDefault,   //2d array of blank tile colors
  keyColorDefault,    //array of default keyboard key colors
  allLetters,         //array of 26 lowercase and 26 uppercase letters
  removeChar,         //function to remove a letter from a word
  to2dDeepCopy,       //function to create a real copy of a 2d array
  todayString,        //function to get today's date as a string
  fetchData,          //function to read in the word list
  defaultPlayerData,  //function to get defaults for LS data
  addWordToLS,        //function to add submitted word to LS 'guessedWords'
  resetLSData,        //function to reset LS data
  safelyReadPlayerData
} from './util.js'

//used to store globals
export const AppContext = createContext();

function App() {
  //variables affecting the DOM should use state
  const [correctWord, setCorrectWord] = useState([]);           //the answer
  const [usedWords, setUsedWords] = useState([]);               //list of past answers
  const [wordList, setWordList] = useState([]);                 //list of all possible answers
  const [board, setBoard] = useState(boardDefault);             //the 6x5 grid of tile letters
  const [colorGrid, setColorGrid] = useState(colorGridDefault); //the 6x5 grid of tile colors
  const [keyColors, setKeyColors] = useState(keyColorDefault);  //list of colors for each keyboard key
  const [currAttempt, setCurrAttempt] = useState({              //data about current state
    attempt: 0,
    letterPos: 0,
    keyVal: ""
  });
  const [showInfo, setShowInfo] = useState(false);              //boolean whether to show info screen
  const [gameOver, setGameOver] = useState(false);              //boolean for if the game is over
  const [win, setWin] = useState(true);                         //boolean for if the player won

  //function to get wordList, correctWord, and usedWords
  async function fetchTextFile() {
    const { words, used_words, correct_word } = await fetchData()
    setWordList(words)
    setUsedWords(used_words)
    const temp = () => setCorrectWord(correct_word);
    console.log("fetched correct word, correct word is " + correctWord)
  }

  /* async function getPlayerData() {
    try {
      const data = await JSON.parse(localStorage.getItem('fuddle-puzzle-data'))
      console.log("Read player data:", data)
      if (typeof data !== 'object')
        console.log("data is not an object")
      if (Array.isArray(data)) 
        console.log("data is an array")
      if (data === null) {
        console.log("data is null")
        return defaultPlayerData()
      }
      
      return data;
    } catch (error) {
      console.error(error)
      console.warn("Failed reading JSON, using default data.")
      return defaultPlayerData()
    }
  } */

  async function readyGame(corr_word) {
    console.log("This is readyGame() calling safelyReadPlayerData()")
    const data = safelyReadPlayerData()
    console.log("This is readyGame(). Data I got from sRPD is:", data)
    if (data.date == todayString()) {
      //They've played today. Set up the board.
      console.log("This is readyGame(). Player has already played today.")
      for (let i=0; i<data.guessedWords.length; i++) {
        console.log("This is readyGame() loop. Reading guessedWords one by one.")
        const current_word = data.guessedWords[i]
        console.log("This is readyGame() loop. Current word is " + current_word)
        //submit the word and update local storage
        for (let i = 0; i < 5; i++) {
          console.log("This is readyGame() letter loop. Calling handleLetter with " + current_word[i])
          handleLetter(current_word[i])
        }
        submitWord(current_word, corr_word)
      }
      setGameOver(data.over)
    } else {
      //They haven't played today. Reset local storage.
      resetLSData()
    }
  }

  //call the function on app load
  useEffect(() => {
    const runFunctions = async () => {
      await fetchTextFile(); // Function A
      readyGame(correctWord);             // Function B
    };

    runFunctions()
    
  }, []);
  
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
    
    //update the board
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard((prev) => newBoard);

    //move to previous letter position
    currAttempt.letterPos -= 1;
  }

  //handle when user hits enter
  function handleEnter() {
    //if user hasn't entered five letters yet, do nothing
    if (currAttempt.letterPos < 5) return;

    //build the word
    let word_entered = "";
    for (let i=0; i<5; i++) {
      word_entered = word_entered + board[currAttempt.attempt][i];
    }

    //check if word is in list
    if (!wordList.includes(word_entered)) {
      alert(word_entered + " is not in the word list!");
      clearRow();
      return;
    }

    //check if word has been used
    if (usedWords.includes(word_entered)) {
      let text = word_entered + " has previously been used. Would you still like to submit it?";
      if (confirm(text) == false) {
        clearRow();
        return;
      } 
    }

    //submit the word and add it to local storage
    submitWord(word_entered, false)
    addWordToLS(word_entered)
  }

  function submitWord(word_entered, corr_word) {
    let new_colors = ["dark", "dark", "dark", "dark", "dark"];  //this holds Tile colors for the current row
    let taken = [];                                             //this holds indices of 'taken' letters
    let temp_word = "";
    try {
      temp_word = corr_word;
    } catch (error) {
      temp_word = correctWord;                                //duplicate of the correct word that we can modify
    }
    

    //check for green
    for (let i = 0; i < 5; i++) {
      const ltr = word_entered[i]
      const correctLtr = correctWord[i]

      if (ltr === correctLtr) {
        new_colors[i] = "green";                    //update new_colors array
        taken.push(i);                              //add index to 'taken' array
        temp_word = removeChar(i, temp_word);       //remove the character from temp_word
        replaceKeyColor(word_entered[i], "green");  //replace the color of the Keyboard key
      }
    }

    //check for yellow
    for (let i = 0; i < 5; i++) {
      if (taken.includes(i)) continue;                  //don't check 'taken' letters
      else if (temp_word.includes(word_entered[i])) {
        const ltr = word_entered[i];
        new_colors[i] = "yellow";                       //update new_colors array
        let letter_index = temp_word.indexOf(ltr)       //remove the letter from temp_word
        temp_word = temp_word.slice(0, letter_index) + temp_word.slice(letter_index + 1);
        if (getColorFromKey(word_entered[i]) == "gray") replaceKeyColor(word_entered[i], "yellow");   //replace the color of the Keyboard key
      }
      else {
        //tile must be dark, make keyboard key dark, if it's not already green or yellow
        if (getColorFromKey(word_entered[i]) == "gray") replaceKeyColor(word_entered[i], "dark");   //replace the color of the Keyboard key
      }
    }

    //update the board (tile colors)
    const newColorGrid = to2dDeepCopy(colorGrid)
    newColorGrid[currAttempt.attempt] = [...new_colors];
    setColorGrid(newColorGrid);

    if (!fromLS) currAttempt.attempt += 1;  //advance to next row if called from handleEnter()
    currAttempt.letterPos = 0;              //go back to left position
    setCurrAttempt({ ...currAttempt })      // update state

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

  function clearRow() {
    //update the board
    const newBoard = [...board];
    for (let i=0; i<5; i++) {
      newBoard[currAttempt.attempt][i] = "";
    }
    setBoard((prev) => newBoard);

    //move to first letter position
    currAttempt.letterPos = 0;
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
    } else if (allLetters.includes(inputkey)) 
    {  
      handleLetter(inputkey.toUpperCase());
    }
  }
  
  return (
    <div className='App'>
      <nav>
        <div className="spacer"></div>
        <h1>Fuddle Puzzle</h1>
        <img src='/infoicon.svg' alt='info icon' onClick={() => setShowInfo(!showInfo)} />
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
          {showInfo ? <InfoScreen /> : (gameOver ? <><button onClick={resetLSData}>R</button><Board /><WinScreen /></> : <><button onClick={resetLSData}>R</button><Board /><Keyboard /></>)}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
