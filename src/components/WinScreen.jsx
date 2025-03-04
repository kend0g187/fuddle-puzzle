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
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default WinScreen;