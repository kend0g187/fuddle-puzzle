import React, { useContext } from "react";
import { AppContext } from "../App";

function Key({ keyVal, bigKey, color }) {

  //import globals
  const {
    handleInput
  } = useContext(AppContext);
  
  return (
    <div className="key" id={bigKey ? "big" : color} onClick={() => handleInput(keyVal)}>
      {keyVal}
    </div>
  );
}

export default Key;