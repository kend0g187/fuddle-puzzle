import React, { useEffect, useContext } from 'react'
import { AppContext } from "../App";
import Key from './Key';

function Keyboard() {
  const keys1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keys2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keys3 = ["Z", "X", "C", "V", "B", "N", "M"];

  //import globals
  const {
    eventToString,
    getColorFromKey
  } = useContext(AppContext);

  //handle when user types something (This is now working!)
  useEffect(() => {
    document.addEventListener("keydown", eventToString);
    return () => {  // <- on destroy
      document.removeEventListener("keydown", eventToString);
    };
  });

  return (
    <div className="keyboard" onKeyDown={eventToString}>
      <div className="line1">
        {keys1.map((key) => {
          return <Key keyVal={key} color={getColorFromKey(key)} key={key} />;
        })}
      </div>
      <div className="line2">
        {keys2.map((key) => {
          return <Key keyVal={key} color={getColorFromKey(key)} key={key} />;
        })}
      </div>
      <div className="line3">
        <Key icon="return.svg" iconAlt="enter icon" keyVal="ENTER" bigKey />
        {keys3.map((key) => {
          return <Key keyVal={key} color={getColorFromKey(key)} key={key} />;
        })}
        <Key icon="backspace.svg" iconAlt="backspace icon" keyVal="DELETE" bigKey />
      </div>
    </div>
  )
}

export default Keyboard;