
//обьект представления, представления и отбражения значений когда делаем ход
var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute ('class','hit');
    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute ('class','miss');
    }
}

//ОБЬЕКТ ПОД ИМЕНЕМ МОДЕЛЬ, модель для хранения данных
// так же получает данные от ОБЬЕКТА ПРЕДСТАВЛЕНИЕ после обработки данных 
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipSunk: 0,
    ships: [
        {locations: [0, 0, 0], hits: ['','','']},
        {locations: [0, 0, 0], hits: ['','','']},
        {locations: [0, 0, 0], hits: ['','','']}
    ],

    fire: function(guess){
        for(i=0; i < this.numShips; i++){
            var ship = this.ships[i];
            // locations = ship.locations;
            // var index = location.indexOf(guess);
            var index = ship.locations.indexOf(guess);
            if (index>=0){
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');

                if(this.isSunk(ship)){
                    view.displayMessage('You sank my battleship!');
                    this.shipSunk++;
                }
                return true;

            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed!');
        return false;
    },    

    isSunk: function(ship) {
        for(i=0; i < this.shipLength; i++){
            if(ship.hits[i] !=='hit'){
                return false;
            }
        }
        return true;
    },

    //
    generateShipLocations: function(){
        var locations;
        for(var i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
            } while (this.collision(locations));

            this.ships[i].locations = locations;

        }
    },

    generateShip: function(){
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        }else{
            row = Math.floor(Math.random()* (this.boardSize-this.shipLength + 1));
            col = Math.floor(Math.random()* this.boardSize);
        }
        

        var newShipLocations = [];
        for(var i=0; i<this.shipLength; i++){
            if(direction === 1){
                newShipLocations.push(row + ''+ (col + i));
            }else{
                newShipLocations.push((row + i)+ '' + col);
            }
        }
        console.log(newShipLocations.push((row + i)+ '' + col));
        console.log('direction ' + direction);
            console.log('row '+row);
            console.log('col '+col);
        return newShipLocations;
        
    },

    collision: function(locations){
        for(var i = 0; i < this.numShips; i++){
            var ship = model.ships[i];
            for(j=0; j<locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};

// ОБЬЕКТ ПОД ИМЕНЕМ КОНТРОЛЛЕР, он обрабатывает координаты выстрела котрый сделал игрок и передает их ОБЬЕКТУ МОДЕЛЬ
// а так же следит за количеством выстрелов, он это запрашивает у МОДЕЛИ, после того как она обновляется
// проверяет завершена игра или нет

var controller = {
    guesses: 0,
    processGuess: function(guess){
        var location = parseGuess(guess);
        if (location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipSunk === model.numShips){
                view.displayMessage('You sank all my battleships, in '+ this.guesses + 'guesses')
            }
        }
    }
}


function parseGuess(guess){
        var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

        if(guess===null || guess.length !== 2){
            alert('Oops, pplease enter a letter and a number on the board!');
        } else{ 
            firstChar = guess.charAt(0);
            var row = alphabet.indexOf(firstChar); // здесь row показывает мне иднекс буквы
            column = guess.charAt(1);

            if(isNaN(row) || isNaN(column)){
                    alert('Oops, that is not on the board!');
            } else if (row < 0 || row >= model.boardSize || column<0 || column >= model.boardSize){
                    alert('Oops, that is not on the board!');
                } else {
                    return row + column;
                }   
        }
    return null;
}



function handleFireButton (){
    var guessInput = document.getElementById('guessInput');
    guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';
};

function handleKeyPress(e){
    var fireButton = document.getElementById('fireButton');
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;

function init() {
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
    //console.log(model.generateShipLocations());

}
