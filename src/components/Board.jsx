import React from "react";
import Tile from "./Tile";

function Board() {
  return (
    <div className="board">
      {" "}
      <div className="row">
        <Tile tilePos={0} attemptVal={0} />
        <Tile tilePos={1} attemptVal={0} />
        <Tile tilePos={2} attemptVal={0} />
        <Tile tilePos={3} attemptVal={0} />
        <Tile tilePos={4} attemptVal={0} />
      </div>
      <div className="row">
        <Tile tilePos={0} attemptVal={1} />
        <Tile tilePos={1} attemptVal={1} />
        <Tile tilePos={2} attemptVal={1} />
        <Tile tilePos={3} attemptVal={1} />
        <Tile tilePos={4} attemptVal={1} />
      </div>
      <div className="row">
        <Tile tilePos={0} attemptVal={2} />
        <Tile tilePos={1} attemptVal={2} />
        <Tile tilePos={2} attemptVal={2} />
        <Tile tilePos={3} attemptVal={2} />
        <Tile tilePos={4} attemptVal={2} />
      </div>
      <div className="row">
        <Tile tilePos={0} attemptVal={3} />
        <Tile tilePos={1} attemptVal={3} />
        <Tile tilePos={2} attemptVal={3} />
        <Tile tilePos={3} attemptVal={3} />
        <Tile tilePos={4} attemptVal={3} />
      </div>
      <div className="row">
        <Tile tilePos={0} attemptVal={4} />
        <Tile tilePos={1} attemptVal={4} />
        <Tile tilePos={2} attemptVal={4} />
        <Tile tilePos={3} attemptVal={4} />
        <Tile tilePos={4} attemptVal={4} />
      </div>
      <div className="row">
        <Tile tilePos={0} attemptVal={5} />
        <Tile tilePos={1} attemptVal={5} />
        <Tile tilePos={2} attemptVal={5} />
        <Tile tilePos={3} attemptVal={5} />
        <Tile tilePos={4} attemptVal={5} />
      </div>
    </div>
  );
}

export default Board;