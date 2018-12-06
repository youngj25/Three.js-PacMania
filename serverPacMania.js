// Using express: http://expressjs.com/
var express = require('express');

//Webworker
//https://www.youtube.com/watch?v=SfS1xGMg2Qw

// Create the app
var app = express();
// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 9000, listen);
console.log(new Date().toLocaleTimeString());

//Experiment with CPU
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
console.log("Number of CPU = " + numCPUs);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

var playersTable = [];

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    //The Client submitting their Username and IP address to the server to be recognized as a user
	socket.on('IP', function(data) {
		console.log("Received new User information");	
        console.log(data.ip);
        console.log(data.date);
		console.log(data.username);	
			
		playersTable.push(data);
		console.log(playersTable[playersTable.length-1]);
		console.log("Added to table");
		console.log();
	}); 	
	
	//The Client Retrieving the Client's Username from the server
	socket.on('Username', function(data) {
		console.log("Username Request Received");
        console.log(data.ip);
		for(var x=0;x<playersTable.length;x++){
			if(playersTable[x].ip=data.ip){
				console.log(playersTable[x].username);
				data = {username:playersTable[x].username}
				socket.emit('Username', data);
				break;
			}
		}
		console.log("Username Sent.");
		console.log();
    }); 	//42MINS
	
	    
	var gameLevel, BA=0;
	
	//Disconnecting player
    socket.on('disconnect', function() {			
		console.log("Disconnected");	
		console.log();
    });
  }
);

//New Pac-man Server
var PacMania = io.of('/pacMania'), PacSocketList=[];
var ghostsArray = [], pacArray = [], pacItems = [];
var ghostsStatus = "Scatter", ghostsCountDown=200, ghostRandomModeGeneratorNumber =21; //ghostRandomModeGeneratorNumber gets low and make the ghost more aggressive (default is 21)
var mapNodes = [],nodesList, gameRender = null, step=0;
var ghostCreationCountDown = 2, ghostCreationList=[];
var pacGuidedTesting = [], rowSections = [], stepCounter=0;
var pacManiaCountDown = 1, countDownInterval=null;
var pacManiaGameSetting =[], encounterDistance = 0.55;

PacMania.on('connection',function(socket){
	 console.log("Pac-Mania Served has been accessed");
	 console.log("The client's ID:" + socket.id);
	 
	 PacSocketList.push(socket);
	 
	 //Countdown
	 socket.on('Start Countdown', function(data){
		 
		 addPac(socket.id);
		 
		 if(gameRender == null && countDownInterval == null){
			 pacManiaCountDown = 1;
			 countDownInterval = setInterval( CountDown, 1000);
			 console.log("Started the Countdown @ "+(new Date().toLocaleTimeString()));
			 //Presetting the Game Settings 
			 pacManiaGameSetting = [];
			 
			 var gameData ={
				 maze : 1, 
				 typeofGame : "Endless", 
				 fruitsOccurance : "Usual Amount", 
				 //fruitsOccuranceOdds: 35,
				 fruitsOccuranceOdds: 70,
				 typeofFruits : "Even Mix",
				 goodFruitOdds: 33,
				 neutralFruitOdds: 34,
				 badFruitOdds: 33
			 };
			 //Settings for the Game
			 pacManiaGameSetting.push(gameData);
			 //Setting for Player 1
			 //pacManiaGameSetting.push(gameData);
			 //Setting for Player 2
			 //pacManiaGameSetting.push(gameData);
			 //Setting for Player 3
			 //pacManiaGameSetting.push(gameData);
			 //Setting for Player 4
			 //pacManiaGameSetting.push(gameData);			 
			 
			 if(mapNodes.length <= 1)
			 loadNodesMaze1();
		 
			 if(ghostsArray.length < 2){
				 addGhost("Blinky");				 
				 addGhost("Pinky");			 
				 addGhost("Inky");			 
				 addGhost("Clyde");
				 ghostCreationList=[];
				 ghostCreationList.push("Blinky");
				 ghostCreationList.push("Blinky");
				 ghostCreationList.push("Pinky");
				 ghostCreationList.push("Pinky");
				 ghostCreationList.push("Inky");
				 ghostCreationList.push("Inky");
				 ghostCreationList.push("Clyde");
				 ghostCreationList.push("Clyde");
			 }
			
			 //Settings to players 1 temporarily ****
			 //Type of Game			 
			 if(data.typeOfGame == "Endless"){
				 pacManiaGameSetting[0].typeofGame = "Endless";
			 }
			 else if(data.typeOfGame == "Last Man Standing"){
				 pacManiaGameSetting[0].typeofGame = "Last Man Standing";
			 }
			 //Fruit Occurance
			 if(data.fruitOccurance == "No Fruits"){
				 pacManiaGameSetting[0].fruitsOccuranceOdds = 0;
				 pacManiaGameSetting[0].fruitsOccurance = data.fruitOccurance;				 
			 }
			 else if(data.fruitOccurance == "Usual Amount"){
				 pacManiaGameSetting[0].fruitsOccuranceOdds = 40;
				 pacManiaGameSetting[0].fruitsOccurance = data.fruitOccurance;				 
			 }
			 else if(data.fruitOccurance == "More Fruits"){
				 pacManiaGameSetting[0].fruitsOccuranceOdds = 90;
				 pacManiaGameSetting[0].fruitsOccurance = data.fruitOccurance;				 
			 }
			 //Types of Fruits
			 if(data.typesOfFruits == "More Bad Fruits"){
				 pacManiaGameSetting[0].goodFruitOdds = 5;
				 pacManiaGameSetting[0].neutralFruitOdds = 25;
				 pacManiaGameSetting[0].badFruitOdds = 70;		
				 pacManiaGameSetting[0].typeofFruits = data.typesOfFruits;		
			 }
			 else if(data.typesOfFruits == "Even Mix"){
				 pacManiaGameSetting[0].goodFruitOdds = 33;
				 pacManiaGameSetting[0].neutralFruitOdds = 34;
				 pacManiaGameSetting[0].badFruitOdds = 33;		
				 pacManiaGameSetting[0].typeofFruits = data.typesOfFruits;		
			 }
			 else if(data.typesOfFruits == "More Good Fruits"){
				 pacManiaGameSetting[0].goodFruitOdds = 70;
				 pacManiaGameSetting[0].neutralFruitOdds = 25;
				 pacManiaGameSetting[0].badFruitOdds = 5;	
				 pacManiaGameSetting[0].typeofFruits = data.typesOfFruits;		
			 }
			 
			 console.log(data);
			 console.log("-------------GameSetting on Server-----------------");
			 console.log(pacManiaGameSetting[0]);
		 }
		 else{
			 console.log("Game already in the process");		 
		 
		 }
	 });
	 
	 //CountDown Pressed, reduce the Count Down by one
	 socket.on('CountDown Pressed', function(data){
		 if(countDownInterval != null && pacManiaCountDown>3 )
			 pacManiaCountDown = Math.floor(pacManiaCountDown - 1);
	 });
	  
	 //Start Game
     socket.on('Initiate Game Render', function(data) {
		 if(gameRender == null){			 
			 console.log("Started the Game State @ "+(new Date().toLocaleTimeString()));
			 console.log("Nodes: "+mapNodes.length);
			 if(mapNodes.length <= 1)
				 loadNodesMaze1();
			 else
				 console.log("Maze 1 already loaded");
			 
			 if(ghostsArray.length < 2){
				 addGhost("Blinky");				 
				 addGhost("Pinky");			 
				 addGhost("Inky");			 
				 addGhost("Clyde");			 
				 //addGhost("Random"); 
				 ghostCreationList=[];
				 ghostCreationList.push("Blinky");
				 ghostCreationList.push("Blinky");
				 ghostCreationList.push("Pinky");
				 ghostCreationList.push("Pinky");
				 ghostCreationList.push("Inky");
				 ghostCreationList.push("Inky");
				 ghostCreationList.push("Clyde");
				 ghostCreationList.push("Clyde");
			 }
			 
			 addPac(socket.id);
			
			 //Add Pellets to the gameboard
			 for(var pelletAdditions = 0; pelletAdditions <15; pelletAdditions++){
				 var first = Math.floor(Math.random()*115);
				 var second = mapNodes[first].Connectednodes[ Math.floor( Math.random()*mapNodes[ first ].Connectednodes.length ) ];
				 
				 addPacItems(first,second);
			 }
			  
			 //gameRender = setInterval( UpdateGameState, 35);
			 gameRender = setInterval( UpdateGameState, 20);
			 stepCounter=0;
		 }
		 else{
			 //console.log("Ended the Game State");
			 //clearInterval(gameRender);
			 //gameRender = null;
			 
			 addPac(socket.id);
		 } 
     });
	  
	 //Update the Game State of a players move
	 socket.on('Move', function(data){
		 if(gameRender != null){
			 var found = false;
			 
			 for(var x = 0; x<pacArray.length && !found; x++)
				 if(pacArray[x].id == socket.id){
					 //console.log("P"+(x+1)+" Direction: "+data.direction);
					 pacArray[x].intendedDirection = data.direction;
					 found = true;
				 }
				 
			 if(!found) console.log("Error occured");
		 }
	 });
	
	 //Countdown
	 function CountDown(){
		 
		 //Broadcast the updated Game State
		 pacManiaCountDown = Math.floor(pacManiaCountDown - 1);
			 
		 //Stop the Count Down
		 if(pacManiaCountDown <= 0){
			 clearInterval(countDownInterval);
			 countDownInterval = null;
			 pacManiaCountDown = 1;
			 console.log("Started the Game State @ "+(new Date().toLocaleTimeString()));
			 //gameRender = setInterval( UpdateGameState, 35);
			 gameRender = setInterval( UpdateGameState, 20);
			 stepCounter=0;
			 
			 //If there's only one player change the Game type to endless
			 if(pacArray.length==1)
				 pacManiaGameSetting[0].typeofGame = "Endless";
			 
			 //Add Pellets to the gameboard-----------------------------
			 fillWithPacItems();
			 //-------------------- Print out the Game Settings
			 console.log("---------------------------------------------------------");
			 console.log(pacManiaGameSetting[0].typeofGame);
			 console.log(pacManiaGameSetting[0].fruitsOccurance);
			 console.log(pacManiaGameSetting[0].typeofFruits);			 
			 PacMania.emit('Setup Board', data={ Maze : 1});	
		 }
		 
	 }
	 
	 //Update the Game State
	 function UpdateGameState(){
		 var pacmanDistanceTravelDivsor = 20;
		 var baseSpeed = 1.6;
		 
		 //Ghost
		 //Loops for Ghosts
		 for(var ghostCount =0; ghostCount<ghostsArray.length;ghostCount++){
			 //Difference in X Axis
			 if(ghostsArray[ghostCount].x < mapNodes[ ghostsArray[ghostCount].nextNode ].x){
				 if(Math.abs(ghostsArray[ghostCount].x - mapNodes[ ghostsArray[ghostCount].nextNode].x)>=(baseSpeed/pacmanDistanceTravelDivsor))
					 ghostsArray[ghostCount].x = (ghostsArray[ghostCount].x*pacmanDistanceTravelDivsor + baseSpeed)/pacmanDistanceTravelDivsor;
				 else
					 ghostsArray[ghostCount].x = mapNodes[ ghostsArray[ghostCount].nextNode].x;
				 ghostsArray[ghostCount].directionPhase += 1;
			 }
			 else if(ghostsArray[ghostCount].x > mapNodes[ ghostsArray[ghostCount].nextNode ].x){
				 if(Math.abs(ghostsArray[ghostCount].x - mapNodes[ ghostsArray[ghostCount].nextNode].x)>=(baseSpeed/pacmanDistanceTravelDivsor))	
					 ghostsArray[ghostCount].x = (ghostsArray[ghostCount].x*pacmanDistanceTravelDivsor - baseSpeed)/pacmanDistanceTravelDivsor;
				 else
					 ghostsArray[ghostCount].x = mapNodes[ ghostsArray[ghostCount].nextNode ].x;
				 ghostsArray[ghostCount].directionPhase += 1;
			 }
			 //Difference in Y Axis
			 else if(ghostsArray[ghostCount].y < mapNodes[ ghostsArray[ghostCount].nextNode ].y){
				  if(Math.abs(ghostsArray[ghostCount].y - mapNodes[ ghostsArray[ghostCount].nextNode].y)>=(baseSpeed/pacmanDistanceTravelDivsor))	
					 ghostsArray[ghostCount].y = (ghostsArray[ghostCount].y*pacmanDistanceTravelDivsor + baseSpeed)/pacmanDistanceTravelDivsor;
				 else
					 ghostsArray[ghostCount].y = mapNodes[ ghostsArray[ghostCount].nextNode ].y;
				 ghostsArray[ghostCount].directionPhase += 1;
			 }
			 else if(ghostsArray[ghostCount].y > mapNodes[ ghostsArray[ghostCount].nextNode ].y){
				 if(Math.abs(ghostsArray[ghostCount].y - mapNodes[ ghostsArray[ghostCount].nextNode].y)>=(baseSpeed/pacmanDistanceTravelDivsor))	
					ghostsArray[ghostCount].y = (ghostsArray[ghostCount].y*pacmanDistanceTravelDivsor - baseSpeed)/pacmanDistanceTravelDivsor;
				 else
					 ghostsArray[ghostCount].y = mapNodes[ ghostsArray[ghostCount].nextNode ].y;
				 ghostsArray[ghostCount].directionPhase += 1;
			 }
			 //If it arrives at the next Node
			 else if(ghostsArray[ghostCount].x == mapNodes[ ghostsArray[ghostCount].nextNode ].x && ghostsArray[ghostCount].y == mapNodes[ ghostsArray[ghostCount].nextNode ].y ){ 
				 // When the ghosts arrives at the nextNode location
				 //For the portals
				 //A117 -> A118
				 if(ghostsArray[ghostCount].nextNode == 117){
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = 117;
					 ghostsArray[ghostCount].nextNode = 118;
					 ghostsArray[ghostCount].x = -4;
					 ghostsArray[ghostCount].y = -7;
					 if(ghostsArray[ghostCount].returnPath.length > 0 )
						 if(ghostsArray[ghostCount].returnPath == 118)
							 ghostsArray[ghostCount].returnPath.shift();
				 }
				 //A118 -> A117
				 else if(ghostsArray[ghostCount].nextNode == 118){
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = 118;
					 ghostsArray[ghostCount].nextNode = 117;
					 ghostsArray[ghostCount].x = 4;
					 ghostsArray[ghostCount].y = 8;
					 if(ghostsArray[ghostCount].returnPath.length > 0 )
						 if(ghostsArray[ghostCount].returnPath == 117)
							 ghostsArray[ghostCount].returnPath.shift();
				 }				 
				 //B119 -> B120
				 else if(ghostsArray[ghostCount].nextNode == 119){
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = 119;
					 ghostsArray[ghostCount].nextNode = 120;
					 ghostsArray[ghostCount].x = 10;
					 ghostsArray[ghostCount].y = -4;
					 if(ghostsArray[ghostCount].returnPath.length > 0 )
						 if(ghostsArray[ghostCount].returnPath == 120)
							 ghostsArray[ghostCount].returnPath.shift();
				 }
				 //B120 -> B119
				 else if(ghostsArray[ghostCount].nextNode == 120){
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = 120;
					 ghostsArray[ghostCount].nextNode = 119;
					 ghostsArray[ghostCount].x = -10;
					 ghostsArray[ghostCount].y = 4;
					 if(ghostsArray[ghostCount].returnPath.length > 0 )
						 if(ghostsArray[ghostCount].returnPath == 119)
							 ghostsArray[ghostCount].returnPath.shift();
				 }
				 
				 //Next Node Selected
				 try{
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = ghostsArray[ghostCount].nextNode;
					 
					 if(ghostsArray[ghostCount].status == "Dead"){
						 // Proceed to the next path
						 ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
						 //Returns to Normal
						 if(ghostsArray[ghostCount].returnPath.length <=0 && ghostsArray[ghostCount].nextNode == 50)
							 ghostsArray[ghostCount].status = null;
						 
					 }
					 else if(ghostsStatus == "Scatter"){
						 if(ghostsArray[ghostCount].returnPath.length > 0 )
							 ghostsArray[ghostCount].returnPath = [];
						 
						 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
					 }
					 else if(ghostsStatus == "Home"){
						 //Now finding the path
						 if(ghostsArray[ghostCount].returnPath.length <= 0 ){
							 //ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
							 //ghostsArray[ghostCount].lastNode = ghostsArray[ghostCount].nextNode;							 
							 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode ,ghostsArray[ghostCount].home)
						 }
							 
						 // if the Array is still empty then that means we are at our goal location so go to a random next location 
						 if(ghostsArray[ghostCount].returnPath.length <= 0 ){
							 //ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
							 //ghostsArray[ghostCount].lastNode = ghostsArray[ghostCount].nextNode;	
							 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
						 }
						else{ // if the Array is not empty then follow the path
							 //ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
							 //ghostsArray[ghostCount].lastNode = ghostsArray[ghostCount].nextNode;	
							 ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
							//ghostsArray[ghostCount].returnPath.shift();	
						 }						 
					 }
					 else if(ghostsStatus == "Chase"){
						 //To solve the issue of the going home error that get stucks at the portal
						 //A117 >> A118
						 if(ghostsArray[ghostCount].nextNode == 117){
							 ghostsArray[ghostCount].direction = 'North';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode = 118;
							 ghostsArray[ghostCount].x = -4;
							 ghostsArray[ghostCount].y = -7;
							 
							 if(ghostsArray[ghostCount].returnPath.length != 0)
								 if(ghostsArray[ghostCount].returnPath[0] == 118)
									 ghostsArray[ghostCount].returnPath.shift();		
						 }
						 //A118 >> A117
						 else if(ghostsArray[ghostCount].nextNode == 118){
							 ghostsArray[ghostCount].direction = 'South';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode = 117;
							 ghostsArray[ghostCount].x = 4;
							 ghostsArray[ghostCount].y = 8;
							 
							 if(ghostsArray[ghostCount].returnPath.length != 0)
								 if(ghostsArray[ghostCount].returnPath[0] == 117)
									 ghostsArray[ghostCount].returnPath.shift();		
						 }
						 //B119 >> A120
						 else if(ghostsArray[ghostCount].nextNode == 119){
							 ghostsArray[ghostCount].direction = 'West';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode = 120;
							 ghostsArray[ghostCount].x = 10;
							 ghostsArray[ghostCount].y = -4;
							 
							 if(ghostsArray[ghostCount].returnPath.length != 0)
								 if(ghostsArray[ghostCount].returnPath[0] == 120)
									 ghostsArray[ghostCount].returnPath.shift();		
						 }
						 //B120 >> A119
						 else if(ghostsArray[ghostCount].nextNode == 120){
							 ghostsArray[ghostCount].direction = 'East';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode = 119;
							 ghostsArray[ghostCount].x = 10;
							 ghostsArray[ghostCount].y = -4;
							 
							 if(ghostsArray[ghostCount].returnPath.length != 0)
								 if(ghostsArray[ghostCount].returnPath[0] == 119)
									 ghostsArray[ghostCount].returnPath.shift();		
						 }
						 //Blinky Chase Style
						 if(ghostsArray[ghostCount].type == "Blinky"){
							 //Finding the Path for Blinky
							 if(ghostsArray[ghostCount].returnPath.length <= 0 )				 
								 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode , pacArray[ghostsArray[ghostCount].targetPlayer].nextNode).splice(0,2);
							 
							 // if the Array is still empty then that means we are at our goal location so go to a random next location 
							 if(ghostsArray[ghostCount].returnPath.length <= 0 )
								 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
							 
							 // if the Array is not empty then follow the path
							 else ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
						 }
						 //Pinky Chase Style
						 else if(ghostsArray[ghostCount].type == "Pinky"){
							 //Finding the Path for Pinky - 3 block radius around target Pac-man section
							 if(ghostsArray[ghostCount].returnPath.length <= 0 ){			
								 var pinkyTargetNode = ghostSectionalSearch(pacArray[ghostsArray[ghostCount].targetPlayer].x, pacArray[ghostsArray[ghostCount].targetPlayer].y, 3);
							 
								 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode , pinkyTargetNode).splice(0,12);
							 }
							 // if the Array is still empty then that means we are at our goal location so go to a random next location 
							 if(ghostsArray[ghostCount].returnPath.length <= 0 )
								 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
							 
							 // if the Array is not empty then follow the path
							 else ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
						 }
						 //Inky Chase Style
						 else if(ghostsArray[ghostCount].type == "Inky"){
							 //Finding the Path for Inky
							 if(ghostsArray[ghostCount].returnPath.length <= 0 ){			
								 var inkyTargetNode = ghostSectionalSearch(pacArray[ghostsArray[ghostCount].targetPlayer].x, pacArray[ghostsArray[ghostCount].targetPlayer].y, 4);
							 
								 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode , inkyTargetNode).splice(0,6);
							 }
							 // if the Array is still empty then that means we are at our goal location so go to a random next location 
							 if(ghostsArray[ghostCount].returnPath.length <= 0 )
								 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
							 
							 // if the Array is not empty then follow the path
							 else ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
						 }
						 //Clyde Chase Style
						 else if(ghostsArray[ghostCount].type == "Clyde"){
							 //Finding the Path for Clyde
							 if(ghostsArray[ghostCount].returnPath.length <= 0 ){			
								 var clydeTargetNode = ghostSectionalSearch(pacArray[ghostsArray[ghostCount].targetPlayer].x, pacArray[ghostsArray[ghostCount].targetPlayer].y, 6);
							 
								 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode , clydeTargetNode).splice(0,18);
							 }
							 // if the Array is still empty then that means we are at our goal location so go to a random next location 
							 if(ghostsArray[ghostCount].returnPath.length <= 0 )
								 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
							 
							 // if the Array is not empty then follow the path
							 else ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();	
						 }
						 //Else Chase Style is defaulted to
						 else{	 
							 //Now finding the path
							 if(ghostsArray[ghostCount].returnPath.length <= 0 )				 
								 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode , pacArray[ghostsArray[ghostCount].targetPlayer].nextNode);
							 
							 
							 // if the Array is still empty then that means we are at our goal location so go to a random next location 
							 if(ghostsArray[ghostCount].returnPath.length <= 0 )
								 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
							 
							 // if the Array is not empty then follow the path
							 else ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
							 
							 
						 }	
					 }
					 
					 //console.log("next node: "+ghostsArray[ghostCount].nextNode+ " x:" +mapNodes[ ghostsArray[ghostCount].nextNode ].x + "  y:"+mapNodes[ ghostsArray[ghostCount].nextNode ].y);
					  
					 //If the direction had change reset the Direction and DirectionPhase
					 if(mapNodes[ ghostsArray[ghostCount].lastNode ].North == ghostsArray[ghostCount].nextNode && ghostsArray[ghostCount].direction != 'North'){
							 ghostsArray[ghostCount].direction = 'North';
							 ghostsArray[ghostCount].directionPhase = 0;
						 }
					 else if(mapNodes[ ghostsArray[ghostCount].lastNode ].East == ghostsArray[ghostCount].nextNode && ghostsArray[ghostCount].direction != 'East'){
							 ghostsArray[ghostCount].direction = 'East';
							 ghostsArray[ghostCount].directionPhase = 0;
						 }
					 else if(mapNodes[ ghostsArray[ghostCount].lastNode ].South == ghostsArray[ghostCount].nextNode && ghostsArray[ghostCount].direction != 'South'){
							 ghostsArray[ghostCount].direction = 'South';
							 ghostsArray[ghostCount].directionPhase = 0;
						 }
					 else if(mapNodes[ ghostsArray[ghostCount].lastNode ].West == ghostsArray[ghostCount].nextNode && ghostsArray[ghostCount].direction != 'West'){
							 ghostsArray[ghostCount].direction = 'West';
							 ghostsArray[ghostCount].directionPhase = 0;
						 }
					 else ghostsArray[ghostCount].directionPhase += 1;
					
				 }
				 catch(e){
					 console.log("Ghost "+ ghostCount+" Status:"+ghostsStatus);
					 console.log("Old Node: "+ghostsArray[ghostCount].oldNode);
					 console.log("Last Node: "+ghostsArray[ghostCount].lastNode);
					 console.log("Next Node: "+ghostsArray[ghostCount].nextNode);
					 console.log(mapNodes[ ghostsArray[ghostCount].nextNode ]);
					 console.log("------------------------------------------");
					  console.log(ghostsArray[ghostCount].returnPath);
					 console.log("------------------------------------------"); 
					 console.log(ghostsArray[ghostCount]);
					 console.log("------------------------------------------");
					 console.log("------------------------------------------");
				 }
			 } 
			 
			 if(ghostsArray[ghostCount].directionPhase % 8 == 0)
				 ghostsArray[ghostCount].directionSprite=  (ghostsArray[ghostCount].directionSprite+1)%2; 
				
		 }
		
		 //PAC-MAN
		 //Loops for PAC-MANS
		 for(var pacCount = 0; pacCount < pacArray.length; pacCount++){
			 
			 //If the Pac-Man is still alive and not pushed back
			 if(pacArray[pacCount].status != "Dead" && pacArray[pacCount].pushBackTime <= 0){
				 //To time out the effects of fruits
				 if(pacArray[pacCount].effectTime != 0){
					 pacArray[pacCount].effectTime--;
					 if(pacArray[pacCount].effectTime <= 0){
						 pacArray[pacCount].effectTime  = 0;
						 pacArray[pacCount].effectTime  = 0;
						 pacArray[pacCount].speed = 1.1;
						 pacArray[pacCount].density = 1;
						 pacArray[pacCount].fruitEffect = null;
						 pacArray[pacCount].status = null;
						 
					 }
				 }
				 
				 
				 //If the intendedDirection is opposite of the current Direction then go back
				 if((pacArray[pacCount].intendedDirection == 'North' && pacArray[pacCount].direction == 'South' && pacArray[pacCount].fruitEffect != "Drunk" && pacArray[pacCount].pushBackTime == 0)||
					(pacArray[pacCount].intendedDirection == 'South' && pacArray[pacCount].direction == 'North' && pacArray[pacCount].fruitEffect != "Drunk" && pacArray[pacCount].pushBackTime == 0)||
					(pacArray[pacCount].intendedDirection == 'East' && pacArray[pacCount].direction == 'West' && pacArray[pacCount].fruitEffect != "Drunk" && pacArray[pacCount].pushBackTime == 0)||
					(pacArray[pacCount].intendedDirection == 'West' && pacArray[pacCount].direction == 'East' && pacArray[pacCount].fruitEffect != "Drunk" && pacArray[pacCount].pushBackTime == 0)
				 ){
					 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
					 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
					 pacArray[pacCount].nextNode = pacArray[pacCount].oldNode;
					 pacArray[pacCount].direction = pacArray[pacCount].intendedDirection;
				 }			 
				 
				 //Difference in X Axis
				 if(pacArray[pacCount].x < mapNodes[ pacArray[pacCount].nextNode ].x){
					 if(Math.abs(pacArray[pacCount].x - mapNodes[ pacArray[pacCount].nextNode].x)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].x = (pacArray[pacCount].x*pacmanDistanceTravelDivsor + baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].x = mapNodes[ pacArray[pacCount].nextNode].x;
					 
					 pacArray[pacCount].directionPhase +=1;					 
				 }
				 else if(pacArray[pacCount].x > mapNodes[ pacArray[pacCount].nextNode ].x){
					 if(Math.abs(pacArray[pacCount].x - mapNodes[ pacArray[pacCount].nextNode].x)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].x = (pacArray[pacCount].x*pacmanDistanceTravelDivsor - baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].x = mapNodes[ pacArray[pacCount].nextNode].x;
					 
					 pacArray[pacCount].directionPhase +=1;
				 }
				 //Difference in Y Axis
				 else if(pacArray[pacCount].y < mapNodes[ pacArray[pacCount].nextNode ].y){
					 if(Math.abs(pacArray[pacCount].y - mapNodes[ pacArray[pacCount].nextNode].y)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].y = (pacArray[pacCount].y*pacmanDistanceTravelDivsor + baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].y = mapNodes[ pacArray[pacCount].nextNode].y;
					 
					 pacArray[pacCount].directionPhase +=1;
				 }
				 else if(pacArray[pacCount].y > mapNodes[ pacArray[pacCount].nextNode ].y){
					 if(Math.abs(pacArray[pacCount].y - mapNodes[ pacArray[pacCount].nextNode].y)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].y = (pacArray[pacCount].y*pacmanDistanceTravelDivsor - baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].y = mapNodes[ pacArray[pacCount].nextNode].y;
					 
					 pacArray[pacCount].directionPhase +=1;
				 }
				 //If it arrives at the next Node
				 else if(pacArray[pacCount].x == mapNodes[ pacArray[pacCount].nextNode ].x && pacArray[pacCount].y == mapNodes[ pacArray[pacCount].nextNode ].y){ 
					 //When the ghosts arrives at the nextNode location
					  
					 //For the portals teleportation
					 //A117 -> A118
					 if(pacArray[pacCount].nextNode == 117){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 118;
						 console.log("Ran 117 >> 118");
						 pacArray[pacCount].x = -4;
						 pacArray[pacCount].y = -7;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 118)
								 pacGuidedTesting.shift();
						 
					 }
					 //A118 -> A117
					 else if(pacArray[pacCount].nextNode == 118 ){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 117;
						 console.log("Ran 118 >> 117");
						 pacArray[pacCount].x = 4;
						 pacArray[pacCount].y = 8;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 117)
								 pacGuidedTesting.shift();
					 }				 
					 //B119 -> B120
					 else if(pacArray[pacCount].nextNode == 119){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 120;
						 console.log("Ran 119 >> 120");
						 pacArray[pacCount].x = 10;
						 pacArray[pacCount].y = -4;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 120)
								 pacGuidedTesting.shift();
					 }
					 //B120 -> B119
					 else if(pacArray[pacCount].nextNode == 120){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 119;
						 console.log("Ran 120 >> 119");
						 pacArray[pacCount].x = -10;
						 pacArray[pacCount].y = 4;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 119)
								 pacGuidedTesting.shift();
					 }
					 
					 
					 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
					 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
					 //When Pac-man is Sober use the IntendedDirection to set the next destination
					 if(pacArray[pacCount].fruitEffect != "Drunk"){
						 //Next Node Selected
						 try{
							 //IntendedDirections
							 if(pacArray[pacCount].intendedDirection == 'North' && mapNodes[ pacArray[pacCount].nextNode ].North != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].North;
								 pacArray[pacCount].direction = 'North';
							 }
							 else if(pacArray[pacCount].intendedDirection == 'East' && mapNodes[ pacArray[pacCount].nextNode ].East != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].East;
								 pacArray[pacCount].direction = 'East';
							 }
							 else if(pacArray[pacCount].intendedDirection == 'South' && mapNodes[ pacArray[pacCount].nextNode ].South != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].South;
								 pacArray[pacCount].direction = 'South';
							 }
							 else if(pacArray[pacCount].intendedDirection == 'West' && mapNodes[ pacArray[pacCount].nextNode ].West != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].West;
								 pacArray[pacCount].direction = 'West';
							 }
							 //Continue Direction
							 else if(pacArray[pacCount].direction == "North" && mapNodes[ pacArray[pacCount].nextNode ].North != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].North;
							 }
							 else if(pacArray[pacCount].direction == "East" && mapNodes[ pacArray[pacCount].nextNode ].East != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].East;
							 }
							 else if(pacArray[pacCount].direction == "South" && mapNodes[ pacArray[pacCount].nextNode ].South != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].South;
							 }
							 else if(pacArray[pacCount].direction == "West" && mapNodes[ pacArray[pacCount].nextNode ].West != -1){
								 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
								 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
								 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].West;
							 }
							 
							 
						 }
						 catch(e){ console.log("pacGuidedTesting: error");  }
					 }
					 //Pac-man is Drunk Randomly Choose his next destination
					 else if(pacArray[pacCount].fruitEffect == "Drunk" ){ 
						 //Random Next Destination
						 while(pacArray[pacCount].lastNode == pacArray[pacCount].nextNode)
							 pacArray[pacCount].nextNode = loadRandomNode(pacArray[pacCount].oldNode, pacArray[pacCount].lastNode);
						 //Adjust the Direction
						 if(mapNodes[ pacArray[pacCount].lastNode ].North == pacArray[pacCount].nextNode )
							 pacArray[pacCount].direction = 'North';
						 else if(mapNodes[ pacArray[pacCount].lastNode ].East == pacArray[pacCount].nextNode )
							 pacArray[pacCount].direction = 'East';
						 else if(mapNodes[ pacArray[pacCount].lastNode ].South == pacArray[pacCount].nextNode )
							 pacArray[pacCount].direction = 'South';
						 else if(mapNodes[ pacArray[pacCount].lastNode ].West == pacArray[pacCount].nextNode )
							 pacArray[pacCount].direction = 'West';
					 }
				
				}
				  
				 //If the direction had change reset the Direction and DirectionPhase
				 if(mapNodes[ pacArray[pacCount].lastNode ].North == pacArray[pacCount].nextNode && pacArray[pacCount].direction != 'North'){
						 pacArray[pacCount].direction = 'North';
						 pacArray[pacCount].directionPhase = 0;
					 }
				 else if(mapNodes[ pacArray[pacCount].lastNode ].East == pacArray[pacCount].nextNode && pacArray[pacCount].direction != 'East'){
						 pacArray[pacCount].direction = 'East';
						 pacArray[pacCount].directionPhase = 0;
					 }
				 else if(mapNodes[ pacArray[pacCount].lastNode ].South == pacArray[pacCount].nextNode && pacArray[pacCount].direction != 'South'){
						 pacArray[pacCount].direction = 'South';
						 pacArray[pacCount].directionPhase = 0;
					 }
				 else if(mapNodes[ pacArray[pacCount].lastNode ].West == pacArray[pacCount].nextNode && pacArray[pacCount].direction != 'West'){
						 pacArray[pacCount].direction = 'West';
						 pacArray[pacCount].directionPhase = 0;
					 }
				 //else pacArray[pacCount].directionPhase += 1;
				  
				 if(pacArray[pacCount].directionPhase % 15 == 0 && pacArray[pacCount].pushBackTime == 0)
					 pacArray[pacCount].directionSprite=  (pacArray[pacCount].directionSprite+1)%2; 
				 
			 }
			 
			 //When a Pac-man is pushed back
		     else if(pacArray[pacCount].status != "Dead" && pacArray[pacCount].pushBackTime >= 1){
				 //To count down the effects of fruits but continue it as long as the pushBack
				 if(pacArray[pacCount].effectTime >= 2)
					 pacArray[pacCount].effectTime--;
				 
				 //Reduce pushBackTime and keep direction Sprite at 1 to have it's mouth open
				 pacArray[pacCount].directionSprite=  1;
				 pacArray[pacCount].pushBackTime--;
				 
				 //Difference in X Axis
				 if(pacArray[pacCount].x < mapNodes[ pacArray[pacCount].nextNode ].x){
					 if(Math.abs(pacArray[pacCount].x - mapNodes[ pacArray[pacCount].nextNode].x)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].x = (pacArray[pacCount].x*pacmanDistanceTravelDivsor + baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].x = mapNodes[ pacArray[pacCount].nextNode].x;
				 }
				 else if(pacArray[pacCount].x > mapNodes[ pacArray[pacCount].nextNode ].x){
					 if(Math.abs(pacArray[pacCount].x - mapNodes[ pacArray[pacCount].nextNode].x)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].x = (pacArray[pacCount].x*pacmanDistanceTravelDivsor - baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].x = mapNodes[ pacArray[pacCount].nextNode].x;
				 }
				 //Difference in Y Axis
				 else if(pacArray[pacCount].y < mapNodes[ pacArray[pacCount].nextNode ].y){
					 if(Math.abs(pacArray[pacCount].y - mapNodes[ pacArray[pacCount].nextNode].y)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].y = (pacArray[pacCount].y*pacmanDistanceTravelDivsor + baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].y = mapNodes[ pacArray[pacCount].nextNode].y;
				 }
				 else if(pacArray[pacCount].y > mapNodes[ pacArray[pacCount].nextNode ].y){
					 if(Math.abs(pacArray[pacCount].y - mapNodes[ pacArray[pacCount].nextNode].y)>(baseSpeed*pacArray[pacCount].speed/pacmanDistanceTravelDivsor))
						 pacArray[pacCount].y = (pacArray[pacCount].y*pacmanDistanceTravelDivsor - baseSpeed*pacArray[pacCount].speed)/pacmanDistanceTravelDivsor;
					  else
						 pacArray[pacCount].y = mapNodes[ pacArray[pacCount].nextNode].y;
				 }
				 //If it arrives at the next Node
				 else if(pacArray[pacCount].x == mapNodes[ pacArray[pacCount].nextNode ].x && pacArray[pacCount].y == mapNodes[ pacArray[pacCount].nextNode ].y){ 
					 //When the ghosts arrives at the nextNode location
					  
					 //For the portals teleportation
					 //A117 -> A118
					 if(pacArray[pacCount].nextNode == 117){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 118;
						 console.log("Ran 117 >> 118");
						 pacArray[pacCount].x = -4;
						 pacArray[pacCount].y = -7;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 118)
								 pacGuidedTesting.shift();
						 
					 }
					 //A118 -> A117
					 else if(pacArray[pacCount].nextNode == 118 ){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 117;
						 console.log("Ran 118 >> 117");
						 pacArray[pacCount].x = 4;
						 pacArray[pacCount].y = 8;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 117)
								 pacGuidedTesting.shift();
					 }				 
					 //B119 -> B120
					 else if(pacArray[pacCount].nextNode == 119){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 120;
						 console.log("Ran 119 >> 120");
						 pacArray[pacCount].x = 10;
						 pacArray[pacCount].y = -4;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 120)
								 pacGuidedTesting.shift();
					 }
					 //B120 -> B119
					 else if(pacArray[pacCount].nextNode == 120){
						 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
						 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
						 pacArray[pacCount].nextNode = 119;
						 console.log("Ran 120 >> 119");
						 pacArray[pacCount].x = -10;
						 pacArray[pacCount].y = 4;
						 
						 if(pacGuidedTesting.length != 0)
							 if(pacGuidedTesting[0] == 119)
								 pacGuidedTesting.shift();
					 }
					  
					 //Next Node Selected
					 try{
						 //Continue Direction and the Directions are reversed!!!
						 //North
						 if(pacArray[pacCount].direction == "South" && mapNodes[ pacArray[pacCount].nextNode ].North != -1){
							 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
							 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
							 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].North;
						 }
						 //East 
						 else if(pacArray[pacCount].direction == "West" && mapNodes[ pacArray[pacCount].nextNode ].East != -1){
							 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
							 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
							 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].East;
						 }
						 //South
						 else if(pacArray[pacCount].direction == "North" && mapNodes[ pacArray[pacCount].nextNode ].South != -1){
							 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
							 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
							 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].South;
						 }
						 //West
						 else if(pacArray[pacCount].direction == "East" && mapNodes[ pacArray[pacCount].nextNode ].West != -1){
							 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
							 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
							 pacArray[pacCount].nextNode = mapNodes[ pacArray[pacCount].nextNode ].West;
						 }
						 //Random Next Location
						 else{
							 pacArray[pacCount].nextNode = loadRandomNode(pacArray[pacCount].oldNode, pacArray[pacCount].lastNode);
							 //Adjust the Direction
							 if(mapNodes[ pacArray[pacCount].lastNode ].North == pacArray[pacCount].nextNode )
								 pacArray[pacCount].direction = 'South';
							 else if(mapNodes[ pacArray[pacCount].lastNode ].East == pacArray[pacCount].nextNode )
								 pacArray[pacCount].direction = 'West';
							 else if(mapNodes[ pacArray[pacCount].lastNode ].South == pacArray[pacCount].nextNode )
								 pacArray[pacCount].direction = 'North';
							 else if(mapNodes[ pacArray[pacCount].lastNode ].West == pacArray[pacCount].nextNode )
								 pacArray[pacCount].direction = 'East';
							 
							 
						 }
						 
					 }
					 catch(e){ console.log("pacGuidedTesting: error");  }
				 }
				 
			 }
			 
			 //Check for Pellets
			 didPacEncounterItem(pacArray[pacCount]);
			 //Check for Ghosts
			 didPacEncounterGhost(pacArray[pacCount]);				 
			 //Check for Pac Collision
			 //didPacEncounterPac(pacArray[pacCount]);
			 
		 }
		 
		 //Broadcast the updated Game State
		 PacMania.emit('Update Game State', data={ GhostList : ghostsArray, PacList : pacArray, Pellet: pacItems	 });
		 
		 ghostStatusUpdate();
		 
		 //Hard Code Set not to replenish items until there's less than 3 items left!!!! lol I might be evil for this but it makes it more fun!!!
		 if(pacItems.length < 3){
			 fillWithPacItems();
			 /**
			 var creationList = [ ];
			 //Add the remaing leftovers into the creationList 
			 for(var x = 0; x< pacItems.length; x++){
				 var leftOvers = {first:pacItems[x].first, second:pacItems[x].second};
				 creationList.push (leftOvers);
			 }
			
			 for(var pelletAdditions = 0; pelletAdditions < (Math.floor( Math.random()*18)+10); pelletAdditions++){
				 var addPellets = true;
				 var first = Math.floor(Math.random()*115);
				 
				 while(first == -1 || first == 31 || first == 35 || first == 91 || first == 84){
					 first = Math.floor(Math.random()*115);
				 }
				 
				 var second = mapNodes[first].Connectednodes[ Math.floor( Math.random()*mapNodes[ first ].Connectednodes.length ) ];
				 
				 var pel = {first:first, second:second};
				 creationList.push (pel);
				 
				 for(var x = 0; creationList != undefined && x < creationList.length-1 && addPellets; x++)
					 if((creationList[x].first == first && creationList[x].second == second) || (creationList[x].first == second && creationList[x].second == first)){
						 addPellets = false;
						 creationList.splice(creationList.length-1,1);
					 }
					
				 if(addPellets)
					 addPacItems(first,second);
				 else
					 pelletAdditions--;
			}
			**/
		 }
	
		 //If Game Over
		 var gameOver = pacArray.length;
		 //Check to see if everyoen is dead
		 for(var x= 0; x<pacArray.length; x++)
			 if(pacArray[x].status != null)
				 if(pacArray[x].status == "Dead")
					 gameOver--;
		 
		 //Reset's the game if everyone is DEAD!!!!
		 if(gameOver <= 0 || (gameOver == 1 && pacManiaGameSetting[0].typeofGame == "Last Man Standing")){
			 //Calculate the game...
			 if(pacArray.length == 2){
				 
				 if(pacArray[0].survivalTime > pacArray[1].survivalTime)
					 pacArray[0].title = "Winner";
				 else
					 pacArray[1].title = "Winner";
			 }
			 else if(pacArray.length > 2){
				 //Find the Player with the HighestScore and grant them the title "Fallen King"
				 var highestScore = pacArray[0].score;
				 var highestScorePlayer = [];
				 highestScorePlayer.push(0);
				 
				 //Going through the list of players find the player with the highest scores
				 for(var x =1; x<pacArray.length; x++){
					 //If this player has a higher score, wipe the playerlist and set the highest score to their score
					 if(highestScore < pacArray[x].score){
						 highestScorePlayer = [];
						 highestScorePlayer.push(x);
						 
						 highestScore = pacArray[x].score;						 
					 }
					 //If this player has an equal score, they'll also recieve the title "Fallen King"
					 else if(highestScore == pacArray[x].score){
						 highestScorePlayer.push(x);						 
					 }
				 }
				 
				 //Setting the Titles for the "Fallen King"
				 for(var x =0; x<highestScorePlayer.length; x++)
					 pacArray[highestScorePlayer[x]].title = "Fallen King";
				 console.log("HighestScore Player");
				 console.log(highestScorePlayer);
				 
				 
				 //Find the Player that survived the longest
				 var longestTime = pacArray[0].survivalTime;
				 var longestTimePlayer = [];
				 longestTimePlayer.push(0);
				 
				 //Player 1 has the longest survivalTime.. because they're still alive
				 if(pacArray[0].survivalTime == null){
					 if(pacArray[0].title != null)
						 pacArray[0].title = "King";
					 else 
						 pacArray[0].title = "Winner";
					 
					 console.log("zero is the surviver");
				 }
				 //Else check the other players
				 else{
					 var longestPlayerTitleSet = false;
					 
					 //Going through the list of players find the player with the longest survivalTime
					 for(var x =1; x<pacArray.length && !longestPlayerTitleSet; x++){
						 //If we find a player that is still alive
						 if(pacArray[x].survivalTime == null){
							 //Sets the Title to "King" or "Winner"
							 if(pacArray[x].title != null)
								 pacArray[x].title = "King";
							 else 
								 pacArray[x].title = "Winner";
							 
							 console.log("null found:"+x);
							 //No need to search anymore
							 longestPlayerTitleSet = true;
						 }
						 //If this player has a higher survivalTime, then set this as the longest
						 else if(longestTime < pacArray[x].survivalTime){
							 longestTimePlayer = [];
							 longestTimePlayer.push(x);
							 console.log("higher found:"+x);
							 highestScore = pacArray[x].score;						 
						 }
						 //If this player has an equal survivalTime then add them to the list
						 else if(longestTime == pacArray[x].survivalTime){
							 console.log("same found:"+x);
							 longestTimePlayer.push(x);						 
						 }
					 }
					 
					 //If the Longest Player title hasn't been set yet
					 //Setting the Titles for the "King" or "Winner"
					 for(var x =0; x<longestTimePlayer.length && !longestPlayerTitleSet; x++)
						 if(pacArray[longestTimePlayer[x]].title != null)
							 pacArray[longestTimePlayer[x]].title = "King";
						 else 
							 pacArray[longestTimePlayer[x]].title = "Winner";
					 
				 }
				 console.log(longestTimePlayer);
			 }
			 
			 
			 
			 PacMania.emit('Game Over', data={PacList : pacArray});
			 resetGame();
		 }
		 stepCounter++;
     }
	 
	 //Add a Ghost
	 function addGhost (ghost) {
		 
		 if(ghost == "Random"){
			 var random = Math.floor(Math.random()*ghostCreationList.length);
			 ghost = ghostCreationList[random];
			 ghostCreationList.splice(random,1);
		 }
			 
		 
		 var g = {
			 //Ghost Object
			 id:11,
			 x : -0,
			 y : 1,
			 lastNode : 122,
			 nextNode : 50,
			 oldNode: -1,
			 targetPlayer: -1,
			 type: ghost,
			 home: 6,
			 returnPath: [],
			 direction:'North',
			 directionPhase:0,
			 directionSprite:0,
			 status : null
		 };
		 
		 if(g.type == "Blinky")  		g.home = 6;
		 else if(g.type == "Pinky")  g.home = 0;
		 else if(g.type == "Inky")	g.home = 116;
		 else if(g.type == "Clyde")	g.home = 110;
		 
		
		 ghostsArray.push (	g	); 
	 }
	 
	 //Add a PAC-MAN
	 function addPac (socket) {
		  
		 var p = {
			 //PAC-MAN Object
			 id:socket,
			 playerID: pacArray.length,
			 x : -8,
			 y : -6,
			 speed: 1.1,
			 density:1,
			 score: 0,
			 lastNode : 89,
			 nextNode : 90,
			 oldNode : -1,
			 direction : 'East',
			 intendedDirection : 'North',
			 directionPhase : 0,
			 directionSprite : 0,
			 status : null,
			 fruitEffect: null,
			 effectTime:0,
			 pushBackTime:0,
			 pushBackNode:null,
			 survivalTime:null,
			 title: null
		 };
		 
		 //Pre-setting Players Locations!!
		 //P1 - Default Properties
		 if(pacArray.length == 1){ //P2
			 p.x = 7;
			 p.y = -6;
			 p.lastNode = 95;
			 p.nextNode = 94;
			 p.oldNode = -1;
			 p.direction = 'West';
			 p.intendedDirection = 'North';
		 }
		 else if(pacArray.length == 2){ //P3
			 p.x = -8;
			 p.y = 6;
			 p.lastNode = 25;
			 p.nextNode = 26;
			 p.oldNode = -1;
			 p.direction = 'East';
			 p.intendedDirection = 'South';			 
		 }
		 if(pacArray.length == 3){ //P4
			 p.x = 9;
			 p.y = 6;
			 p.lastNode = 23;
			 p.nextNode = 22;
			 p.oldNode = -1;
			 p.direction = 'West';
			 p.intendedDirection = 'South';
		 }		 
		 
		 pacArray.push (	p	); 
	 }

	 //Add Pellets(){
	 function addPacItems(firstNode, secondNode){
		 //Spacing Value for the Pellets
		 //How much space between each pellet
		 pelletSpacing = 0.5;
		 var fruitLocation;
		 
		 //Different Y Values
		 if(mapNodes[firstNode ].x == mapNodes[secondNode ].x){
			 fruitLocation = Math.floor(((mapNodes[firstNode ].y-mapNodes[secondNode ].y)/pelletSpacing)/2);
		  
			 if(mapNodes[firstNode ].y > mapNodes[secondNode ].y)
				 pelletSpacing = -pelletSpacing;
			 
			 for(var pNo = 0; pNo <= Math.abs(mapNodes[firstNode ].y-mapNodes[secondNode ].y)/Math.abs(pelletSpacing); pNo++){
			 
				 var p = {
					 //Pellet Object
					 x : mapNodes[firstNode ].x,
					 y : mapNodes[firstNode ].y + pNo*pelletSpacing,
					 worth: 10,
					 type : "Pellet",
					 first: firstNode, 
					 second: secondNode					 
				 };
				 
				 //Fruit Insertion
				 if(fruitLocation == pNo && fruitLocation>=2){
					 var fruitNo = Math.floor(Math.random()*100);
					 //Apple, Banana, Cherry, Orange, Pear, Pretzel, Strawberry,Grapes
					 //Pellets and Super Pellets
					 
					 //fruitsOccurance : "No Fruits",  0% fruitsOccuranceOdds
					 //fruitsOccurance : "Usual Amount", 35%  fruitsOccuranceOdds
					 //fruitsOccurance : "More Fruits",  75%  fruitsOccuranceOdds
					 // p = fruitSelection(p);
					 
					 if(fruitNo <= 5){
						 p.type = "Super Pellet";
						 p.worth = 0;	 
					 }
					 else if(fruitNo <= (5+pacManiaGameSetting[0].fruitsOccuranceOdds))
						 fruitSelection(p);
					 else console.log(fruitNo);
					 //To make room for the fruit we remove the previous and next nodes
					 if(fruitNo <=  (5+pacManiaGameSetting[0].fruitsOccuranceOdds)){
						 pNo++; // Skip next pellet insertion
						 pacItems.splice(pacItems.length-1,1); //Remove Previous Pellet
					 }
					 
				 }
				 
				 pacItems.push(p);
			 }
		 }
		 
		 //Different X Values
		 else if(mapNodes[firstNode ].y == mapNodes[secondNode ].y){
			 fruitLocation = Math.floor(((mapNodes[firstNode ].x-mapNodes[secondNode ].x)/pelletSpacing)/2);
		  
			 if(mapNodes[firstNode ].x > mapNodes[secondNode ].x)
				 pelletSpacing = -pelletSpacing;
			 
			 for(var pNo = 0; pNo <= Math.abs(mapNodes[firstNode ].x-mapNodes[secondNode ].x)/Math.abs(pelletSpacing); pNo++){
			 
				 var p = {
					 //Pellet Object
					 x : mapNodes[firstNode ].x + pNo*pelletSpacing,
					 y : mapNodes[firstNode ].y,
					 worth: 10,
					 type : "Pellet"
				 };
				 
				 //Fruit Insertion
				 if(fruitLocation == pNo && fruitLocation>=2){
					 var fruitNo = Math.floor(Math.random()*100);
					 //Apple, Banana, Cherry, Orange, Pear, Pretzel, Strawberry,Grapes
					 //Pellets and Super Pellets
					 
					 //fruitsOccurance : "No Fruits",  0% fruitsOccuranceOdds
					 //fruitsOccurance : "Usual Amount", 35%  fruitsOccuranceOdds
					 //fruitsOccurance : "More Fruits",  75%  fruitsOccuranceOdds
					 // p = fruitSelection(p);
					 
					 if(fruitNo <= 5){
						 p.type = "Super Pellet";
						 p.worth = 0;	 
					 }
					 else if(fruitNo <= (5+pacManiaGameSetting[0].fruitsOccuranceOdds))
						 fruitSelection(p);
					 else console.log(fruitNo);
					 
					 //To make room for the fruit we remove the previous and next nodes
					 if(fruitNo <=  (10+pacManiaGameSetting[0].fruitsOccuranceOdds)){
						 pNo++; // Skip next pellet insertion
						 pacItems.splice(pacItems.length-1,1); //Remove Previous Pellet
					 }
					 
				 }
				 
				 pacItems.push(p);
			 }
		 }
		 
		 //console.log("Pellets Size:"+pellets.length);
	 }
	  
	 function fillWithPacItems(){
		 var creationList = [ ];
			 //Add the remaing leftovers (if any) into the creationList 
			 for(var x = 0; x< pacItems.length; x++){
				 var leftOvers = {first:pacItems[x].first, second:pacItems[x].second};
				 creationList.push (leftOvers);
			 }
			
			 for(var pelletAdditions = 0; pelletAdditions < (Math.floor( Math.random()*10)+25); pelletAdditions++){
				 var addPellets = true;
				 var first = Math.floor(Math.random()*115), second =-1;
				 
				 while(first == -1 || first == 31 || first == 35 || first == 91 || first == 84){
					 first = Math.floor(Math.random()*115);
				 }
				 
				 while(second == -1 || second == 31 || second == 35 || second == 91 || second == 84)
					 second = mapNodes[first].Connectednodes[ Math.floor( Math.random()*mapNodes[ first ].Connectednodes.length ) ];
				 
				 var pel = {first:first, second:second};
				 creationList.push (pel);
				 
				 for(var x = 0; creationList != undefined && x < creationList.length-1 && addPellets; x++)
					 if((creationList[x].first == first && creationList[x].second == second) || (creationList[x].first == second && creationList[x].second == first)){
						 addPellets = false;
						 creationList.splice(creationList.length-1,1);
					 }
					
				 if(addPellets)
					 addPacItems(first,second);
				 else
					 pelletAdditions--;
			}
		 
	 }
	  
	 //Randomly Select Fruit for Insertion
	 function fruitSelection( fruit ){
		 //Fruits are split into 3 categories
		 //Good - Banana, Pretzel
		 //Neutral - Apple, Cherry, Pear
		 //Bad - Grape, Orange, Strawberry
		 //console.log("Fruity");
		 //Out of a 100% set the ratio you would like for each fruit
		 //Extra bits go to the Netural fruits by default
		 var fruitNo = Math.floor(Math.random()*100);
		 
		 // If its a Good Fruit
		 if(fruitNo < pacManiaGameSetting[0].goodFruitOdds){
			 if(Math.floor(Math.random()*2)>0){ //Banana
				 fruit.type = "Banana";
				 fruit.worth = 10;				 
			 }
			 else{ //Pretzel
				 fruit.type = "Pretzel";
				 fruit.worth = 50;		
			 }
		 }
		 // If its a Neutral Fruit
		 else if(fruitNo < (pacManiaGameSetting[0].goodFruitOdds+pacManiaGameSetting[0].neutralFruitOdds)){
			 var NeutralF = Math.floor(Math.random()*3);
			 
			 if(NeutralF == 0){ //Apple
				 fruit.type = "Apple";
				 fruit.worth = 50;						 
			 }
			 else if(NeutralF == 1){ //Cherry
				 fruit.type = "Cherry";
				 fruit.worth = 100;					 
			 }
			 else{ //Pear
				 fruit.type = "Pear";
				 fruit.worth = 50;	
				 
			 }
		 }
		 // If its a Bad Fruit
		 else{
			 var BadF = Math.floor(Math.random()*3);
			 
			  if(BadF == 0){ //Grape
				 fruit.type = "Grape";
				 fruit.worth = 200;						 
			 }
			 else if(BadF == 1){ //Orange
				 fruit.type = "Orange";
				 fruit.worth = 275;					 
			 }
			 else{ //Strawberry
				 fruit.type = "Strawberry";
				 fruit.worth = 350;	
				 
			 }
		 }
		 
		 
		 //pacManiaGameSetting[0].typeofFruits;
		 
	 }
	    
	 //Pac-man Encounter Ghost!!
	 function didPacEncounterGhost(Pac){
		 for(var ghostNo = 0; ghostNo < ghostsArray.length; ghostNo++)
			 if(Math.abs(ghostsArray[ghostNo].x - Pac.x)<=encounterDistance && Math.abs(ghostsArray[ghostNo].y - Pac.y)<=encounterDistance){
				 if(ghostsArray[ghostNo].status != "Dead" && Pac.fruitEffect == "Super PAC-MAN"){
					 ghostsArray[ghostNo].status = "Dead";
					 Pac.score += 200;
					 //Ghost will run to Graveyard
					 ghostsArray[ghostNo].returnPath = loadAstarNode(ghostsArray[ghostNo].oldNode, ghostsArray[ghostNo].lastNode ,50);
					 
					 //In case the Ghost was killed too close to the Graveyard
					 if(ghostsArray[ghostNo].returnPath.length <= 5){
						 ghostsArray[ghostNo].returnPath = [];
						 ghostsArray[ghostNo].returnPath = loadAstarNode(ghostsArray[ghostNo].oldNode, ghostsArray[ghostNo].lastNode ,ghostsArray[ghostNo].home);
						 ghostsArray[ghostNo].returnPath = loadAstarNode(ghostsArray[ghostNo].returnPath[ghostsArray[ghostNo].returnPath.length-2], ghostsArray[ghostNo].returnPath[ghostsArray[ghostNo].returnPath.length-1] ,50);
					 }
					 
					 //To give it a minute to comeback
					 ghostsArray[ghostNo].returnPath.push(128);
					 ghostsArray[ghostNo].returnPath.push(50);
				 }
				 else if(ghostsArray[ghostNo].status != "Dead"){
					 Pac.status = "Dead";
					 Pac.survivalTime = stepCounter;					 
				 }
			 }
	}
	 
	 //Pac-man Encounters/Eats Pellets
	 function didPacEncounterItem(Pac){
		 //When the Pacman are in the same location as pellet, near a pellet
		 for(var pel = 0; pel < pacItems.length; pel++){
			 var pelletRadius =encounterDistance/2;
			 if( Math.abs(Pac.x - pacItems[pel].x)<=encounterDistance && Math.abs(Pac.y - pacItems[pel].y)<=encounterDistance){
				 
				 
				 if(pacItems[pel].type == "Banana"){
					 Pac.speed = 2;
					 Pac.density = 0.5;
					 Pac.effectTime = 500;
					 Pac.fruitEffect = "Speed 200%";
				 }
				 else if(pacItems[pel].type == "Grape"){
					 Pac.speed = 1.5;
					 Pac.effectTime = 255;
					 Pac.fruitEffect = "Drunk";
				 }
				 else if(pacItems[pel].type == "Orange"){
					 Pac.speed = 0.6;
					 Pac.density = 1.5;
					 Pac.effectTime = 500;
					 Pac.fruitEffect = "Speed 60%";
				 }
				 else if(pacItems[pel].type == "Pretzel"){
					 
					 //This is meant sole for one player modes
					 ghostsStatus = "Home";
					 ghostsCountDown = 1000;
				 }
				 else if(pacItems[pel].type == "Strawberry"){
					 ghostsStatus = "Chase";
					 Pac.fruitEffect = "Strawberry";
					 ghostsCountDown = 1250;
					 
					 
					 //Change All the Ghost Targets..... 50~66% will attack the person who at the strawberry!!!
					 for(var ghostNo = 0; ghostNo < ghostsArray.length; ghostNo++){
						 var randNumber = Math.ceil(Math.random()*pacArray.length*1.5);
					 
						 //Additionally if the randomNode is equal to or greater than the pacArray,length then this Pac is targeted as well
						 /** For an explanation lets use Player 1 with the index 0.
							 If there is two people playing then: ceiling(2*1.5) = 3 --> so if the number 0 or 2 then chase P1 (2/3 of being chased)
							 If there is three people playing then:  ceiling(3*1.5) = 5 --> so if the number 0 or 3,4 then chase P1 (3/5 of being chased)
							 If there is four people playing then:  ceiling(4*1.5) = 6 --> so if the number 0 or 4,5 then chase P1 (1/2 of being chased)
						 **/
						 if(randNumber>=pacArray.length)
							 randNumber = Pac.playerID;
						 
						 ghostsArray[ghostNo].targetPlayer = randNumber;
					 }
					 
				 }
				 else if(pacItems[pel].type == "Super Pellet"){
					 Pac.speed = 1.25;
					 Pac.fruitEffect = "Super PAC-MAN";
					 Pac.effectTime = 400;
				 }
				
				
				 Pac.score += pacItems[pel].worth;						
				 pacItems.splice(pel,1);
			 }
		 }		 
	 }
	 
	 //Pac-man Encounters Another Pac
	 function didPacEncounterPac(Pac){
		 var densityKnockBackVariable = 50;
		 for(var pacCount = 0; pacCount < pacArray.length; pacCount++){
			 if(Pac.id != pacArray[pacCount].id){
				 if(Math.abs(pacArray[pacCount].x - Pac.x)<=encounterDistance && Math.abs(pacArray[pacCount].y - Pac.y)<=encounterDistance){
					 
					 //Set Push Back Time
					 //Equations is densityKnockBackVariable - (Your Density - Their Density) x densityKnockBackVariable x 0.8
					 Pac.pushBackTime = Math.floor(densityKnockBackVariable - (Pac.y-pacArray[pacCount].y)*densityKnockBackVariable*0.5);
					 pacArray[pacCount].pushBackTime = Math.floor(densityKnockBackVariable - (pacArray[pacCount].y-Pac.y)*densityKnockBackVariable*0.5);
					 
					 //Vertical Collision
					 if(pacArray[pacCount].x == Pac.x){
						 var targetNorthNode, targetSouthNode;
						 console.log("Vertical Collision");
						 
						 //Is Pac.lastNode the Correct North Node
						 if(pacArray[pacCount].y <= mapNodes[Pac.lastNode].y &&
							 Pac.y <= mapNodes[Pac.lastNode].y &&
							 pacArray[pacCount].y >= mapNodes[mapNodes[Pac.lastNode].South].y &&
							 Pac.y >= mapNodes[mapNodes[Pac.lastNode].South].y
						 ){
							 targetNorthNode = Pac.lastNode;
							 targetSouthNode = mapNodes[Pac.lastNode].South;
						 }
						 //Is  pacArray[pacCount].lastNode the Correct North Node
						 else if( pacArray[pacCount].y <= mapNodes[ pacArray[pacCount].lastNode].y &&
							 Pac.y <= mapNodes[ pacArray[pacCount].lastNode].y &&
							 pacArray[pacCount].y >= mapNodes[mapNodes[ pacArray[pacCount].lastNode].South].y &&
							 Pac.y >= mapNodes[mapNodes[ pacArray[pacCount].lastNode].South].y
						 ){
							 targetNorthNode =  pacArray[pacCount].lastNode;
							 targetSouthNode = mapNodes[ pacArray[pacCount].lastNode].South;
						 }
						 //Is Pac.nextNode the Correct North Node
						 else if( pacArray[pacCount].y <= mapNodes[Pac.nextNode].y &&
							 Pac.y <= mapNodes[Pac.nextNode].y &&
							 pacArray[pacCount].y >= mapNodes[mapNodes[Pac.nextNode].South].y &&
							 Pac.y >= mapNodes[mapNodes[Pac.nextNode].South].y
						 ){
							 targetNorthNode = Pac.nextNode;
							 targetSouthNode = mapNodes[Pac.nextNode].South;
						 }
						 //Is  pacArray[pacCount].nextNode the Correct North Node
						 else if( pacArray[pacCount].y <= mapNodes[ pacArray[pacCount].nextNode].y &&
							 Pac.y <= mapNodes[ pacArray[pacCount].nextNode].y &&
							 pacArray[pacCount].y >= mapNodes[mapNodes[ pacArray[pacCount].nextNode].South].y &&
							 Pac.y >= mapNodes[mapNodes[ pacArray[pacCount].nextNode].South].y
						 ){
							 targetNorthNode =  pacArray[pacCount].nextNode;
							 targetSouthNode = mapNodes[ pacArray[pacCount].nextNode].South;
						 }
						 
						 
						 
						 if(Pac.y > pacArray[pacCount].y){
							 Pac.nextNode = targetNorthNode
							 Pac.direction = 'South';							 
							 pacArray[pacCount].nextNode = targetSouthNode;		
							 pacArray[pacCount].direction = 'North';				
						 }
						 else{
							 Pac.nextNode = targetSouthNode;
							 Pac.direction = 'South';				
							 pacArray[pacCount].nextNode = targetNorthNode;	
							 pacArray[pacCount].direction = 'North';											 
						 }
					 
					 }
					 //Horizontal Collision
					 else if(pacArray[pacCount].y == Pac.y){
						 console.log("Horizontal Collision");
						 var rand = Math.floor( Math.random()*mapNodes.length-20 );
						 pacArray[pacCount].x = mapNodes[ rand ].x
						 pacArray[pacCount].y = mapNodes[ rand ].y
						 pacArray[pacCount].newNode = rand;
						 
						 rand = Math.floor( Math.random()*mapNodes.length-20 );
						 Pac.x = mapNodes[ rand ].x
						 Pac.y = mapNodes[ rand ].y
						 Pac.newNode = rand;
						 
					 }
					 //Vertical & Horizontal Collision
					 else if(pacArray[pacCount].x != Pac.x && pacArray[pacCount].y != Pac.y){
						 
						 
					 }
					 
					 
					 
					 
					 
					 
					 
					 
				 }			 
			 }		 
		 }
	 }
	 
	 //Ghost Status/Updates
	 function ghostStatusUpdate(){
		 ghostsCountDown--;
		 
		 if(ghostsCountDown <= 0){
			 
			 var randomGhostMode = Math.floor(Math.random()*Math.floor(ghostRandomModeGeneratorNumber));
			 /**
				 Home (0-2) 14% - Each Ghost returns to their Respective Home Corner
				 Chase (3-10) 38 %- Each Ghost randomly wonders the Game Level
				 Scatter(11-19) 47%- Each Ghost chases a specific Pacman Player
			 **/
			 
			 
			 if(randomGhostMode <= 4 && ghostsStatus != "Home")
				 ghostsStatus = "Home";
			 else if(randomGhostMode >= 10 && ghostsStatus != "Chase")
				 ghostsStatus = "Chase";
			 else if(randomGhostMode <= 4){
				 randomGhostMode = Math.floor(Math.random()*Math.floor(ghostRandomModeGeneratorNumber-4))+4;
				 
				 if(randomGhostMode >= 10)
					 ghostsStatus = "Chase";
				 else 
					 ghostsStatus = "Scatter";
			 }
			 else if(randomGhostMode >= 10){
				 randomGhostMode = Math.floor(Math.random()*10)
				 
				 if(randomGhostMode <= 4)
					 ghostsStatus = "Home";
				 else 
					 ghostsStatus = "Scatter";				
			 }
			 else
				 ghostsStatus = "Scatter";
			 
			 
			 
			
			 if(ghostsStatus == "Home")
				 ghostsCountDown = 550+Math.floor(Math.random()*150);
			 else if(ghostsStatus == "Chase"){
				 ghostsCountDown = 450+Math.floor(Math.random()*500);
				 
				 //Assigning Targets
				 for(var ghostCount =0; ghostCount<ghostsArray.length;ghostCount++)
					 ghostsArray[ghostCount].targetPlayer = Math.floor(Math.random()*pacArray.length);
			 }
			 else if(ghostsStatus == "Scatter"){
				 ghostsCountDown = 250+Math.floor(Math.random()*350);
				 
				 ghostCreationCountDown--;
					
				 //When this hits zero Add a random ghost into the mix
				  if(ghostCreationCountDown <= 0){
					 addGhost("Random");
					 ghostCreationCountDown = Math.floor(Math.random()*(ghostsArray.length-2)+(ghostsArray.length/2));
					 console.log("A Ghost Appeared!!! ("+ghostsArray[ghostsArray.length-1].type+")");
					 
					 if(ghostCreationList.length<=1){
						 ghostCreationList.push("Blinky");
						 ghostCreationList.push("Blinky");
						 ghostCreationList.push("Pinky");
						 ghostCreationList.push("Inky");
						 ghostCreationList.push("Clyde");
					 }
				 }
			 }
			 
			 console.log("Mode: " + ghostsStatus);
			 
			 
			 
		 }
	 }
	 
	 //Loads a random node	
	 function loadRandomNode(lastNode,nextNode){		
		 var nodeNumber = mapNodes[ nextNode ].Connectednodes[ Math.floor( Math.random()*mapNodes[ nextNode ].Connectednodes.length ) ];
			
		 while(nodeNumber == lastNode || nodeNumber == nextNode || nodeNumber == -1)
			 nodeNumber = mapNodes[ nextNode ].Connectednodes[ Math.floor( Math.random()*mapNodes[ nextNode ].Connectednodes.length ) ];
		 
		 return nodeNumber;
	 }
	
	 //Reset the Astar Array List
	 function resetAstarList(){
		 //First Empty the nodesList
		 nodesList = [];
		 for(var x=0;x<mapNodes.length;x++){
			 var node = {id:x, x:mapNodes[x].x, y:mapNodes[x].y, Connectednodes:mapNodes[x].Connectednodes,
						 f:100, g:000, h:0, parent:null}
			
			 nodesList.push(node);
			 //console.log("Node id: "+nodesList[x].id+": x:"+nodesList[x].x+" y:"+nodesList[x].y+" Connections:"+nodesList[x].Connectednodes);
		 }
		//console.log("Node List is complete!!!")
	 }
	
	 //A* Search Function for the Ghost
	 function loadAstarNode(prevNode,currNode,goalNode){
		//Path is first empty
		var path=[];
		resetAstarList();
		//console.log("");
		//console.log("");
		//console.log("pRINT AT THE START!!! ONLY!!!!");
		//console.log("P:"+prevNode+"  C:"+currNode+"  G:"+goalNode);
		
		if(currNode == undefined){
			if(prevNode == 117) currNode = 118;
			else if(prevNode == 118) currNode = 117;
			else if(prevNode == 119) currNode = 120;
			else if(prevNode == 120) currNode = 119;
			else if(mapNodes[prevNode].North != -1) currNode = mapNodes[prevNode].North;
			else if(mapNodes[prevNode].East != -1) currNode = mapNodes[prevNode].East;
			else if(mapNodes[prevNode].South != -1) currNode = mapNodes[prevNode].South;
			else currNode = mapNodes[prevNode].West;
			console.log("Corrected P:"+prevNode+"  C:"+currNode+"  G:"+goalNode);
		}
		
		var openList = [];
		var closedList = [];
		//console.log("openList LengthA:"+openList.length);
		openList.push(nodesList[currNode]);
		closedList.push(nodesList[prevNode]);
		//console.log("openList LengthB:"+openList.length);
		//console.log("openList Length:"+openList.length+" contents: "+openList[0].id);
		while (openList.length >= 1 && path.length == 0){
			//First we need the lowest f(x)
			//if(openList[0] == null) console.log("Null Found at zero");
			//else console.log(" i: 0  id:"+openList[0].id);
			var lowestIndex=0;
			for(var i=0; i < openList.length; i++){
				//if(openList[i] == null) console.log("Null Found at "+i+", Checking next value: "+(i+1)+": "+openList[(i+1)]+", Checking next value: "+(i+2)+": "+openList[(i+2)]+", Checking next value: "+(i+3)+": "+openList[(i+3)]);
				if(openList[i].f < openList[lowestIndex].f)
					lowestIndex = i;
				
				//Preprint out the next entry
				//if((i+1) < openList.length)
					//console.log(" i:"+ (i+1) + " id:"+openList[(i+1)].id);
			}
			var lowestNode = openList[lowestIndex];
			//console.log("Current node ID: "+lowestNode.id);
			
			//End case- Found the shortest path			
			if(lowestNode.id == goalNode){
				var curr = lowestNode;
				
				while(curr.parent){
					path.push(curr.id);
					curr = curr.parent;					
				} 
				
				//console.log( "Path: "+path.reverse());
				openList = [];
				closedList = [];
				openList.splice(0,openList.length);
				//console.log("This is printed before the return....")
				//return path[path.length-1];
				return path.reverse();
				//console.log("This is continuing the program after returning a value!!!")
			}
			
			
			//Still searching
			closedList.push(lowestNode);
			openList.splice(lowestIndex,1);
			//console.log("****List****");
			//console.log("");
			//console.log(openList);
			//console.log("****Done****");
			
			for(var x = 0; x < lowestNode.Connectednodes.length; x++){
				var node =  nodesList[lowestNode.Connectednodes[x]];
				
				//Check if this node is in the 
				var found = false;
				for(var y = 0; y < closedList.length && 0 != closedList.length; y++)
					if(node.id == closedList[y].id){
						found =true;
						//console.log("node "+node.id+" is already in the closed list")
					
						if(lowestNode.id==currNode || closedList[y].id==goalNode)
							closedList.splice(y,1);
					}
						
					
				if(!found){
					//
					var gScore = lowestNode.g + 1;
					var gScoreIsBest = false;
					
					for(var z = 0; z < openList.length && 0 != openList.length; z++)
						if(node.id == openList[z].id)
							found =true;
					
					if(!found){
						gScoreIsBest = true;
						node.h = Math.abs(node.x-nodesList[goalNode].x)+ Math.abs(node.y-nodesList[goalNode].y);
						openList.push(node);
					}
					else if(gScore < node.g)
						gScoreIsBest = true;
					
					if(gScoreIsBest){
						
						node.parent = lowestNode;
						node.g = gScore;
						node.f = node.g+node.h;
					}
				}
			}
		}
		
		console.log("Ended A*");
		
		 //return path.reverse();
		 //Created with guidance from:
		 //https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/
	 }
	 
	 //Load Nodes for Maze 1
	 function loadNodesMaze1(){
		 //Node Zero
		 var connection = [1,24];
		 var node = {x:-10, y:10, Connectednodes:connection,
							North:-1, East:1,South:24,West:-1};
		 mapNodes.push(node);
		 //Node One
		 var connection = [0,2,8];
		 var node = {x:-7, y:10, Connectednodes:connection,
							North:-1, East:2,South:8,West:0};
		 mapNodes.push(node);
		 //Node Two
		 connection = [1,10];
		 node = {x:-4, y:10, Connectednodes:connection,
							North:-1, East:-1,South:10,West:1};
		 mapNodes.push(node);
		 //Node Three
		 connection = [4,12];
		 node = {x:-2, y:10, Connectednodes:connection,
							North:-1, East:4,South:12,West:-1};
		 mapNodes.push(node);
		 //Node Four
		 connection = [3, 5,15];
		 node = {x:2, y:10, Connectednodes:connection,
							North:-1, East:5,South:15,West:3};
		 mapNodes.push(node); 
		 //Node Five
		 connection = [4, 6,16];
		 node = {x:6, y:10, Connectednodes:connection,
							North:-1, East:6,South:16,West:4};
		 mapNodes.push(node); 
		 //Node Six
		 connection = [5,19];
		 node = {x:10, y:10, Connectednodes:connection,
							North:-1, East:-1,South:19,West:5};
		 mapNodes.push(node); 
		 //Node Seven
		 connection = [8,25];
		 node = {x:-8, y:8, Connectednodes:connection,
							North:-1, East:8,South:25,West:-1};
		 mapNodes.push(node); 
		 //Node Eight
		 connection = [1, 7, 9];
		 node = {x:-7, y:8, Connectednodes:connection,
							North:1, East:9,South:-1,West:7};
		 mapNodes.push(node);
		 //Node Nine
		 connection = [8,10,27];
		 node = {x:-5, y:8, Connectednodes:connection,
							North:-1, East:10,South:27,West:8};
		 mapNodes.push(node); 
		 //Node Ten
		 connection = [2,9,11];
		 node = {x:-4, y:8, Connectednodes:connection,
							North:2, East:11,South:-1,West:9};
		 mapNodes.push(node); 
		 //Node Eleven
		 connection = [10,12,28];
		 node = {x:-3, y:8, Connectednodes:connection,
							North:-1, East:12,South:28,West:10};
		 mapNodes.push(node); 
		 //Node Twelve
		 connection = [3,11,13];
		 node = {x:-2, y:8, Connectednodes:connection,
							North:3, East:13,South:-1,West:11};
		 mapNodes.push(node); 
		 //Node Thirteen
		 connection = [12,20];
		 node = {x:-1, y:8, Connectednodes:connection,
							North:-1, East:-1,South:20,West:12};
		 mapNodes.push(node); 
		 //Node Fourteen
		 connection = [15,21];
		 node = {x:1, y:8, Connectednodes:connection,
							North:-1, East:15,South:21,West:-1};
		 mapNodes.push(node); 
		 //Node Fifthteen
		 connection = [4, 14];
		 node = {x:2, y:8, Connectednodes:connection,
							North:4, East:-1,South:-1,West:14};
		 mapNodes.push(node); 
		 //Node Sixteen
		 connection = [5, 17];
		 node = {x:6, y:8, Connectednodes:connection,
							North:5, East:17,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node Seventeen
		 connection = [16, 22];
		 node = {x:7, y:8, Connectednodes:connection,
							North:-1, East:-1,South:22,West:16};
		 mapNodes.push(node); 
		 //Node Eighteen
		 connection = [19,23];
		 node = {x:9, y:8, Connectednodes:connection,
							North:-1, East:19,South:23,West:-1};
		 mapNodes.push(node); 
		 //Node Nineteen
		 connection = [6, 18];
		 node = {x:10, y:8, Connectednodes:connection,
							North:6, East:-1,South:-1,West:18};
		 mapNodes.push(node); 
		 //Node Twenty
		 connection = [13, 21, 29];
		 node = {x:-1, y:7, Connectednodes:connection,
							North:13, East:21,South:29,West:-1};
		 mapNodes.push(node);
		 //Node Twenty One
		 connection = [14, 20, 30];
		 node = {x:1, y:7, Connectednodes:connection,
							North:14, East:-1,South:30,West:20};
		 mapNodes.push(node);
		 //Node Twenty Two
		 connection = [17, 23, 32];
		 node = {x:7, y:7, Connectednodes:connection,
							North:17, East:23,South:32,West:-1};
		 mapNodes.push(node);
		 //Node Twenty Three
		 connection = [18, 22, 33];
		 node = {x:9, y:7, Connectednodes:connection,
							North:18, East:-1,South:33,West:22};
		 mapNodes.push(node);
		 //Node Twenty Four
		 connection = [0, 25];
		 node = {x:-10, y:6, Connectednodes:connection,
							North:0, East:25,South:-1,West:-1};
		 mapNodes.push(node); 
		  //Node Twenty Five
		 connection = [7,24,26];
		 node = {x:-8, y:6, Connectednodes:connection,
							North:7, East:26,South:-1,West:24};
		 mapNodes.push(node); 
		 //Node Twenty Six
		 connection = [25,27,35];
		 node = {x:-7, y:6, Connectednodes:connection,
							North:-1, East:27,South:35,West:25};
		 mapNodes.push(node); 
		 //Node Twenty Seven
		 connection = [9, 26];
		 node = {x:-5, y:6, Connectednodes:connection,
							North:9, East:-1,South:-1,West:26};
		 mapNodes.push(node); 
		 //Node Twenty Eight
		 connection = [11, 29, 36];
		 node = {x:-3, y:6, Connectednodes:connection,
							North:11, East:29,South:36,West:-1};
		 mapNodes.push(node);
		 //Node Twenty Nine
		 connection = [20, 28, 37];
		 node = {x:-1, y:6, Connectednodes:connection,
							North:20, East:-1,South:37,West:28};
		 mapNodes.push(node);
		 //Node Thirty
		 connection = [21, 31, 39];
		 node = {x:1, y:6, Connectednodes:connection,
							North:21, East:31,South:39,West:-1};
		 mapNodes.push(node);
		 //Node Thirty One
		 connection = [30,32,117];
		 node = {x:4, y:6, Connectednodes:connection,
							North:117, East:32,South:-1,West:30};
		 mapNodes.push(node); 
		 //Node Thirty Two
		 connection = [22, 31, 41];
		 node = {x:7, y:6, Connectednodes:connection,
							North:22, East:-1,South:41,West:31};
		 mapNodes.push(node);
		 //Node Thirty Three
		 connection = [23, 34];
		 node = {x:9, y:6, Connectednodes:connection,
							North:23, East:34,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node Thirty Four
		 connection = [33, 43];
		 node = {x:10, y:6, Connectednodes:connection,
							North:-1, East:-1,South:43,West:33};
		 mapNodes.push(node); 
		 //Node Thirty Five
		 connection = [26, 36,45,119];
		 node = {x:-7, y:4, Connectednodes:connection,
							North:26, East:36,South:45,West:119};
		 mapNodes.push(node); 
		 //Node Thirty Six
		 connection = [28, 35,37,48];
		 node = {x:-3, y:4, Connectednodes:connection,
							North:28, East:37,South:48,West:35};
		 mapNodes.push(node); 
		 //Node Thirty Seven
		 connection = [29,36,38];
		 node = {x:-1, y:4, Connectednodes:connection,
							North:29, East:38,South:-1,West:36};
		 mapNodes.push(node); 
		 //Node Thirty Eight
		 connection = [37,39,50];
		 node = {x:0, y:4, Connectednodes:connection,
							North:-1, East:39,South:50,West:37};
		 mapNodes.push(node);
		 //Node Thirty Nine
		 connection = [30,38,40];
		 node = {x:1, y:4, Connectednodes:connection,
							North:30, East:40,South:-1,West:38};
		 mapNodes.push(node); 
		 //Node Forty
		 connection = [39,41,52];
		 node = {x:4, y:4, Connectednodes:connection,
							North:-1, East:41,South:52,West:39};
		 mapNodes.push(node);
		 //Node Forty One
		 connection = [32,40,42];
		 node = {x:7, y:4, Connectednodes:connection,
							North:32, East:42,South:-1,West:40};
		 mapNodes.push(node); 
		 //Node Forty Two
		 connection = [41,43,54];
		 node = {x:8, y:4, Connectednodes:connection,
							North:-1, East:43,South:54,West:41};
		 mapNodes.push(node);
		 //Node Forty Three
		 connection = [34, 42, 55];
		 node = {x:10, y:4, Connectednodes:connection,
							North:34, East:-1,South:55,West:42};
		 mapNodes.push(node);
		 //Node Forty Four
		 connection = [45,60];
		 node = {x:-10, y:2, Connectednodes:connection,
							North:-1, East:45,South:60,West:-1};
		 mapNodes.push(node);
		 //Node Forty Five
		 connection = [35,44,46];
		 node = {x:-7, y:2, Connectednodes:connection,
							North:35, East:46,South:-1,West:44};
		 mapNodes.push(node); 
		 //Node Forty Six
		 connection = [45, 56];
		 node = {x:-6, y:2, Connectednodes:connection,
							North:-1, East:-1,South:56,West:45};
		 mapNodes.push(node);
		 //Node Forty Seven
		 connection = [48,57];
		 node = {x:-4, y:2, Connectednodes:connection,
							North:-1, East:48,South:57,West:-1};
		 mapNodes.push(node);
		 //Node Forty Eight
		 connection = [36,47,49];
		 node = {x:-3, y:2, Connectednodes:connection,
							North:36, East:49,South:-1,West:47};
		 mapNodes.push(node); 
		 //Node Forty Nine
		 connection = [48,50,63];
		 node = {x:-2, y:2, Connectednodes:connection,
							North:-1, East:50,South:63,West:48};
		 mapNodes.push(node);
		 //Node Fifty
		 connection = [38,49,51];
		 node = {x:0, y:2, Connectednodes:connection,
							North:38, East:51,South:-1,West:49};
		 mapNodes.push(node); 
		 //Node Fifty One
		 connection = [50,52,64];
		 node = {x:2, y:2, Connectednodes:connection,
							North:-1, East:52,South:64,West:50};
		 mapNodes.push(node);
		 //Node Fifty Two
		 connection = [40,51,58];
		 node = {x:4, y:2, Connectednodes:connection,
							North:40, East:-1,South:58,West:51};
		 mapNodes.push(node);
		 //Node Fifty Three
		 connection = [54,59];
		 node = {x:6, y:2, Connectednodes:connection,
							North:-1, East:54,South:59,West:-1};
		 mapNodes.push(node);
		 //Node Fifty Four
		 connection = [42,53,55,67];
		 node = {x:8, y:2, Connectednodes:connection,
							North:42, East:55,South:67,West:53};
		 mapNodes.push(node);
		 //Node Fifty Five
		 connection = [43,54,75];
		 node = {x:10, y:2, Connectednodes:connection,
							North:43, East:-1,South:75,West:54};
		 mapNodes.push(node);
		 //Node Fifty Six
		 connection = [46,57,69];
		 node = {x:-6, y:1, Connectednodes:connection,
							North:46, East:57,South:69,West:-1};
		 mapNodes.push(node);
		 //Node Fifty Seven
		 connection = [47,56,62];
		 node = {x:-4, y:1, Connectednodes:connection,
							North:47, East:-1,South:62,West:56};
		 mapNodes.push(node);
		 //Node Fifty Eight
		 connection = [52,59,65];
		 node = {x:4, y:1, Connectednodes:connection,
							North:52, East:59,South:65,West:-1};
		 mapNodes.push(node);
		 //Node Fifty Nine
		 connection = [53,58,66];
		 node = {x:6, y:1, Connectednodes:connection,
							North:53, East:-1,South:66,West:58};
		 mapNodes.push(node);
		 //Node Sixty
		 connection = [44,61,78];
		 node = {x:-10, y:-1, Connectednodes:connection,
							North:44, East:61,South:78,West:-1};
		 mapNodes.push(node);
		 //Node Sixty One
		 connection = [60, 68];
		 node = {x:-8, y:-1, Connectednodes:connection,
							North:-1, East:-1,South:68,West:60};
		 mapNodes.push(node);
		 //Node Sixty Two
		 connection = [57,63,70];
		 node = {x:-4, y:-1, Connectednodes:connection,
							North:57, East:63,South:70,West:-1};
		 mapNodes.push(node);
		 //Node Sixty Three
		 connection = [49,62,71];
		 node = {x:-2, y:-1, Connectednodes:connection,
							North:49, East:-1,South:71,West:62};
		 mapNodes.push(node);
		 //Node Sixty Four
		 connection = [51,65,73];
		 node = {x:2, y:-1, Connectednodes:connection,
							North:51, East:65,South:73,West:-1};
		 mapNodes.push(node);
		 //Node Sixty Five
		 connection = [58,64,66];
		 node = {x:4, y:-1, Connectednodes:connection,
							North:58, East:66,South:-1,West:64};
		 mapNodes.push(node); 
		 //Node Sixty Six
		 connection = [59,65,67,77];
		 node = {x:6, y:-1, Connectednodes:connection,
							North:59, East:67,South:77,West:65};
		 mapNodes.push(node);
		 //Node Sixty Seven
		 connection = [54,66,74];
		 node = {x:8, y:-1, Connectednodes:connection,
							North:54, East:-1,South:74,West:66};
		 mapNodes.push(node);
		 //Node Sixty Eight
		 connection = [61,69,80];
		 node = {x:-8, y:-2, Connectednodes:connection,
							North:61, East:69,South:80,West:-1};
		 mapNodes.push(node);
		 //Node Sixty Nine
		 connection = [56,68,70];
		 node = {x:-6, y:-2, Connectednodes:connection,
							North:56, East:70,South:-1,West:68};
		 mapNodes.push(node); 
		 //Node Seventy
		 connection = [62,69,82];
		 node = {x:-4, y:-2, Connectednodes:connection,
							North:62, East:-1,South:82,West:69};
		 mapNodes.push(node);
		 //Node Seventy One
		 connection = [63,72];
		 node = {x:-2, y:-2, Connectednodes:connection,
							North:63, East:72,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node Seventy Two
		 connection = [71,73,83];
		 node = {x:0, y:-2, Connectednodes:connection,
							North:-1, East:73,South:83,West:71};
		 mapNodes.push(node);
		 //Node Seventy Three
		 connection = [64,72];
		 node = {x:2, y:-2, Connectednodes:connection,
							North:64, East:-1,South:-1,West:72};
		 mapNodes.push(node); 
		 //Node Seventy Four
		 connection = [67,75];
		 node = {x:8, y:-2, Connectednodes:connection,
							North:67, East:75,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node Seventy Five
		 connection = [55,74];
		 node = {x:10, y:-2, Connectednodes:connection,
							North:55, East:-1,South:-1,West:74};
		 mapNodes.push(node); 
		 //Node Seventy Six
		 connection = [77,86];
		 node = {x:4, y:-3, Connectednodes:connection,
							North:-1, East:77,South:86,West:-1};
		 mapNodes.push(node); 
		 //Node Seventy Seven
		 connection = [66,76,84];
		 node = {x:6, y:-3, Connectednodes:connection,
							North:66, East:-1,South:84,West:76};
		 mapNodes.push(node);
		 //Node Seventy Eight
		 connection = [60,79];
		 node = {x:-10, y:-4, Connectednodes:connection,
							North:60, East:79,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node Seventy Nine
		 connection = [78,80,88];
		 node = {x:-9, y:-4, Connectednodes:connection,
							North:-1, East:80,South:88,West:78};
		 mapNodes.push(node);
		 //Node Eighty
		 connection = [68,79,81];
		 node = {x:-8, y:-4, Connectednodes:connection,
							North:68, East:81,South:-1,West:79};
		 mapNodes.push(node); 
		 //Node Eighty One
		 connection = [80,82,90];
		 node = {x:-6, y:-4, Connectednodes:connection,
							North:-1, East:82,South:90,West:80};
		 mapNodes.push(node);
		 //Node Eighty Two
		 connection = [70,81,83];
		 node = {x:-4, y:-4, Connectednodes:connection,
							North:70, East:83,South:-1,West:81};
		 mapNodes.push(node); 
		 //Node Eighty Three
		 connection = [72,82,85];
		 node = {x:0, y:-4, Connectednodes:connection,
							North:72, East:-1,South:85,West:82};
		 mapNodes.push(node);
		 //Node Eighty Four
		 connection = [77,94,120];
		 node = {x:6, y:-4, Connectednodes:connection,
							North:77, East:120,South:94,West:-1};
		 mapNodes.push(node);
		 //Node Eighty Five
		 connection = [83,86,92];
		 node = {x:0, y:-5, Connectednodes:connection,
							North:83, East:86,South:92,West:-1};
		 mapNodes.push(node);
		 //Node Eighty Six
		 connection = [76,85,93];
		 node = {x:4, y:-5, Connectednodes:connection,
							North:76, East:-1,South:93,West:85};
		 mapNodes.push(node);
		 //Node Eighty Seven
		 connection = [88,98];
		 node = {x:-10, y:-6, Connectednodes:connection,
							North:-1, East:88,South:98,West:-1};
		 mapNodes.push(node); 
		 //Node Eighty Eight
		 connection = [79,87,89];
		 node = {x:-9, y:-6, Connectednodes:connection,
							North:79, East:89,South:-1,West:87};
		 mapNodes.push(node); 
		 //Node Eighty Nine
		 connection = [88,90,99];
		 node = {x:-8, y:-6, Connectednodes:connection,
							North:-1, East:90,South:99,West:88};
		 mapNodes.push(node);
		 //Node Ninety
		 connection = [81,89,100];
		 node = {x:-6, y:-6, Connectednodes:connection,
							North:81, East:-1,South:100,West:89};
		 mapNodes.push(node);
		 //Node Ninety One
		 connection = [92,118];
		 node = {x:-4, y:-6, Connectednodes:connection,
							North:-1, East:92,South:118,West:-1};
		 mapNodes.push(node); 
		 //Node Ninety Two
		 connection = [85,91,102];
		 node = {x:0, y:-6, Connectednodes:connection,
							North:85, East:-1,South:102,West:91};
		 mapNodes.push(node);
		 //Node Ninety Three
		 connection = [86,94,97];
		 node = {x:4, y:-6, Connectednodes:connection,
							North:86, East:94,South:97,West:-1};
		 mapNodes.push(node);
		 //Node Ninety Four
		 connection = [84,93,95,104];
		 node = {x:6, y:-6, Connectednodes:connection,
							North:84, East:95,South:104,West:93};
		 mapNodes.push(node);
		 //Node Ninety Five
		 connection = [94,105];
		 node = {x:10, y:-6, Connectednodes:connection,
							North:-1, East:-1,South:105,West:94};
		 mapNodes.push(node); 
		 //Node Ninety Six
		 connection = [97,103];
		 node = {x:2, y:-7, Connectednodes:connection,
							North:-1, East:97,South:103,West:-1};
		 mapNodes.push(node); 
		 //Node Ninety Seven
		 connection = [93,96];
		 node = {x:4, y:-7, Connectednodes:connection,
							North:93, East:-1,South:-1,West:96};
		 mapNodes.push(node); 
		 //Node Ninety Eight
		 connection = [87,99,110];
		 node = {x:-10, y:-8, Connectednodes:connection,
							North:87, East:99,South:110,West:-1};
		 mapNodes.push(node);
		 //Node Ninety Nine
		 connection = [89,98,100,111];
		 node = {x:-8, y:-8, Connectednodes:connection,
							North:89, East:100,South:111,West:98};
		 mapNodes.push(node);
		 //Node One Hundred
		 connection = [90,99,112];
		 node = {x:-6, y:-8, Connectednodes:connection,
							North:90, East:-1,South:112,West:99};
		 mapNodes.push(node);
		 //Node One Hundred One
		 connection = [102,107];
		 node = {x:-2, y:-8, Connectednodes:connection,
							North:-1, East:102,South:107,West:-1};
		 mapNodes.push(node); 
		 //Node One Hundred Two
		 connection = [92,101,103];
		 node = {x:0, y:-8, Connectednodes:connection,
							North:92, East:103,South:-1,West:101};
		 mapNodes.push(node); 
		 //Node One Hundred Three
		 connection = [96,102,108];
		 node = {x:2, y:-8, Connectednodes:connection,
							North:96, East:-1,South:108,West:102};
		 mapNodes.push(node);
		 //Node One Hundred Four
		 connection = [94,105,115];
		 node = {x:6, y:-8, Connectednodes:connection,
							North:94, East:105,South:115,West:-1};
		 mapNodes.push(node);
		 //Node One Hundred Five
		 connection = [95,104,116];
		 node = {x:10, y:-8, Connectednodes:connection,
							North:95, East:-1,South:116,West:104};
		 mapNodes.push(node);
		 //Node One Hundred Six
		 connection = [107,113];
		 node = {x:-3, y:-9, Connectednodes:connection,
							North:-1, East:107,South:113,West:-1};
		 mapNodes.push(node); 
		 //Node One Hundred Seven
		 connection = [101, 106];
		 node = {x:-2, y:-9, Connectednodes:connection,
							North:101, East:-1,South:-1,West:106};
		 mapNodes.push(node);
		 //Node One Hundred Eight
		 connection = [103, 109];
		 node = {x:2, y:-9, Connectednodes:connection,
							North:103, East:109,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node One Hundred Nine
		 connection = [108,114];
		 node = {x:4, y:-9, Connectednodes:connection,
							North:-1, East:-1,South:114,West:108};
		 mapNodes.push(node); 
		 //Node One Hundred Ten
		 connection = [98,111];
		 node = {x:-10, y:-10, Connectednodes:connection,
							North:98, East:111,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node One Hundred Eleven
		 connection = [99,110,112];
		 node = {x:-8, y:-10, Connectednodes:connection,
							North:99, East:112,South:-1,West:110};
		 mapNodes.push(node); 
		 //Node One Hundred Twelve
		 connection = [100,111,113];
		 node = {x:-6, y:-10, Connectednodes:connection,
							North:100, East:113,South:-1,West:111};
		 mapNodes.push(node); 
		 //Node One Hundred Thirteen
		 connection = [106, 112];
		 node = {x:-3, y:-10, Connectednodes:connection,
							North:106, East:-1,South:-1,West:112};
		 mapNodes.push(node); 
		 //Node One Hundred Fourteen
		 connection = [109,115];
		 node = {x:4, y:-10, Connectednodes:connection,
							North:109, East:115,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Node One Hundred Fifthteen
		 connection = [104,114,116];
		 node = {x:6, y:-10, Connectednodes:connection,
							North:104, East:116,South:-1,West:114};
		 mapNodes.push(node); 
		 //Node One Hundred Sixteen
		 connection = [105,115];
		 node = {x:10, y:-10, Connectednodes:connection,
							North:105, East:-1,South:-1,West:115};
		 mapNodes.push(node); 
		 //Portal Nodes
		 //Portal A - Node 117
		 connection = [31, 118];
		 node = {x:4, y:8, Connectednodes:connection,
							North:118, East:-1,South:31,West:-1};
		 mapNodes.push(node); 
		 //Portal A - Node 118
		 connection = [91, 117];
		 node = {x:-4, y:-7, Connectednodes:connection,
							North:91, East:-1,South:117,West:-1};
		 mapNodes.push(node); 
		 //Portal B - Node 119
		 connection = [35,120];
		 node = {x:-10, y:4, Connectednodes:connection,
							North:-1, East:35,South:-1,West:120};
		 mapNodes.push(node); 
		 //Portal B - Node 120
		 connection = [84,119];
		 node = {x:10, y:-4, Connectednodes:connection,
							North:-1, East:119,South:-1,West:84};
		 mapNodes.push(node); 
		 //Ghost Yard
		 //All of the locations will move towards the center and then towards Node 50
		 //G121
		 connection = [122];
		 node = {x:-1, y:1, Connectednodes:connection,
							North:-1, East:122,South:-1,West:-1};
		 mapNodes.push(node); 
		 //G122 - Center Node
		 connection = [50];
		 node = {x:0, y:1, Connectednodes:connection,
							North:50, East:-1,South:-1,West:-1};
		 mapNodes.push(node); 
		 //G123
		 connection = [122];
		 node = {x:1, y:1, Connectednodes:connection,
							North:-1, East:-1,South:-1,West:112};
		 mapNodes.push(node); 
		 //G-124
		 connection = [125];
		 node = {x:-1, y:0, Connectednodes:connection,
							North:-1, East:125,South:-1,West:-1};
		 mapNodes.push(node); 
		 //G125 - Center Node
		 connection = [122];
		 node = {x:0, y:1, Connectednodes:connection,
							North:122, East:-1,South:-1,West:-1};
		 mapNodes.push(node); 
		 //G126
		 connection = [125];
		 node = {x:1, y:1, Connectednodes:connection,
							North:-1, East:-1,South:-1,West:125};
		mapNodes.push(node); 
		 //G-127
		 connection = [128];
		 node = {x:-1, y:0, Connectednodes:connection,
							North:-1, East:128,South:-1,West:-1};
		mapNodes.push(node); 
		 //G128 - Center Node
		 connection = [125];
		 node = {x:0, y:1, Connectednodes:connection,
							North:125, East:-1,South:-1,West:-1};
		mapNodes.push(node); 
		 //G129
		 connection = [128];
		 node = {x:1, y:1, Connectednodes:connection,
							North:-1, East:-1,South:-1,West:128};
		mapNodes.push(node); 
		 
		 
		 //Build the Ghost Sectional Build
		 ghostSectionalBuild(1);
		 
		 /*
		 //ghostSectionalSearch(initialColumn,initalRow,searchRange)
		 //ghostSectionalSearch( X , Y ,searchRange)
		 console.log("--a*--")
		 ghostSectionalSearch(-10, 10, 3);
		 console.log("--b*--")
		 ghostSectionalSearch(-10, 10, 5);
		 console.log("--c*--")
		 ghostSectionalSearch(-10, 10, 6);
		 console.log("--d*--")
		 ghostSectionalSearch(6, 10, 2);                                               
		 console.log("--e*--")
		 //ghostSectionalSearch(6,6, 6);
		 ghostSectionalSearch(6,6, 3);
		 console.log("--f*--")
		 console.log(ghostSectionalSearch(0, 0, 2));
		 console.log("--g*--")
		 console.log(ghostSectionalSearch(10, -10, 4));
		 */
	 }

	 //Builds a matrix that can be used to find sections
	 function ghostSectionalBuild( maze){
		 //First clear the rowSections
		 rowSections = [];
		 
		 var temp_sections =[], currentRow = mapNodes[0].y;
		 temp_sections.push(currentRow);
		 
		 var len = 0;
		 // the length of the Maze is 116 if it is Maze 1 (not counting portals and ghost areas)
		 if( maze == 1) len = 116;
		 
		 //Go through the mapNodes
		 for(var x=0; x<= len; x++){
			 
			 if( currentRow == mapNodes[x].y){
				 var data = {
					 node : x,
					 x : mapNodes[x].x,
					 y : mapNodes[x].y
				 }
				 
				 temp_sections.push(data);
			 }
			 else if( currentRow > mapNodes[x].y){
				 //increments currentRow and backs a bit to make sure we don't miss anything
				 currentRow--;
				 x--;
				 
				 //push the temp sections into the rowSections
				 rowSections.push(temp_sections);
				 
				 //reset the temp sections
				 temp_sections=[];
				 temp_sections.push(currentRow);
			 }
		 }
		 
		 //To get the final row
		 /*
		 rowSections.push(temp_sections)
		 console.log("-----------------------------------------------");
		 console.log("Full List");
		 console.log(rowSections);
		 console.log("-----------------------------------------------");
		 */
		 
		 console.log("Build for the Rows is all set...");
	 }
	 
	 //Finds nodes within a specified range of the initialColumn and initialRow
	 function ghostSectionalSearch(initialColumn,initialRow,searchRange){
		 var randomSectionsSearchArray = [];
		 
		 //var startingRow = (initialRow*-1) - searchRange + Math.abs( mapNodes[0].y);
		 //console.log(rowSections[0][0] );
		 //Just search thru the close rows
		 for(var x = 0; x<rowSections.length;x++)
			 //Only the rows within the ranges!!!
			 if((rowSections[x][0] >= (initialRow-searchRange)) && (rowSections[x][0] <= (initialRow+searchRange)) ){		
			 
				 //console.log(rowSections[x]);
				 for(var y = 1; y < rowSections[x].length; y++){
					 //If the searching area is within range
					 //if( Math.abs(mapNodes[rowSections[x][y]].x - initialColumn) <= searchRange){
					 if((rowSections[x][y].x >= (initialColumn-searchRange)) && (rowSections[x][y].x<= (initialColumn+searchRange)) ){
						 randomSectionsSearchArray.push(rowSections[x][y].node);
						 //console.log(rowSections[x][y]);
					 }
				 }
			 }
		 //console.log(randomSectionsSearchArray);
		 //console.log("-----------------------------------------------");
		 //Returns a random node in the section area
		 return randomSectionsSearchArray[Math.floor( Math.random()*randomSectionsSearchArray.length )];		 
	 }
	 
	 
	 
	 //Reset Game for the next round
	 function resetGame(){
		 clearInterval(gameRender);
		 gameRender = null;
		 clearInterval(countDownInterval);
		 countDownInterval = null;
		 ghostsArray = [];
		 ghostCreationCountDown = 2;
		 ghostCreationList=[];
		 ghostsStatus = "Scatter";
		 ghostsCountDown=200;
		 ghostRandomModeGeneratorNumber =21; 
		 pacManiaCountDown=10;
		 PacSocketList=[];
		 ghostsArray = [];
		 pacArray = [];
		 pacItems = [];
		 mapNodes = [];
		 nodesList;
		 
	 }
	 
	 //Leaving the PacMania Game
     socket.on('disconnect', function() {
		 for(var x = 0; x<pacArray.length; x++)
			 if(pacArray[x].id == socket.id){
				 console.log("Player "+(x+1)+" - "+socket.id+" has Disconnected!");
				 pacArray.splice(x,1);
			 }
		
		 if(pacArray.length == 0){
			 console.log("Pacmania Server just became Idle");
			 resetGame();
		}
    });
 
});


