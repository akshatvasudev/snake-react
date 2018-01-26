/* 
This class represents the Grid on which the game is played.
*/
import React from 'react';
import Cell from './Cell'
let Grid = ({len, snake, food, collusion}) => {
	let _grid = [];
	if(collusion)_grid.push(<div key={-1} className='gameOver'>game over</div>)
		//Render Grid with regular cells, food particle and snake's body.
	for(let y=0;y < len;y++){
		for(let x=0;x < len;x++){
			let _type = 0;
			//Check to see if this cell is a food particle.
			if(food.x === x && food.y === y)_type = 2;

			//Check to see if this cell is part of the snakes body.
			let _isPartOfSnake = snake.filter((body_bit) => {
				return (body_bit.x === x && body_bit.y === y);
			});

			//This cell is part of the snake's body.
			if(_isPartOfSnake.length > 0) {_type = 1;}
			_grid.push(<Cell key={`${x},${y}`} type={_type} x={x}/>);
		}
	}
	_grid.push(<div key={-2} className='clear'></div>);

	return _grid;
 }
  export default Grid;