import React, {useContext} from 'react'
import { AppContext } from "../App";

function WinScreen() {
  //import globals
  const {
    currAttempt,
    win,
    correctWord
  } = useContext(AppContext);

  let message = "";
  if (win) message = 'You won! Your score is ' + currAttempt.attempt + '.';
  else message = 'You lost! The word was ' + correctWord + '.';

  return (
    <div className='win-screen'>
      <h2>{message}</h2>
    </div>
  );
}

export default WinScreen;