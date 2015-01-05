var board;
var page;
var sol = [];
var game = [];

$(document).ready(function(){
	page = $('#page');
	setup();
});

function setup() {
	page.append('<h1>WELCOME TO LASERS</h1><h4>Please Choose A Difficulty:</h4><div class="buttons"><div id="1" class="button">Easy</div><div id="2" class="button">Medium</div><div id="3" class="button">Hard</div></div>');
	
	$('#1').click(function(){newGame(this.getAttribute('id'));});
	$('#2').click(function(){newGame(this.getAttribute('id'));});
	$('#3').click(function(){newGame(this.getAttribute('id'));});
}

function newGame(difficulty) {
	switch(difficulty){
		case '1':
			makeBoard(5);
			break;
		case '2':
			makeBoard(7);
			break;
		case '3':
			makeBoard(10);
			break;
	}
}

function makeBoard(size) {
	for(var i = 0; i < size+2; i++){
		sol[i] = [];
		game[i] = [];
		for(var j = 0; j < size+2; j++){
			if(!((i==0 && j==0)||(i==0 && j==size+1)||(i==size+1 && j==0)||(i==size+1 && j==size+1))){
				sol[i][j] = '+';
				game[i][j] = '+';
			}
		}
	}
	
	placeMirrors(size);
	
	page.empty();
	page.append('<h1>Good Luck!</h1>');
	page.append('<div id="board"></div>');
	
	board = $('#board');
	board.css("width", (size+2)*30);
	board.css("height", (size+2)*30);
	
	for (var i = 0; i < size+2; i++) {
		for (var j = 0; j < size+2; j++){
			if((i==0 && (j==0 || j==size+1)) || (i==size+1 && (j==0 || j==size+1)))
				board.append('<div id="'+i+'-'+j+'" class="corner"></div>');
			else if(i==0 || i==size+1 || j==0 || j==size+1)
				board.append('<div id="'+i+'-'+j+'" class="end">'+game[i][j]+'</div>');
			else{
				board.append('<div id="'+i+'-'+j+'" class="piece">'+game[i][j]+'</div>');
				$('#'+i+'-'+j).click(function(){toggle(this, size);});
			}
		}
	}
	
	page.append("<div id='newGame' class='button'>New Game</div><div id='clear' class='button'>Clear</div><div id='solve' class='button'>Solve</div>");
	$('#newGame').click(function(){
		page.empty();
		setup();
	});
	$('#clear').click(function(){clear(size);});
	$('#solve').click(function(){showSolution(size);});
	
	update(size);
}

function placeMirrors(size){
	var count = 0;
	
	while(count < size*3/2){
		var i = Math.floor(Math.random() * size + 1);
		var j = Math.floor(Math.random() * size + 1);
		if(sol[i][j] == '+'){
			count++;
			sol[i][j] = Math.floor(Math.random() * 2) == 0 ? "/" : "\\" ;
		}
	}
	
	var characters = size*2;
	
	for(var i = 0; i < size+2; i+=size+1)
		for(var j = 1; j < size+1; j++)
			if(game[i][j] == "+")
				traverse(size, i, j, String.fromCharCode(97+(2*size-(characters--))), 1);
	
	for(var i = 1; i < size+1; i++)
		for(var j = 0; j < size+2; j+=size+1)
			if(game[i][j] == "+")
				traverse(size, i, j, String.fromCharCode(97+(2*size-(characters--))), 1);
}

function traverse(size, i, j, ch, arr){
	var x = i;
	var y = j;
	var truth = false;
	game[i][j] = ch;

	var direction;
	
	if(i == 0)
		direction = 0;
	else if(i == size+1)
		direction = 2;
	else if(j == 0)
		direction = 3;
	else
		direction = 1;

	do{
		switch(direction){
			case 0:
				i++;
				break;
			case 1:
				j--;
				break;
			case 2:
				i--;
				break;
			case 3:
				j++;
				break;
		}
		if(arr == 0){
			if(game[i][j] != '+'){
				if(game[i][j] == '/'){
					if(direction%2==0)
						++direction;
					else
						--direction;
				}
				else{
					if(direction%2==0)
						direction = (direction+3)%4;
					else
						direction = (direction+1)%4;
				}
			}
		}
		else{
			if(sol[i][j] != '+'){
				if(sol[i][j] == '/'){
					if(direction%2==0)
						++direction;
					else
						--direction;
				}
				else{
					if(direction%2==0)
						direction = (direction+3)%4;
					else
						direction = (direction+1)%4;
				}
			}
		}
	}while(i < size+1 && i > 0 && j < size+1 && j > 0);

	if(game[i][j] != '+'){
		if(game[i][j] == game[x][y]){
			game[x][y] = game[x][y].toUpperCase();
			game[i][j] = game[i][j].toUpperCase();
			$('#'+x+'-'+y).addClass("matched");
			$('#'+i+'-'+j).addClass("matched");
			truth = true;
		}
		else{
			game[x][y] = game[x][y].toLowerCase();
			game[i][j] = game[i][j].toLowerCase();
			$('#'+x+'-'+y).removeClass("matched");
			$('#'+i+'-'+j).removeClass("matched");
		}
	}
	else
		game[i][j] = ch;
	
	return truth;
}

function toggle(box, size) {
	var text = box.innerHTML;
	var i = box.getAttribute('id');
	var j;

	if(i.length == 5){
		j = i.slice(3);
		i = i.slice(0,2);
	}
	else if(i.length == 4){
		if(i[1] == '-'){
			j = i.slice(2);
			i = i.slice(0,1);
		}
		else{
			j = i.slice(3);
			i = i.slice(0,2);
		}
	}
	else{
		j = i.slice(2);
		i = i.slice(0,1);
	}

	if(text == "+")
		game[i][j] = "/";
	else if(text == "/")
		game[i][j] = "\\";
	else
		game[i][j] = "+";

	if(update(size)){
		endGame(size);
		setTimeout(function(){$("h1").html("YOU DID IT!");},500);
	}
}

function showSolution(size){
	for(var i = 1; i < size+1; i++)
		for(var j = 1; j < size+1; j++)
			game[i][j] = sol[i][j];

	update(size);
	endGame(size);
	$("h1").html("Better luck next time.");
}

function reflect(size){
	for(var i = 0; i < size+2; i++)
		for(var j = 0; j < size+2; j++)
			$('#'+i+'-'+j).html(game[i][j]);
}

function update(size){
	var truth = true;
	
	for(var i = 0; i < size+2; i+=size+1)
		for(var j = 1; j < size+1; j++)
			if(game[i][j] != "+")
				if(!traverse(size, i, j, game[i][j], 0))
					truth = false;
	
	for(var i = 1; i < size+1; i++)
		for(var j = 0; j < size+2; j+=size+1)
			if(game[i][j] != "+")
				if(!traverse(size, i, j, game[i][j], 0))
					truth = false;

	reflect(size);
	return truth;
}

function endGame(size){
	for(var i = 1; i < size+1; i++){
		for(var j = 1; j < size+1; j++){
			var piece = $('#'+i+'-'+j);
			piece.off();
			piece.removeClass("piece");
			piece.addClass("blocked");
		}
	}
	$('#solve').off();
	$('#clear').off();
}

function clear(size) {
	for(var i = 1; i < size+1; i++)
		for(var j = 1; j < size+1; j++)
			game[i][j] = '+';
	
	update(size);
}