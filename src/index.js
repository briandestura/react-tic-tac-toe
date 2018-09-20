import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     render() {
//       return (
//         <button
//           className="square"
//           onClick={() => this.props.onClick()}
//         >
//           {this.props.value}
//         </button>
//       );
//     }
// }

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Board extends React.Component {

  // constructor(props){
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   }
  // }

  // handleClick(i){
  //   if (calculateWinner(this.state.squares) || this.state.squares[i]){
  //     return;
  //   }
  //   const squares = this.state.squares.slice();
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({squares: squares, xIsNext: !this.state.xIsNext,});
  // }

  // renderSquare(i) {
  //   return <Square 
  //     value={this.state.squares[i]}
  //     onClick={() => this.handleClick(i)}
  //   />;
  // }

  renderSquare(i) {
    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    // const winner = calculateWinner(this.state.squares);
    // let status
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else if(this.state.squares.every((i) => i !== null)) {
    //   status = 'Draw!';
    // } else {
    //   status = 'Next player: ' +  (this.state.xIsNext ? 'X' : 'O');
    // }

    let rows = [];
    let num = 0;
    for (let x = 0; x < 3; x++) {
      let row_items = []
      for (let y = 0; y < 3; y++) {
        row_items.push(this.renderSquare(num));
        num++;
      }
      rows.push(<div className="board-row">{row_items}</div>);
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i){

    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status
    if (winner) {
      status = 'Winner: ' + winner;
    } else if(current.squares.every((i) => i !== null)) {
      status = 'Draw!';
    } else {
      status = 'Next player: ' +  (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
