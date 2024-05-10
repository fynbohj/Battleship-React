import { useState } from 'react';

// variables to track moves, used for game info
let moveInfo = new Array(10);
let moveCount = 0;
moveInfo[0] = 'You are at move #1';

// variables to track the ships
let ships = [3]; //ship array
let shipCount = ships.length;
let size = 3;

// list of possible ship lines
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || shipCount === 0) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = hitOrMiss(i);

    // create the string for move, used in game info
    let temp = "";
    if (hitOrMiss(i) === "X"){
      temp = "Hit, Row: " + parseInt((i / size) + 1) + ", Column: " + ((i % size) + 1);
    }
    if (hitOrMiss(i) === "O"){
      temp = "Miss, Row: " + parseInt((i / size) + 1) + ", Column: " + ((i % size) + 1);
    }

    moveInfo[moveCount] = temp;
    moveCount++;

    onPlay(nextSquares);
  }

  // determine if game won and how many ships remaining after each turn
  calculateWinner(squares);
  let status;
  if (shipCount === 0){
    status = "Game won in " + (moveCount) + " turns";
  } else {
    if (shipCount === 1){
      status = "There is 1 ship remaining";
    } else {
      status = "There are " + shipCount + " ships remaining";
    }

  }

  // generate the board
  const row = [];
  let num = size;
  for (let i = 0; i < num; i++) {
    let temp = [];
    for (let j = 0; j < num; j++) {
      temp[j] = <Square value={squares[j + (i * num)]}
        onSquareClick={() => handleClick(j + (i * num))} />
    }
    row[i] = temp;
  }

  // 3x3
  if (size === 3){
    return (
      <>
        <div className="status">{status}</div>
        <div className="board-row">
          {row[0]}
        </div>
        <div className="board-row">
          {row[1]}
        </div>
        <div className="board-row">
          {row[2]}
        </div>
      </>
    );
  }

  // 4x4
  if (size === 4){
    return (
      <>
        <div className="status">{status}</div>
        <div className="board-row">
          {row[0]}
        </div>
        <div className="board-row">
          {row[1]}
        </div>
        <div className="board-row">
          {row[2]}
        </div>
        <div className="board-row">
          {row[3]}
        </div>
      </>
    );
  }

  // 5x5
  if (size === 5){
    return (
      <>
        <div className="status">{status}</div>
        <div className="board-row">
          {row[0]}
        </div>
        <div className="board-row">
          {row[1]}
        </div>
        <div className="board-row">
          {row[2]}
        </div>
        <div className="board-row">
          {row[3]}
        </div>
        <div className="board-row">
          {row[4]}
        </div>
      </>
    );
  }

}

export default function Game() {
  const [history, setHistory] = useState([Array(size*size).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [order, setOrder] = useState(0); // used to reverse order of list in game info
  const [dummy, setDummy] = useState(0); // used to update size variable

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    moveInfo[currentMove + 1] = moveNumber;
  }

  // Used to change the size of the board
  function changeSize() {
    if (size === 5){
      size = 3;
    }
    else{
      size++;
    }
    // empty lines
    while (lines.length > 0){
      lines.pop();
    }
    // changes lines to contain all the possible ships for new board size
    for (let j = 0; j < size-2; j++){
      for (let i = 0; i < size; i++){
        lines.push([j+(i*size),j+1+(i*size),j+2+(i*size)]);
        lines.push([i+(j*size),i+(j*size)+(size),i+(j*size)+(size*2)]);
      }
    }
    generateShips();
    shipCount = ships.length;
    setDummy(size);
  }

  // keeps track of the moves, used for the game info
  const moves = history.map((squares, move) => {
    return (
      <div>
        <li key={move}>
          {" " + moveInfo[move]}
        </li>
      </div>
    );
  });

  let moveNumber;
      moveNumber = 'You are at move #' + (currentMove + 2);
  // check if list should be reversed
  if (order === 1){
    moves.reverse();
  }

  // display everything
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <div className="space">&#0;</div>
        <button onClick=
          {() => {if (currentMove === 0){changeSize()}}}>
          {"Change size of board"}
        </button>
      </div>
      <div className="game-info">
        <ol>
          <button onClick=
            {() => {if (order === 0) {setOrder(1)} else{setOrder(0)}}}>
            {"Reverse Order of List"}
          </button>
          {moves}
        </ol>
      </div>
    </div>
  );
}

// generate ships for the board, 1 ship for 3x3, 2 ships for 4x4, 3 ships for 5x5
function generateShips() {
  while (true){
    // empty the old list of ships
    while (ships.length > 0){
      ships.pop();
    }
    // generate ships, makes sure there are no overlaps with the ships generated
    for (let i = 2; i < size; i++){
      ships.push(Math.floor(Math.random() * (lines.length - 1)));
    }
    // 3x3
    if (ships.length === 1){
    break;
    }
    // 4x4
    const [a, b, c] = lines[ships[0]];
    if (ships.length === 2){
      if (!lines[ships[1]].includes(a) && !lines[ships[1]].includes(b)
        && !lines[ships[1]].includes(c)){
          break;
        }
    }
    // 5x5
    const [d, e, f] = lines[ships[1]];
    if (ships.length === 3){
      if (!lines[ships[1]].includes(a) && !lines[ships[1]].includes(b)
        && !lines[ships[1]].includes(c) && !lines[ships[2]].includes(a)
        && !lines[ships[2]].includes(b) && !lines[ships[2]].includes(c)
        && !lines[ships[2]].includes(d) && !lines[ships[2]].includes(e)
        && !lines[ships[2]].includes(f)){
          break;
        }
    }
  }
}

function calculateWinner(squares) {
  for (let i = 0; i < ships.length; i++) {
    const [a, b, c] = lines[ships[i]];
    if (squares[a] === "X" && squares[a] === squares[b] && squares[a] === squares[c]) {
      ships.splice(ships.indexOf(ships[i]),1);
      shipCount--;
      if (shipCount === 0){
        return squares[a];
      }
    }
  }
  return null;
}

// determines a hit "X" or a miss "O"
function hitOrMiss(shot) {
  for (let j = 0; j < ships.length; j++){
    let temp = lines[ships[j]];
    for (let i = 0; i < size; i++){
      if (temp[i] === shot){
        return "X";
      }
    }
  }
  return "O";
}
