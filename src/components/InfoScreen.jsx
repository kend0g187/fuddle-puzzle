import React from 'react'

function InfoScreen() {
  return (
    <div className='game-instructions'>
      <ul>
        <li>Guess the 5-letter word.</li>
        <li>Words that only work as 3 or 4-letter words + an ending, such as FOXES or VOTED, are excluded.</li>
        <li>Esoteric words, slang words, and proper nouns are excluded.</li>
        <li>For the complete word list, click <a href="/all_word_list.txt" target='_blank'>here</a>.</li>
        <li>The letter tiles will change color after you submit each guess.</li>
        <ul>
          <li>Green tiles indicate that the letter is correct.</li>
          <li>Yellow tiles indicate that the letter is in the word, but in a different position.</li>
          <li>Gray tiles indicate that the letter is not in the word.</li>
        </ul>
        <li>The answer will change every day. Answers will not repeat within a calendar year. If you enter a word that has previously been used, a warning will appear and you will have the option to submit that word or not. The word list will reset on January 1st of each year.</li>
      </ul>
    </div>
  )
}

export default InfoScreen