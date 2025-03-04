/*
        function myFunction() {
        
        }

        const myFunction = () => {
        
        }
*/

let today = new Date();
today.getFullYear()
today.getMonth() // 0 indexed
today.getDate()

const fetchTextFile = () => {
    fetch(raw)
        .then((response) => response.text())
        .then((text) => {
        const arrayOfStrings = text.split("\n").map((line) => line.trim());
        setWordList(arrayOfStrings);
        })
        .catch((error) => console.error("Error fetching the text file:", error));
}

const fetchTextFile2 = async () => {
    try {        
        const response = await fetch(raw)
        if (!response.ok) {

        }
        const text = await response.text()
        const arrayOfStrings = text.split("\n").map((line) => line.trim());
        setWordList(arrayOfStrings);
    } catch (error) {
        console.error("Error fetching the text file:", error)
    }
}

const getColors = (letters, correctWord) => {
    let colors = ['transparent', 'transparent', 'transparent', 'transparent', 'transparent']

    let greens = ""

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i]

        // skip this letter (transparent)
        if (!correctWord.includes(letter)) continue;

        if (letter === correctWord[i]) {
            colors[i] = "green"
            greens += letter;
            continue;
        }




    }
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i]

        // skip this letter (transparent)
        if (!correctWord.includes(letter)) continue;

        if (letter === correctWord[i]) {
            colors[i] = "green"
            greens += letter;
            continue;
        }




    }

    return colors
}

