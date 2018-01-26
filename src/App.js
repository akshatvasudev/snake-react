import React, { Component } from 'react';
import './App.css';
import Grid from './components/Grid';

class App extends Component {
    constructor(props) {
        super(props);
        this.moveSnake = this.moveSnake.bind(this);
        this.gridSize = props.gridSize || 20;

        //Mapping direction to numbers.
        this.DIRECTION = {
            'UP': 1,
            'DOWN': -1,
            'RIGHT': 2,
            'LEFT': -2
        }
        // Initial State.  Snake starts at 10,10 with length 3, and 1 food item at 15,10, not colliding with anything and no direction.
        this.state = {
            snake: [
                { x: 10, y: 10 },
                { x: 10, y: 11 },
                { x: 10, y: 12 }
            ],
            food: { x: 15, y: 10 },
            collusion: false,
            direction: null
        }
    }

    componentDidMount() {
        //Set initial direction to UP.
        this.setState({ direction: this.DIRECTION.UP });
        this.moveSnake();
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 38) { //UP
                //If the snake is not already moving up or down, change direction on keypress.
                if (this.state.direction !== this.DIRECTION.UP &&
                    this.state.direction !== this.DIRECTION.DOWN)
                    this.setState({ direction: this.DIRECTION.UP });
            }
            if (e.keyCode === 39) { //RIGHT
                //If the snake is not already moving right or left, change direction on keypress.
                if (this.state.direction !== this.DIRECTION.LEFT &&
                    this.state.direction !== this.DIRECTION.RIGHT)
                    this.setState({ direction: this.DIRECTION.RIGHT });
            }
            if (e.keyCode === 40) { //DOWN
                if (this.state.direction !== this.DIRECTION.UP &&
                    this.state.direction !== this.DIRECTION.DOWN)
                    this.setState({ direction: this.DIRECTION.DOWN });
            }
            if (e.keyCode === 37) { //LEFT
                if (this.state.direction !== this.DIRECTION.LEFT &&
                    this.state.direction !== this.DIRECTION.RIGHT)
                    this.setState({ direction: this.DIRECTION.LEFT });
            }
        })
    }
    //Get snake's head  i.e. first object of the array.  This us used to check for collusions.
    getSnakeHead() {
        return this.state.snake[0];
    }

    //Get snakes tail i.e. last object of the array.  This is used to append to the snake when it eats a food item.
    getSnakeTail() {
        return this.state.snake[this.state.snake.length - 1];
    }

    //Self calling function that movies the snake forward in the given direction, if there's no collusion. Also checks to see if snake has collided with food.
    moveSnake() {
        this.hasCollusion();
        if (this.state.collusion) return false;
        let _snake = this.state.snake;
        if (this.state.direction === this.DIRECTION.UP) {
            this.goUp(_snake);
        }
        if (this.state.direction === this.DIRECTION.DOWN) {
            this.goDown(_snake);
        }
        if (this.state.direction === this.DIRECTION.RIGHT) {
            this.goRight(_snake);
        }
        if (this.state.direction === this.DIRECTION.LEFT) {
            this.goLeft(_snake);
        }
        this.foodCollusion();

        setTimeout(this.moveSnake, 100);
    }

    //Helper function to check if snake's head is colliding with the edges of the grid or it's own body.
    //Edge case:  When the snake hits the wall, it moves by 1 more before the collusion happens, instead of stopping there.  That logic is not handled here.
    hasCollusion() {
        let _snakeHead = this.getSnakeHead();
        let _selfCollusion = this.state.snake.filter((s, i) => {
            if (i === 0) return false;
            if (s.x === _snakeHead.x && s.y === _snakeHead.y) { return true; }
            return false;
        });
        if (_snakeHead.y < 0 || _snakeHead.y === this.gridSize || _snakeHead.x < 0 || _snakeHead.x === this.gridSize) this.setState({ collusion: true });
        if (_selfCollusion.length > 0) {
            this.setState({ collusion: true });
        }
    }

    //Helper function to check if snake has reached a food location.  
    //If it has, a new 'snakeBit' is added (according to which direction the snake is travelling) which increases the snakes length by 1
    foodCollusion() {
        let _snakeHead = this.getSnakeHead();
        if (this.state.food.x === _snakeHead.x && this.state.food.y === _snakeHead.y) {
            this.createNewFood();
            let addSnakeBit = [];
            let _snakeTail = this.getSnakeTail();
            if (this.state.direction === this.DIRECTION.UP) {
                addSnakeBit = { x: _snakeTail.x, y: _snakeTail.y + 1 };
            }
            if (this.state.direction === this.DIRECTION.DOWN) {
                addSnakeBit = { x: _snakeTail.x, y: _snakeTail.y - 1 };
            }
            if (this.state.direction === this.DIRECTION.RIGHT) {
                addSnakeBit = { x: _snakeTail.x - 1, y: _snakeTail.y };
            }
            if (this.state.direction === this.DIRECTION.LEFT) {
                addSnakeBit = { x: _snakeTail.x + 1, y: _snakeTail.y };
            }
            this.setState({ snake: [...this.state.snake, addSnakeBit] })
        }
    }

    //Create new food item at a random location on the grid.
    //(If I had more time, I would have added logic to make sure the food item doesn't get added anywhere on the snake's body)
    createNewFood() {
        this.setState({ food: { x: this.getRandomCoordinate(), y: this.getRandomCoordinate() } })
    }

    //Helper function to get random number between 0 and grid's size.
    getRandomCoordinate() {
        return Math.floor(Math.random() * Math.floor(this.gridSize));
    }

    //Helper functions to update the direction of the snake.
    goUp(snake) {
        this.updateDirection(snake, { x: snake[0].x, y: snake[0].y - 1 }, this.DIRECTION.UP)
    }
    goDown(snake) {
        this.updateDirection(snake, { x: snake[0].x, y: snake[0].y + 1 }, this.DIRECTION.DOWN)
    }
    goLeft(snake) {
        this.updateDirection(snake, { x: snake[0].x - 1, y: snake[0].y }, this.DIRECTION.LEFT)
    }
    goRight(snake) {
        this.updateDirection(snake, { x: snake[0].x + 1, y: snake[0].y }, this.DIRECTION.RIGHT)
    }
    updateDirection(snake, newSnakeBit, direction) {
        snake.pop();
        this.setState({
            snake: [
                newSnakeBit, ...snake
            ],
            direction: direction
        });
    }

    //Reacts render function to display the Grid.
    render() {
        return ( < Grid len = { this.gridSize } snake = { this.state.snake } food = { this.state.food } collusion = { this.state.collusion }
            />
        );
    }
}

export default App;