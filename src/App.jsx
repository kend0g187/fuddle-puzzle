import { useState, useEffect, createContext } from 'react'
import './App.css'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import WinScreen from './components/WinScreen'
import InfoScreen from './components/InfoScreen.jsx'
import { 
  boardDefault,         //2d array of blank tile letters
  colorGridDefault,     //2d array of blank tile colors
  keyColorDefault,      //array of default keyboard key colors
  allLetters,           //array of 26 lowercase and 26 uppercase letters
  removeChar,           //function to remove a letter from a word
  to2dDeepCopy,         //function to create a real copy of a 2d array
  todayString,          //function to get today's date as a string
  fetchData,            //function to read in the word list
  defaultPlayerData,    //function to get defaults for LS data
  addWordToLS,          //function to add submitted word to LS 'guessedWords'
  addLetterToLS,        //function to add letter of submitted word to LS 'letters'
  addColorToLS,         //function to add color of submitted letters to LS 'colors'
  resetLSData,          //function to reset LS data
  safelyReadPlayerData,  //function to read LS data
  savePlayerData
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
  const [prevent, setPrevent] = useState(true)                  //boolean to prevent LS from triggering actions

  //function to get wordList, correctWord, and usedWords
  async function fetchTextFile() {
    const { words, usedWords, correctWord } = await fetchData()
    setWordList(words)
    setUsedWords(usedWords)
    setCorrectWord(correctWord);
  }

  async function readyGame() {
    const data = safelyReadPlayerData()
    
    //if they've played today set up the board.
    if (data.date == todayString()) {
      //if they haven't submitted any words do nothing
      if (data.guessedWords.length == 0) return

      //update the board (tile letters)
      const newBoard = [...board]
      //loop for each word
      for (let i=0; i<data.guessedWords.length; i++) {
        //loop for each letter
        for (let j=0; j<5; j++) {
          newBoard[i][j] = data.letters[5*i+j]
        }
      }
      setBoard(newBoard)

      //update the board (tile colors)
      const newColorGrid = [...colorGridDefault]
      //loop for each word
      for (let i = 0; i < data.guessedWords.length; i++) {
        //loop for each letter
        for (let j = 0; j < 5; j++) {
          newColorGrid[i][j] = data.colors[5 * i + j]
        }
      }
      setColorGrid(newColorGrid)

      //update the keyboard colors 
      for (let i=0; i<data.letters.length; i++) {
        replaceKeyColor(data.letters[i], "dark")
      }
      for (let i = 0; i < data.letters.length; i++) {
        if (data.colors[i] == "yellow") replaceKeyColor(data.letters[i], "yellow")
      }
      for (let i = 0; i < data.letters.length; i++) {
        if (data.colors[i] == "green") replaceKeyColor(data.letters[i], "green")
      }
      //update the rest
      currAttempt.attempt = data.guessedWords.length;              
      setCurrAttempt({ ...currAttempt })      
      setGameOver(data.over)
      setWin(data.win)
    } else {
      //They haven't played today. Reset local storage.
      resetLSData()
    }
  }

  //call the functions on app load
  useEffect(() => {
    fetchTextFile();
    readyGame();
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

    //submit the word (This change colorGrid, triggering our useEffect to update local storage.)
    submitWord(word_entered)
  }

  function submitWord(word_entered) {
    let new_colors = ["dark", "dark", "dark", "dark", "dark"];  //this holds Tile colors for the current row
    let taken = [];                                             //this holds indices of 'taken' letters
    let temp_word = correctWord;

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
        if (getColorFromKey(word_entered[i]) == "gray") {
          replaceKeyColor(word_entered[i], "yellow");   //replace the color of the Keyboard key
        }
      }
      else {
        //tile must be dark, make keyboard key dark, if it's not already green or yellow
        if (getColorFromKey(word_entered[i]) == "gray") {
          replaceKeyColor(word_entered[i], "dark");   //replace the color of the Keyboard key
        }
      }
    }

    //set flag so this will be saved to LS
    setPrevent(false)

    //update the board (tile colors)
    const newColorGrid = to2dDeepCopy(colorGrid)
    newColorGrid[currAttempt.attempt] = [...new_colors];
    setColorGrid(newColorGrid);

    currAttempt.attempt += 1;               //advance to next row
    currAttempt.letterPos = 0;              //go back to left position
    setCurrAttempt({ ...currAttempt })      // update state

    //check for end of game
    const data = safelyReadPlayerData()
    if (word_entered === correctWord) {
      setWin((prev) => true);
      setGameOver(true);
    }
    else if (currAttempt.attempt === 6) {
      setWin(false);
      setGameOver(true);
    }
  }

  //Save data to local storage each time a word is submitted.
  //Each time a word is submitted, the colorGrid gets updated, triggering this useEffect.
  useEffect(() => {
    //just exit if the app is still loading or if this is triggered by LS
    if (currAttempt.attempt == 0 || prevent) return;

    //build the word and add it to LS
    const word_with_commas = board[currAttempt.attempt-1]
    const word_entered = word_with_commas.join("")
    addWordToLS(word_entered)

    //add the individual letters and colors to LS
    for (let i = 0; i < 5; i++) {
      addLetterToLS(word_entered[i])
      addColorToLS(colorGrid[currAttempt.attempt - 1][i])
    }
  }, [colorGrid]);

  //update win and gameover
  useEffect(() => {
    const data = safelyReadPlayerData()
    data.over = gameOver
    data.win = win
    savePlayerData(data)
  }, [gameOver]);

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
          {showInfo ? <InfoScreen /> : (gameOver ? <><Board /><WinScreen /></> : <><Board /><Keyboard /></>)}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
