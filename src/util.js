const lc = "abcdefghijklmnopqrstuvwxyz";
const uc = lc.toUpperCase();
export const allLetters = lc+uc;

//static globals can be declared outside of component functions
export const boardDefault = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

export const colorGridDefault = [
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
  ["false", "false", "false", "false", "false"],
];

export const keyColorDefault = [
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

//function to remove a character from a string
export function removeChar( index, the_string ) {
  let new_str = "";
  for (let i=0; i<the_string.length; i++) {
    if (i === index) new_str = new_str.concat("_");
    else new_str = new_str.concat(the_string[i]);
  }
  return new_str;
}

//creates a 'deep' copy of the board array so previous rows don't return to blank
export function to2dDeepCopy(arr) {
  const copy = [...arr]
  copy.forEach((row, i) => {
    copy[i] = [...row]
  })
  return copy
}

export async function fetchData() {
  const now = new Date()
  const year = now.getFullYear()
  const wordListURL = `/word_list_${year}.txt`

  // fetch list
  const res = await fetch(wordListURL)
  if (!res.ok) throw new Error(`Could not fetch word list at "${wordListURL}". Are you sure there is a word list for this year?`);
  const text = await res.text()
  const words = text.split('\n').map(w => w.trim()) // split by new line, and remove extra space on each word

  // get number of days since Jan 1 and generate used words list
  const daysSince = daysSinceJan1()
  const correctWord = words[daysSince]
  const usedWords = words.slice(0, daysSince)

  return { words, correctWord, usedWords }
}

export function savePlayerData(data = {}) {
  localStorage.setItem('fuddle-puzzle-data', JSON.stringify({
    date: data.date || todayString(),
    guessedWords: data.guessedWords || [],
    over: data.over || false,
    win: data.win || false,
    letters: data.letters || [],
    colors: data.colors || []
  }))
}

export function defaultPlayerData() {
  return {
    date: todayString(),
    guessedWords: [],
    over: false,
    win: true,
    letters: [],
    colors: []
  }
}

export function resetLSData() {
  localStorage.setItem('fuddle-puzzle-data', JSON.stringify(defaultPlayerData()))
}

export function safelyReadPlayerData() {
  try {
    const data = JSON.parse(localStorage.getItem('fuddle-puzzle-data'))
    if (typeof data !== 'object' || Array.isArray(data) || data === null)
      return defaultPlayerData()
    return data;
  } catch (error) {
    console.error(error)
    console.warn("Failed reading JSON, using default data.")
    return defaultPlayerData()
  }
}

export function addWordToLS(word) {
  const data = safelyReadPlayerData()
  data.guessedWords.push(word)
  savePlayerData(data)
}

export function addLetterToLS(letter) {
  const data = safelyReadPlayerData()
  data.letters.push(letter)
  savePlayerData(data)
}

export function addColorToLS(color) {
  const data = safelyReadPlayerData()
  data.colors.push(color)
  savePlayerData(data)
}

export function todayString() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;  // The month index starts from 0
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function daysInFeb() {
  const now = new Date()
  const yearString = now.getFullYear()
  if (+yearString % 4 == 0)
    return 29;
  return 28;
}

function daysSinceJan1() {
  const daysInMonths = [31, daysInFeb(), 31, 30, 31, 30, 31, 31, 30, 31, 30]
  const now = new Date()
  const monthNum = +(now.getMonth())
  const dateNum = +(now.getDate())
  let numDays = 0
  for (let i=0; i<monthNum; i++) {  //add up all the days of past months
    numDays += daysInMonths[i]
  }
  numDays += dateNum                //add number of days in current month (so far)
  return --numDays                  //subtract 1 since Jan 1 should return 0
}