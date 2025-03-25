import React, { useContext } from "react";
import { AppContext } from "../App";

function Tile({ tilePos, attemptVal }) {
  const { board, colorGrid } = useContext(AppContext);
  const letter = board[attemptVal][tilePos];
  const letterState = colorGrid[attemptVal][tilePos];

  return (
    <div className={`tile ${letterState}`}>
      {letter}
    </div>
  );
}

export default Tile;