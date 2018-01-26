/*
This class represents one grid cell.  The Cell can be a regular cell, food cell or a snakes body cell.
*/
import React from 'react';
let Cell = ({type, x}) => {
 	let style = {};
 	style.background = type === 0?'#000':type === 1?'#2cb333':type === 2?'#ff0000':'#000';
 	style.clear = x === 0? 'both':'';
 	return (<span style={style}></span>)
 }

  export default Cell;