import React, { useContext } from "react";
import { AppContext } from "../App";

function Key({ icon, iconAlt, keyVal, bigKey, color }) {

  //import globals
  const {
    handleInput
  } = useContext(AppContext);
  
  return (
    <div className={`key ${bigKey ? "big" : color}`} onClick={() => handleInput(keyVal)}>
      {icon ? (
        <img src={icon} alt={iconAlt} />
      ): keyVal}
    </div>
  );
}

export default Key;