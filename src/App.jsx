import { useState, useEffect, createContext } from 'react'
import './App.css'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import WinScreen from './components/WinScreen'
import { 
  boardDefault, 
  colorGridDefault, 
  keyColorDefault, 
  removeChar,
  to2dDeepCopy,
  allLetters,
  fetchData
} from './util.js'

//used to store globals
export const AppContext = createContext();

function App() {

  //variables affecting the DOM should use state
  const [correctWord, setCorrectWord] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [wordList, setWordList] = useState([]);
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

  //function to get wordList, correctWord, and usedWords
  async function fetchTextFile() {
    const { words, usedWords, correctWord } = await fetchData()
    setWordList(words)
    setUsedWords(usedWords)
    setCorrectWord(correctWord)
  }

  //call the function on app load
  useEffect(() => {
    fetchTextFile();
  }, []);
  
  useEffect(() => {
    console.log("useEffect wordList:", wordList)
  }, [wordList])
  
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

    //build the word
    let word_entered = "";
    for (let i=0; i<5; i++) {
      word_entered = word_entered + board[currAttempt.attempt][i];
    }

    // log for debugging
    console.log("word_entered:", word_entered)
    console.log("correct_word:", correctWord)
    console.log("wordList:", wordList.slice(100, 125))

    //check if word is in list
    if (!wordList.includes(word_entered.toUpperCase())) {
      alert("Word not in list!");
      return;
    }

    //check if word has been used
    if (usedWords.includes(word_entered.toUpperCase())) {
      alert("That word has been used before.")
    }
      
    
    let new_colors = ["dark", "dark", "dark", "dark", "dark"];  //this holds Tile colors for the current row
    let taken = [];                                             //this holds indices of 'taken' letters
    let temp_word = correctWord;                                //duplicate of the correct word that we can modify
    
    //check for green
    for (let i=0; i<5; i++) {
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
    for (let i=0; i<5; i++) {
      if (taken.includes(i)) continue;  //don't check 'taken' letters
      else if (temp_word.includes(word_entered[i])) {
        const ltr = word_entered[i];
        new_colors[i] = "yellow";                                                                   //update new_colors array
        let letter_index = temp_word.indexOf(ltr)                          //remove the letter from temp_word
        temp_word = temp_word.slice(0, letter_index) + temp_word.slice(letter_index + 1);
        if (getColorFromKey(word_entered[i])=="gray") replaceKeyColor(word_entered[i], "yellow");   //replace the color of the Keyboard key
      }
      else {
        //key must be gray
        if (getColorFromKey(word_entered[i]) == "gray") replaceKeyColor(word_entered[i], "dark");   //replace the color of the Keyboard key
      }
    }

    //update the board
    const newColorGrid = to2dDeepCopy(colorGrid);
    console.log("newColorGrid (before mutation):", newColorGrid)
    //this doesn't work for some reason??
    newColorGrid[currAttempt.attempt] = [...new_colors];
    console.log("newColorGrid (after mutation):", newColorGrid)
    
    /* for (let i=0; i<5; i++) {
      newColorGrid[currAttempt.attempt][i] = new_colors[i];
    } */
    setColorGrid(newColorGrid);
    
    //advance to next row
    currAttempt.attempt += 1;
    currAttempt.letterPos = 0;
    setCurrAttempt({...currAttempt}) // update state

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
