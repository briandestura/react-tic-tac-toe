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

  console.log(props.winner);
  let highlight = '';
  if (props.winner) {
    highlight = props.winner ? 'yellow' : '';
  };

  return (
    <button
      className={"square " + highlight}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
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

  renderSquare(i, column, row) {

    let isWinningSquare = ''
    if (this.props.winner){
      let winLocation = this.props.winner[1];
      isWinningSquare = this.props.winner[1].some((val) => val === i);
    }

    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i, column, row)}
      winner={isWinningSquare}
      location={[column, row]}
    />;
  }

  renderRow(row){
    let columns = [0, 1, 2];
    return (
      <div className="board-row">
        { columns.map(column => this.renderSquare((row * 3) + column, column + 1, row + 1)) }
      </div>
    );
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

    // let rows = [];
    // let num = 0;
    // for (let x = 0; x < 3; x++) {
    //   let row_items = []
    //   for (let y = 0; y < 3; y++) {
    //     row_items.push(this.renderSquare(num));
    //     num++;
    //   }
    //   rows.push(<div className="board-row">{row_items}</div>);
    // }

    let rows = [0, 1, 2]
    return (
      <div>
        { rows.map(row => this.renderRow(row)) }
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clicked: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true,
    }
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i, column, row){

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
        clicked: [column, row],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  toggleOrder(){
    this.setState({
      ascendingOrder: !this.state.ascendingOrder,
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

      let bold = (this.state.stepNumber === move ? 'bold' : '');

      let column = null;
      let row = null;
      
      if (step.clicked) {
        column = '>> Location: ' + step.clicked[0] + ' - ';
        row = step.clicked[1];
      }

      return (
        <li key={move}>
          <button class={bold} onClick={() => this.jumpTo(move)}>{desc} {column}{row}</button>
        </li>
      );
    });

    if (!this.state.ascendingOrder){
      moves.sort((a,b) => { return b.key - a.key })
    }

    let status
    if (winner) {
      status = 'Winner: ' + winner[0];
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
            onClick={(i, column, row) => this.handleClick(i, column, row)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
          <button
            onClick={() => this.toggleOrder()}
          >
            Toggle Order
          </button>
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
      return [squares[a], lines[i]];
    }
  }
  return null;
}