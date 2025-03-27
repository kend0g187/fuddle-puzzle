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
  const jan1 = new Date(`${year}-01-01`)
  const daysSince = Math.floor((now.getTime() - jan1.getTime())/1000/60/60/24)
  const correctWord = words[daysSince]
  const usedWords = words.slice(0, daysSince)

  return { words, correctWord, usedWords }
}