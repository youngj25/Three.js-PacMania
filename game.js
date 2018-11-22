var socket, PacMania = io('/pacMania', {forceNew:true});
var player=-1;
var Game_Status="Ready",camera;
var objects = [];
//Start Game
var mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster(), pos = new THREE.Vector3();
//Text
var clickable = [];

//PacMania
var TextFileLog;
var Outline, Board, gameMaze = [], pellets=[], PacList=[], GhostList=[];
var Width = 0, Height = 0;
var xMultiplier  = 1.9, yMultiplier=1.9, yShifter = -2.25,ySpriteShifter= 0.21;
var bgButton, startButton, backgroundState = 'Original', joinButton; //Background functions
var gameOver, playAgainButton;
var aboutButton, howToPlayButton, creditButton, closeButton, titleSectionText, returnButton, textBox, displayBox, displayArray=[];
var creditDisplayArray = [], sourceLinkButton, rightArrowButton, leftArrowButton, sceneNumber=0, htpTextArray =[];
var Texture, BlinkyTexture = [], PinkyTexture = [], InkyTexture = [], ClydeTexture = [], DeadGhostTexture=[];
var PlayerTexture=[];
var OriginalTexture = [], Style1Texture = [], Style2Texture = [], Style3Texture = [];
var P1Text, P2Text, P3Text, P4TEXT, P1SCORE, P2SCORE, P3SCORE, P4SCORE; //SCORE BOARD
//FOR THE TOUCH SCREENS CONtrols The four buttons
var NorthButton, SouthButton, EastButton, WestButton;
var pelletTexture, appleTexture, bananaTexture, cherryTexture, orangeTexture, pearTexture, pretzelTexture, strawberryTexture, grapeTexture;

function init() {
	 // create a scene, that will hold all our elements such as objects, cameras and lights.
	 var scene = new THREE.Scene();				
	
	 // create a camera, which defines where we're looking at.
	 camera = new THREE.PerspectiveCamera(50, 500/ 500, 0.1, 1000);
	 camera.position.set(0,0,53);
	 scene.add(camera);
	 
	 // create a render and set the size
	 var renderer = new THREE.WebGLRenderer({ antialias: true} );
	 renderer.setClearColor(new THREE.Color(0x000000, 0.0));
	
	 for ( var x=0; Width+Height == 0; x++){
		 if((window.innerWidth*0.75) <= x*20 || (window.innerHeight*0.75)<= x*21){
			 Width = x*20;			
			 Height = x*21;	
			 console.log("Width:"+Width+"	Height:"+Height);
		 }	
		 else if( x >= 50){
			 Width = window.innerWidth*0.55;
			 Height = window.innerHeight*0.55;
		 }
	 }
	 
	 renderer.setSize(Width, Height);
	 camera.aspect = window.innerWidth/window.innerHeight;
	
	 //renderer.shadowMapEnabled = true	
	
	 //Later change this back to false
	 var endGame = true; //The Game is over and you'll have to restart
	
	 var controls = new THREE.TrackballControls( camera );
	 controls.noZoom = false;
	 controls.noPan = false;
	 controls.staticMoving = true;
	 controls.dynamicDampingFactor = 0.3; 
			
	 //Sockets
	 socket = io.connect('http://localhost:9000');
	 //socket = io.connect('ec2-34-205-146-82.compute-1.amazonaws.com:9000');
	
	 //Update the Game State
	 PacMania.on('Update Game State', function(data){
		 
		 if(Game_Status == "Active"){
			 
			 //Player Text
			 if(data.PacList.length >= 1){
				 scene.add(P1Text);
			 }
			 if(data.PacList.length >= 2){
				 scene.add(P2Text);
			 }
			 if(data.PacList.length >= 3){
				 scene.add(P3Text);
			 }
			 if(data.PacList.length >= 4){
				 scene.add(P4Text);
			 }
			  
			 /* //Update the Ghost Sprites
			 var listLength = data.GhostList.length;
			 for(var x=0; x< listLength; x++){
				 if(x == 0){
					 if(scene.getObjectByName('Ghost1') == null){
						 ghost =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost.scale.set(1.75,1.75,1);
						 ghost.position.z = -2; //reset to the z-axis of -2
						 ghost.name = 'Ghost1';
						 scene.add(ghost);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost.material =  Texture;	
					 ghost.position.x = data.GhostList[x].x*xMultiplier;
					 ghost.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
				 else if(x == 1){
					 if(scene.getObjectByName('Ghost2') == null){
						 ghost2 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost2.scale.set(1.75,1.75,1);
						 ghost2.position.z = -2; //reset to the z-axis of -2
						 ghost2.name = 'Ghost2';
						 scene.add(ghost2);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
						 
						 ghost.name = 'Ghost1';
						 ghost.scale.set(1.75,1.75,1);
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost2.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost2.material =  Texture;	
					 ghost2.position.x = data.GhostList[x].x*xMultiplier;
					 ghost2.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				}
				 else if(x == 2){
					 if(scene.getObjectByName('Ghost3') == null){
						 ghost3 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost3.scale.set(1.75,1.75,1);
						 ghost3.position.z = -2; //reset to the z-axis of -2
						 ghost3.name = 'Ghost3';
						 scene.add(ghost3);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost3.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost3.material =  Texture;
					 //ghost3.name = 'Ghost2';
					 //ghost3.scale.set(1.75,1.75,1);
					 ghost3.position.x = data.GhostList[x].x*xMultiplier;
					 ghost3.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
				 else if(x == 3){
					 if(scene.getObjectByName('Ghost4') == null){
						 ghost4 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost4.scale.set(1.75,1.75,1);
						 ghost4.position.z = -2; //reset to the z-axis of -2
						 ghost4.name = 'Ghost4';
						 scene.add(ghost4);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost4.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost4.material =  Texture;
					 ghost4.position.x = data.GhostList[x].x*xMultiplier;
					 ghost4.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
				 else if(x == 4){
					 if(scene.getObjectByName('Ghost5') == null){
						 ghost5 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost5.scale.set(1.75,1.75,1);
						 ghost5.position.z = -2; //reset to the z-axis of -2
						 ghost5.name = 'Ghost5';
						 scene.add(ghost5);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost5.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost5.material =  Texture;
					 ghost5.position.x = data.GhostList[x].x*xMultiplier;
					 ghost5.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
				 else if(x == 5){
					 if(scene.getObjectByName('Ghost6') == null){
						 ghost6 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost6.scale.set(1.75,1.75,1);
						 ghost6.position.z = -2; //reset to the z-axis of -2
						 ghost6.name = 'Ghost6';
						 scene.add(ghost6);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost6.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost6.material =  Texture;
					 ghost6.position.x = data.GhostList[x].x*xMultiplier;
					 ghost6.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
				 else if(x == 6){
					 if(scene.getObjectByName('Ghost7') == null){
						 ghost7 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost7.scale.set(1.75,1.75,1);
						 ghost7.position.z = -2; //reset to the z-axis of -2
						 ghost7.name = 'Ghost7';
						 scene.add(ghost7);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost7.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost7.material =  Texture;
					 ghost7.position.x = data.GhostList[x].x*xMultiplier;
					 ghost7.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
				 else if(x == 7){
					 if(scene.getObjectByName('Ghost8') == null){
						 ghost8 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost8.scale.set(1.75,1.75,1);
						 ghost8.position.z = -2; //reset to the z-axis of -2
						 ghost8.name = 'Ghost8';
						 scene.add(ghost8);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost8.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost8.material =  Texture;
					 ghost8.position.x = data.GhostList[x].x*xMultiplier;
					 ghost8.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
				 else if(x == 8){
					 if(scene.getObjectByName('Ghost9') == null){
						 ghost9 =  new THREE.Sprite(BlinkyTexture[0]);		
						 ghost9.scale.set(1.75,1.75,1);
						 ghost9.position.z = -2; //reset to the z-axis of -2
						 ghost9.name = 'Ghost9';
						 scene.add(ghost9);		
					 }
					 //Blinky
					 if(data.GhostList[x].type == "Blinky"){
						 //Blinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[0];	
							 else
								 Texture =  BlinkyTexture[1];	
						 }
						 //Blinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[2];	
							 else
								 Texture =  BlinkyTexture[3];	
						 }
						 //Blinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[4];	
							 else
								 Texture =  BlinkyTexture[5];	
						 }
						 //Blinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  BlinkyTexture[6];	
							 else
								 Texture =  BlinkyTexture[7];	
						 }
					 }
					 //Pinky
					 else if(data.GhostList[x].type == "Pinky"){
						 //Pinky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[0];	
							 else
								 Texture =  PinkyTexture[1];	
						 }
						 //Pinky East
						 else if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[2];	
							 else
								 Texture =  PinkyTexture[3];	
						 }
						 //Pinky South
						 else if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[4];	
							 else
								 Texture =  PinkyTexture[5];	
						 }
						 //Pinky West
						 else if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  PinkyTexture[6];	
							 else
								 Texture =  PinkyTexture[7];	
						 }
					 }
					 //Inky
					 else if(data.GhostList[x].type == "Inky"){
						 //Inky North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[0];	
							 else
								 Texture =  InkyTexture[1];	
						 }
						 //Inky East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[2];	
							 else
								 Texture =  InkyTexture[3];	
						 }
						 //Inky South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[4];	
							 else
								 Texture =  InkyTexture[5];	
						 }
						 //Inky West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  InkyTexture[6];	
							 else
								 Texture =  InkyTexture[7];	
						 }
					 }
					 //Clyde
					 else if(data.GhostList[x].type == "Clyde"){
						 //Clyde North
						 if(data.GhostList[x].direction == "North"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[0];	
							 else
								 Texture =  ClydeTexture[1];	
						 }
						 //Clyde East
						 if(data.GhostList[x].direction == "East"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[2];	
							 else
								 Texture =  ClydeTexture[3];	
						 }
						 //Clyde South
						 if(data.GhostList[x].direction == "South"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[4];	
							 else
								 Texture =  ClydeTexture[5];	
						 }
						 //Clyde West
						 if(data.GhostList[x].direction == "West"){
							 if(data.GhostList[x].directionSprite %2 == 0)
								 Texture =  ClydeTexture[6];	
							 else
								 Texture =  ClydeTexture[7];	
						 }
					 }
					 else if(data.GhostList[x].type == "Courage")
						 ghost9.material.color = new THREE.Color( "rgb(200,200,50)");
				 
					 ghost9.material =  Texture;
					 ghost9.position.x = data.GhostList[x].x*xMultiplier;
					 ghost9.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				 }
			 }		 
			 
			 //Ensuring the Ghost are removed
			 if(data.GhostList.length <= 8){
				 if(scene.getObjectByName('Ghost9') != null)
						 scene.remove(ghost8);	
			 }
			 if(data.GhostList.length <= 7){
				 if(scene.getObjectByName('Ghost8') != null)
						 scene.remove(ghost8);	
			 }
			 if(data.GhostList.length <= 6){
				 if(scene.getObjectByName('Ghost7') != null)
						 scene.remove(ghost7);	
			 }
			 if(data.GhostList.length <= 5){
				 if(scene.getObjectByName('Ghost6') != null)
						 scene.remove(ghost6);	
			 }
			 if(data.GhostList.length <= 4){
				 if(scene.getObjectByName('Ghost5') != null)
						 scene.remove(ghost5);	
			 }
			 if(data.GhostList.length <= 3){
				 if(scene.getObjectByName('Ghost4') != null)
						 scene.remove(ghost4);	
			 }
			 if(data.GhostList.length <= 2){
				 if(scene.getObjectByName('Ghost3') != null)
						 scene.remove(ghost3);	
			 }
			 if(data.GhostList.length <= 1){
				 if(scene.getObjectByName('Ghost2') != null)
						 scene.remove(ghost2);	
			 }
			   */
			   
			 //Update Ghost Sprites
			 listLength = data.GhostList.length;
			 for(var x=0; x< listLength; x++){
				 //Ghost Additions
				 if(GhostList.length <= x){
						 GhostList.push(addGhost());
						 scene.add(GhostList[x]);
				 }
				 
				 //If Ghost is dead
				 if(data.GhostList[x].status == "Dead"){
					 //North
					 if(data.GhostList[x].direction == "North")
						 GhostList[x].material  =  DeadGhostTexture[0];
					 //East
					 else if(data.GhostList[x].direction == "East")
						 GhostList[x].material  =  DeadGhostTexture[1];
					 //South
					 else if(data.GhostList[x].direction == "South")
						 GhostList[x].material  =  DeadGhostTexture[2];
					 //West
					 else if(data.GhostList[x].direction == "West")
						 GhostList[x].material  =  DeadGhostTexture[3];
				 }
				 //Blinky
				 else if(data.GhostList[x].type == "Blinky"){
					 //Blinky North
					 if(data.GhostList[x].direction == "North"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  BlinkyTexture[0];	
						 else
							 GhostList[x].material  =  BlinkyTexture[1];	
					 }
					 //Blinky East
					 else if(data.GhostList[x].direction == "East"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  BlinkyTexture[2];	
						 else
							 GhostList[x].material  =  BlinkyTexture[3];	
					 }
					 //Blinky South
					 else if(data.GhostList[x].direction == "South"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  BlinkyTexture[4];	
						 else
							 GhostList[x].material  =  BlinkyTexture[5];	
					 }
					 //Blinky West
					 else if(data.GhostList[x].direction == "West"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  BlinkyTexture[6];	
						 else
							 GhostList[x].material  =  BlinkyTexture[7];	
					 }
				 }
				 //Pinky
				 else if(data.GhostList[x].type == "Pinky"){
					 //Pinky North
					 if(data.GhostList[x].direction == "North"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  PinkyTexture[0];	
						 else
							 GhostList[x].material  =  PinkyTexture[1];	
					 }
					 //Pinky East
					 else if(data.GhostList[x].direction == "East"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  PinkyTexture[2];	
						 else
							 GhostList[x].material  =  PinkyTexture[3];	
					 }
					 //Pinky South
					 else if(data.GhostList[x].direction == "South"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  PinkyTexture[4];	
						 else
							 GhostList[x].material  =  PinkyTexture[5];	
					 }
					 //Pinky West
					 else if(data.GhostList[x].direction == "West"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  PinkyTexture[6];	
						 else
							 GhostList[x].material  =  PinkyTexture[7];	
					 }
				 }
				 //Inky
				 else if(data.GhostList[x].type == "Inky"){
					 //Inky North
					 if(data.GhostList[x].direction == "North"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  InkyTexture[0];	
						 else
							 GhostList[x].material  =  InkyTexture[1];	
					 }
					 //Inky East
					 if(data.GhostList[x].direction == "East"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  InkyTexture[2];	
						 else
							 GhostList[x].material  =  InkyTexture[3];	
					 }
					 //Inky South
					 if(data.GhostList[x].direction == "South"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  InkyTexture[4];	
						 else
							 GhostList[x].material  =  InkyTexture[5];	
					 }
					 //Inky West
					 if(data.GhostList[x].direction == "West"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  InkyTexture[6];	
						 else
							 GhostList[x].material  =  InkyTexture[7];	
					 }
				 }
				 //Clyde
				 else if(data.GhostList[x].type == "Clyde"){
					 //Clyde North
					 if(data.GhostList[x].direction == "North"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  ClydeTexture[0];	
						 else
							 GhostList[x].material  =  ClydeTexture[1];	
					 }
					 //Clyde East
					 if(data.GhostList[x].direction == "East"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  ClydeTexture[2];	
						 else
							 GhostList[x].material  =  ClydeTexture[3];	
					 }
					 //Clyde South
					 if(data.GhostList[x].direction == "South"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  ClydeTexture[4];	
						 else
							 GhostList[x].material  =  ClydeTexture[5];	
					 }
					 //Clyde West
					 if(data.GhostList[x].direction == "West"){
						 if(data.GhostList[x].directionSprite %2 == 0)
							 GhostList[x].material  =  ClydeTexture[6];	
						 else
							 GhostList[x].material  =  ClydeTexture[7];	
					 }
				 }
				 else if(data.GhostList[x].type == "Courage")
					 GhostList[x].material  = new THREE.Color( "rgb(200,200,50)");
			 
				 GhostList[x].position.x = data.GhostList[x].x*xMultiplier;
				 GhostList[x].position.y = data.GhostList[x].y*yMultiplier+yShifter;
			 }			 
			 
			 //Remove Extra Ghost Sprites
			 while(GhostList.length > listLength){				 
				 scene.remove(GhostList[GhostList.length-1]);
				 GhostList.splice(GhostList.length-1, GhostList.length);				 
			 }
			 
			 //Pac Sprites
			 listLength = data.PacList.length;
			 for(var x=0; x< listLength; x++){
				 
				 if(data.PacList[x].status != "Dead"){
				 
					 if(PacList.length <= x){
						 PacList.push(addPac());
						 scene.add(PacList[x]);
						 //pellets[x].scale.set(0.75,0.75,1);
					 }
					 
					 //Pac North
					 if(data.PacList[x].direction == "North"){
						 if(data.PacList[x].directionSprite %2 == 0)
							 PacList[x].material =  PlayerTexture[0+x*8];	
						 else
							 PacList[x].material  =  PlayerTexture[1+x*8];	
					 }
					 //Pac East
					 else if(data.PacList[x].direction == "East"){
						 if(data.PacList[x].directionSprite %2 == 0)
							 PacList[x].material =  PlayerTexture[2+x*8];	
						 else
							 PacList[x].material  =  PlayerTexture[3+x*8];	
					 }
					 //Pac South
					 else if(data.PacList[x].direction == "South"){
						 if(data.PacList[x].directionSprite %2 == 0)
							 PacList[x].material =  PlayerTexture[4+x*8];	
						 else
							 PacList[x].material  =  PlayerTexture[5+x*8];	
					 }
					 //Pac West
					 else if(data.PacList[x].direction == "West"){
						 if(data.PacList[x].directionSprite %2 == 0)
							 PacList[x].material =  PlayerTexture[6+x*8];	
						 else
							 PacList[x].material  =  PlayerTexture[7+x*8];	
					 }
					 
					 if(data.PacList[x].fruitEffect == "Super PAC-MAN")
						 PacList[x].scale.set(2.5,2.5,1);
					 else
						 PacList[x].scale.set(1.75,1.75,1);
					 
					 PacList[x].position.set(data.PacList[x].x*xMultiplier,data.PacList[x].y*yMultiplier+yShifter,-2);
					 
					 //Score Keeping
					 if(x == 0){
						 //P1 Score
						 P1Score = data.PacList[x].score;
						 P1Text.parameters.text= "P1: "+P1Score;
						 P1Text.parameters.fillStyle= "#ff3333";
						 P1Text.update();		
					 }
					 else if(x == 1){
						 //P2 Score
						 P2Score = data.PacList[x].score;
						 P2Text.parameters.text= "P2: "+P2Score;
						 P2Text.parameters.fillStyle= "#4da6ff";
						 P2Text.update();		
					 }
					 else if(x == 2){
						 //P3 Score
						 P3Score = data.PacList[x].score;
						 P3Text.parameters.text= "P3: "+P3Score;
						 P3Text.parameters.fillStyle= "#1aff1a";
						 P3Text.update();		
					 }
					 else if(x == 3){
						 //P4 Score
						 P4Score = data.PacList[x].score;
						 P4Text.parameters.text= "P4: "+P4Score;
						 P4Text.parameters.fillStyle= "#cc33ff";
						 P4Text.update();		
					 }			 
				 }
				 else{ // if Pac is dead
					 if( x == 0){
						 P1Text.parameters.fillStyle= "#990000";;
						 P1Text.update();
					 }
					 else if( x == 1){
						 P2Text.parameters.fillStyle= "#0059b3";;
						 P2Text.update();		
					 }
					 else if( x == 2){
						 P3Text.parameters.fillStyle= "#009900";;
						 P3Text.update();		
					 }
					 else if( x == 3){
						 P4Text.parameters.fillStyle= "#800080";;
						 P4Text.update();		
					 }
					
					 
					 if(scene.getObjectById(PacList[x].id) != null);
							 scene.remove(PacList[x]);
				
				 }
			 }
			 
			  //Pellets
			 listLength = data.Pellet.length;
			 for(var x=0; x< listLength; x++){
				 
				 if(pellets.length <= x){
					 pellets.push(addItem());
					 scene.add(pellets[x]);
				 }
				
				 
				 if(data.Pellet[x].type == "Pellet")
					 pellets[x].scale.set(0.75,0.75,1);
				 else pellets[x].scale.set(1.75, 1.75,1);
				 
				 pellets[x].material = setItem(data.Pellet[x].type);
				 pellets[x].position.set(data.Pellet[x].x*xMultiplier,data.Pellet[x].y*yMultiplier+yShifter,-2.3);
			 }
			 
			 //Removing the extra pellets
			 while(listLength < pellets.length){
				 scene.remove(pellets[pellets.length-1]);
				 pellets.splice(pellets.length-1,1);
			 }
		 }
	 });
	 
	 //Stops the Game, it's Over
	 PacMania.on('Game Over', function(data){
		 scene.add(gameOver);
		 gameOver.position.set( 0, yShifter, 2); 
		 gameOver.scale.set( 35, 12, 1);
		 Game_Status = "Game Over";
		 PacList = [];
		 addButton(returnButton);
	 });
	 
	 //EVENT LISTENERS!!!!
	
	 //Keyboard Functions
	 function onKeyDown(event) {
		 if(Game_Status == "Active") 
			 if (event.keyCode == 38 || event.keyCode == 104 || event.keyCode ==87) { // Up Arrow - North
				 var data = { direction: "North"  };
				 PacMania.emit('Move',data);
			 }
			 else if (event.keyCode == 39  || event.keyCode == 102 || event.keyCode == 68) { // Right Arrow - East
				 var data = { direction: "East"  };
				 PacMania.emit('Move',data);
			 }
			 else if (event.keyCode == 40  || event.keyCode == 98 || event.keyCode == 83) { // Down Arrow - South
				 var data = { direction: "South"  };
				 PacMania.emit('Move',data);
			 }
			 else if (event.keyCode == 37  || event.keyCode == 100 || event.keyCode == 65) { // Left Arrow - West
				 var data = { direction: "West"  };
				 PacMania.emit('Move',data);
				 //https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
			 }
			 event.preventDefault();
	 }; 
	 document.addEventListener('keydown', onKeyDown, false);
		
	 //Window Resize Event
	 function onWindowResize(){
		 Width = Height = 0;	
		 for ( var x=0; Width+Height == 0; x++){
		 if((window.innerWidth*0.75) <= x*20 || (window.innerHeight*0.75)<= x*21){
			 Width = x*20;			
			 Height = x*21;	
			 console.log("Width:"+Width+"	Height:"+Height);
		 }	
		 else if( x >= 50){
			 Width = window.innerWidth*0.55;
			 Height = window.innerHeight*0.55;
		 }
	 }
		 renderer.setSize(Width, Height);
		 //camera.aspect = renderer.domElement.width/renderer.domElement.height;
	 }
	 window.addEventListener('resize', onWindowResize, false);
	 //https://stackoverflow.com/questions/20290402/three-js-resizing-canvas?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
	 
	 //add the output of the renderer to the html element
	 var displayCanvas = document.getElementById("WebGL-output").appendChild(renderer.domElement);
	 var context = renderer.getContext('2d');
	 context.font = "30px Arial";
	 //context.fillText("Hello World",10,50);
	 
	 //call the render function
	 renderer.render(scene, camera);
	 
	 //add spotlight for the shadows
	 var spotLight = new THREE.SpotLight(0xffffff);
	 spotLight.position.set(0, 0, 25);
	 spotLight.castShadow = false;
	 spotLight.intensity =2;
	 scene.add(spotLight);			 
	 
	 //call the render function
	 load_Start_Screen();
	 renderScene();
	 drag_objects();	 
	 loadGhosts();
	 loadPac();
	 loadItems();
	 load_Display_Pictures();
	
	 //Render the Scenes
	 function renderScene(){
		 try{
			 //Render steps
			 //render using requestAnimationFrame
			 requestAnimationFrame(renderScene);
			 renderer.render(scene, camera);
			 //scene.traverse(function (e) {});
		 }catch(e){}
	 }
	
	 //Make Objects Draggable - Additionally used as buttons
	 function drag_objects(){
		 var dragControls  = new THREE.DragControls( objects, camera, renderer.domElement );
				
			 dragControls.addEventListener( 'dragstart', function(event) {
																			 if (event.object == startButton && startButton.visble == true){
																				 console.log("Start the Game");
																				 load_Text();
																				 load_Board();
																				 load_Game_Maze_1();
																				 //Rescale and Reposition the Title
																				 Title1.position.set(0,22.95,-2);
																				 Title1.scale.set(24.5,4.5,1);																				 
																				 
																				 //Removal of the start Screen Buttons
																				 removeButton(startButton);
																				 removeButton(howToPlayButton);
																				 removeButton(creditButton);
																				 removeButton(aboutButton);
																				 
																				 //Emit the Server 
																				 PacMania.emit('Initiate Game Render');
																				 Game_Status = "Active";
																				 
																				 //Addition of the Screen Bottoms and Background Button
																				 load_Touch_Screen_Controls();
																				 addButton(bgButton);
																			 }
																			 else if (event.object == bgButton){
																				 if(backgroundState == "Original"){
																					 //Becomes Style 1
																					 BlinkyTexture = Style1Texture.slice(0, 8);
																					 PinkyTexture = Style1Texture.slice(8, 16);
																					 InkyTexture = Style1Texture.slice(16, 24);
																					 ClydeTexture = Style1Texture.slice(24, 32);
																					 
																					 //Fruits/Pellets
																					 pelletTexture = Style1Texture[Style1Texture.length-9];
																					 appleTexture = Style1Texture[Style1Texture.length-8];
																					 bananaTexture = Style1Texture[Style1Texture.length-7];
																					 cherryTexture = Style1Texture[Style1Texture.length-6];
																					 grapeTexture = Style1Texture[Style1Texture.length-5];
																					 orangeTexture = Style1Texture[Style1Texture.length-4];
																					 pearTexture = Style1Texture[Style1Texture.length-3];
																					 pretzelTexture = Style1Texture[Style1Texture.length-2];
																					 strawberryTexture = Style1Texture[Style1Texture.length-1];
																					 
																					 backgroundState ="Style 1";
																				 }
																				 else if(backgroundState == "Style 1"){
																					 BlinkyTexture = Style2Texture.slice(0, 8);
																					 PinkyTexture = Style2Texture.slice(8, 16);
																					 InkyTexture = Style2Texture.slice(16, 24);
																					 ClydeTexture = Style2Texture.slice(24, 32);
																					 
																					 //Fruits/Pellets
																					 pelletTexture = Style2Texture[Style2Texture.length-9];
																					 appleTexture = Style2Texture[Style2Texture.length-8];
																					 bananaTexture = Style2Texture[Style2Texture.length-7];
																					 cherryTexture = Style2Texture[Style2Texture.length-6];
																					 grapeTexture = Style2Texture[Style2Texture.length-5];
																					 orangeTexture = Style2Texture[Style2Texture.length-4];
																					 pearTexture = Style2Texture[Style2Texture.length-3];
																					 pretzelTexture = Style2Texture[Style2Texture.length-2];
																					 strawberryTexture = Style2Texture[Style2Texture.length-1];
																					 
																					 backgroundState ="Style 2";
																				 }
																				 else if(backgroundState == "Style 2"){
																					 BlinkyTexture = Style3Texture.slice(0, 8);
																					 PinkyTexture = Style3Texture.slice(8, 16);
																					 InkyTexture = Style3Texture.slice(16, 24);
																					 ClydeTexture = Style3Texture.slice(24, 32);
																					 
																					 backgroundState ="Style 3";
																				 }
																				 else if(backgroundState == "Style 3"){
																					 BlinkyTexture = OriginalTexture.slice(0, 8);
																					 PinkyTexture = OriginalTexture.slice(8, 16);
																					 InkyTexture = OriginalTexture.slice(16, 24);
																					 ClydeTexture = OriginalTexture.slice(24, 32);
																					 
																					 //Fruits/Pellets
																					 pelletTexture = OriginalTexture[OriginalTexture.length-9];
																					 appleTexture = OriginalTexture[OriginalTexture.length-8];
																					 bananaTexture = OriginalTexture[OriginalTexture.length-7];
																					 cherryTexture = OriginalTexture[OriginalTexture.length-6];
																					 grapeTexture = OriginalTexture[OriginalTexture.length-5];
																					 orangeTexture = OriginalTexture[OriginalTexture.length-4];
																					 pearTexture = OriginalTexture[OriginalTexture.length-3];
																					 pretzelTexture = OriginalTexture[OriginalTexture.length-2];
																					 strawberryTexture = OriginalTexture[OriginalTexture.length-1];
																					 
																					 backgroundState ="Original";
																				 }
																				  bgButton.position.set(19,22.95,-2); 
																			 }
																			 else if (event.object == joinButton && joinButton.visble == true){
																				 PacMania.emit('Add Player');
																				 console.log("Join the Game!!!!");	
																				 joinButton.position.set(12,-22.75,5);
																				 scene.remove(joinButton);
																				 joinButton.visble = false;
																			 }
																			 else if (event.object == NorthButton){
																				 var data = { direction: "North"  };
																				 PacMania.emit('Move',data);
																			 }
																			 else if (event.object == SouthButton){
																				 var data = { direction: "South"  };
																				 PacMania.emit('Move',data);
																				 console.log("Down Direction");	
																			 }
																			 else if (event.object == EastButton){
																				 var data = { direction: "East"  };
																				 PacMania.emit('Move',data);
																			 }
																			 else if (event.object == WestButton){
																				 var data = { direction: "West"  };
																				 PacMania.emit('Move',data);
																			 }
																			 else if (event.object == aboutButton){
																				 load_About_Screen();
																			 }
																			 else if (event.object == howToPlayButton){
																				 load_How_to_Play_Screen();
																			 }
																			 else if (event.object == creditButton){
																				 load_Credit_Screen();
																			 }
																			 else if (event.object == returnButton){
																				// if(Game_Status != "Game Over")
																					
																				
																				 if(Game_Status == "Game Over"){
																					 scene.remove(gameOver);
																					 scene.remove(Board);
																					 scene.remove(Outline);
																					 
																					 //Removing the extra pellets
																					 while(pellets.length > 0){
																						 scene.remove(pellets[0]);
																						 pellets.splice(0,1);
																					 }
																					 
																					 //Removing the maze
																					 while(gameMaze.length > 0){
																						 scene.remove(gameMaze[0].block);
																						 gameMaze.splice(0,1);
																					 }
																					 
																					 //Removing Background Button
																					 removeButton(bgButton);
																					 removeButton(NorthButton);
																					 removeButton(SouthButton);
																					 removeButton(EastButton);
																					 removeButton(WestButton);
																					 
																					 //Remove the Scores
																					 scene.remove(P1Text);
																					 scene.remove(P2Text);
																					 scene.remove(P3Text);
																					 scene.remove(P4Text);
																					 P1SCORE = P2SCORE = P3SCORE = P4SCORE = 0;
																					 
																					 
																					 
																					 
																					 
																				 }
																				 
																				 
																				 
																				
																				 return_to_Start_Screen();
																			
																			 }// sourceLinkButton.position.set(15,-18.5,5);
																			 else if (event.object == sourceLinkButton){
																				 //Opens the Url to the Source
																				 window.open(sourceLinkButton.url, '_blank');
																			 }
																			 else if (event.object == rightArrowButton){
																				 if( Game_Status == "About"){
																					 
																					 
																				 }
																				 else  if( Game_Status == "Credit" && sceneNumber < creditDisplayArray.length-1){
																					 sceneNumber++;
																					 textBox.parameters.text=  creditDisplayArray[sceneNumber].text;
																					 textBox.update();																					 
																					 
																					 //Display Box Updates and Scaling
																					 displayBox.material =  creditDisplayArray[sceneNumber];
																					 displayBox.scale.x  = creditDisplayArray[sceneNumber].scalingX;
																					 displayBox.scale.y  = creditDisplayArray[sceneNumber].scalingY;
																					  
																					 if(sceneNumber == creditDisplayArray.length-1)
																						 rightArrowButton.material.color  = new THREE.Color("rgb( 50, 50,50)");
																					 else
																						 rightArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Automatically you can now move to the left
																					 leftArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Update Source :Link
																					 sourceLinkButton.url = creditDisplayArray[sceneNumber].url;
																				 }
																				 else  if( Game_Status == "How to Play" && sceneNumber < htpTextArray.length-1){
																					 sceneNumber++;																					 	
																					 textBox.parameters.text=  htpTextArray[sceneNumber].text;
																					 textBox.update();
																					 
																					 //Display Box Updates and Scaling
																					 displayBox.material =  htpTextArray[sceneNumber];
																					 displayBox.scale.x  = htpTextArray[sceneNumber].scalingX;
																					 displayBox.scale.y  = htpTextArray[sceneNumber].scalingY;
																					 
																					 
																					 
																					 //Arrow Updates
																					 if(sceneNumber == htpTextArray.length-1)
																						 rightArrowButton.material.color  = new THREE.Color("rgb( 50, 50,50)");
																					 else
																						 rightArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Automatically you can now move to the left
																					 leftArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Update Source :Link
																					 //sourceLinkButton.url = htpTextArray[sceneNumber].url;
																				 }
																			 }
																			 else if (event.object == leftArrowButton){
																				 if( Game_Status == "About"){
																					 
																					 
																				 }
																				 else  if( Game_Status == "Credit" && sceneNumber > 0){
																					 sceneNumber--;
																					 textBox.parameters.text=  creditDisplayArray[sceneNumber].text;
																					 textBox.update();
																					 
																					  //Display Box Updates and Scaling
																					 displayBox.material =  creditDisplayArray[sceneNumber];
																					 displayBox.scale.x  = creditDisplayArray[sceneNumber].scalingX;
																					 displayBox.scale.y  = creditDisplayArray[sceneNumber].scalingY;																					 
																					 
																					 if(sceneNumber == 0)
																						 leftArrowButton.material.color  = new THREE.Color("rgb( 50, 50,50)");
																					 else
																						 leftArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Automatically you can now move to the right
																					 rightArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Update Source :Link
																					 sourceLinkButton.url = creditDisplayArray[sceneNumber].url;
																				 }
																				 else  if( Game_Status == "How to Play" && sceneNumber > 0){
																					 sceneNumber--;
																					 textBox.parameters.text=  htpTextArray[sceneNumber].text;
																					 textBox.update();
																					 
																					 //Display Box Updates and Scaling
																					 displayBox.material =  htpTextArray[sceneNumber];
																					 displayBox.scale.x  = htpTextArray[sceneNumber].scalingX;
																					 displayBox.scale.y  = htpTextArray[sceneNumber].scalingY;
																					 
																					 if(sceneNumber == 0)
																						 leftArrowButton.material.color  = new THREE.Color("rgb( 50, 50,50)");
																					 else
																						 leftArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Automatically you can now move to the right
																					 rightArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
																					 
																					 //Update Source :Link
																					 //sourceLinkButton.url = creditDisplayArray[sceneNumber].url;
																				 }
																			 }
																			//console.log("lol start of drag: ");
																		 });
																		 
			 dragControls.addEventListener( 'drag', function(event)   {
																			 if (event.object == startButton)
																				 startButton.position.set(startButton.posX, startButton.posY, startButton.posZ);
																			 else if (event.object == bgButton)
																				 bgButton.position.set(bgButton.posX, bgButton.posY, bgButton.posZ);
																			 else if (event.object == NorthButton)
																				 NorthButton.position.set(NorthButton.posX, NorthButton.posY, NorthButton.posZ);
																			 else if (event.object == SouthButton)
																				 SouthButton.position.set(SouthButton.posX, SouthButton.posY, SouthButton.posZ);	 
																			 else if (event.object == EastButton)
																				 EastButton.position.set(EastButton.posX, EastButton.posY, EastButton.posZ);
																			 else if (event.object == WestButton)
																				 WestButton.position.set(WestButton.posX, WestButton.posY, WestButton.posZ);
																			 else if (event.object == aboutButton)
																				 aboutButton.position.set(aboutButton.posX, aboutButton.posY, aboutButton.posZ);
																			 else if (event.object == howToPlayButton)
																				 howToPlayButton.position.set(howToPlayButton.posX, howToPlayButton.posY, howToPlayButton.posZ);
																			 else if (event.object == creditButton)
																				 creditButton.position.set(creditButton.posX, creditButton.posY, creditButton.posZ);
																			 else if (event.object == returnButton)
																				 returnButton.position.set(returnButton.posX, returnButton.posY, returnButton.posZ);
																			 else if (event.object == sourceLinkButton)
																				  sourceLinkButton.position.set(sourceLinkButton.posX, sourceLinkButton.posY, sourceLinkButton.posZ);
																			 else if (event.object == rightArrowButton)
																				 rightArrowButton.position.set(rightArrowButton.posX, rightArrowButton.posY, rightArrowButton.posZ);
																			 else if (event.object == leftArrowButton)
																				 leftArrowButton.position.set(leftArrowButton.posX, leftArrowButton.posY, leftArrowButton.posZ);
																		 });
																		
			 dragControls.addEventListener( 'dragend', function(event)   {});
																		 
			 //console.log(dragControls);
			 //https://www.learnthreejs.com/drag-drop-dragcontrols-mouse/
	 }
	 
	 //Upload the Ghosts Sprite Sheets into the Texture Array
	 function loadGhosts(){
		 //Sprites
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 //---------- Original Sprites --------------------------
		 
		 //Blinky Sprites
		 //Blinky North
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 //Blinky East
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 //Blinky South
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 //Blinky West
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Blinky/BlinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(BlinkyText);
		 
		 BlinkyTexture = OriginalTexture.slice(0, 8);
		 
		 //Pinky Sprites
		 //Pinky North
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 //Pinky East
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 //Pinky South
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 //Pinky West
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Pinky/PinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(PinkyText);
		 
		 PinkyTexture = OriginalTexture.slice(8, 16);
		 
		 //Inky Sprites
		 //Inky North
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 //Inky East
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 //Inky South
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 //Inky West
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Inky/InkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(InkyText);
		 
		 InkyTexture = OriginalTexture.slice(16, 24);
		 
		 //Clyde Sprites
		 //Clyde North
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);
		 //Clyde East
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);
		 //Clyde South
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);
		 //Clyde West
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/Clyde/ClydeL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(ClydeText);	 
		 
		 ClydeTexture = OriginalTexture.slice(24, 32);
		 
		 //Dead Ghost Eyes Texture
		 //North
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/ghostDeadNorth.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 var tx =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(tx);	
		 //East
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/ghostDeadEast.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 tx =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(tx);	
		 //South
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/ghostDeadSouth.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 tx =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(tx);	
		 //West
		 Texture = loader.load( 'Images/OriginalSprites/Ghosts/ghostDeadWest.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 tx =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(tx);	
		 DeadGhostTexture = OriginalTexture.slice(32, 36);
		 
		 
		 //---------------------Style 1 Sprites Shiny!!!!---------------------
		 
		 //Blinky North
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 //Blinky East
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 //Blinky South
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 //Blinky West
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Blinky/BlinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(BlinkyText);
		 
		 //Pinky Sprites
		 //Pinky North
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 //Pinky East
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 //Pinky South
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 //Pinky West
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Pinky/PinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(PinkyText);
		 
		 //Inky Sprites
		 //Inky North
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 //Inky East
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 //Inky South
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 //Inky West
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Inky/InkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(InkyText);
		 
		 //Clyde Sprites
		 //Clyde North
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 //Clyde East
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 //Clyde South
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 //Clyde West
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style1/Ghosts/Clyde/ClydeL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style1Texture.push(ClydeText);
		 
		 
		 //---------------------Style 2 3D Shiny!!!!---------------------
		 
		 //Blinky North
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 //Blinky East
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 //Blinky South
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 //Blinky West
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Blinky/BlinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(BlinkyText);
		 
		 //Pinky Sprites
		 //Pinky North
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 //Pinky East
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 //Pinky South
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 //Pinky West
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Pinky/PinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(PinkyText);
		 
		 //Inky Sprites
		 //Inky North
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 //Inky East
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 //Inky South
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 //Inky West
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Inky/InkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(InkyText);
		 
		 //Clyde Sprites
		 //Clyde North
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 //Clyde East
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 //Clyde South
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 //Clyde West
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style2/Ghosts/Clyde/ClydeL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style2Texture.push(ClydeText);
		 
		 //---------------------Style 3 Ghost Human!!!---------------------
		 
		 //Blinky North
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 //Blinky East
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 //Blinky South
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 //Blinky West
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Blinky/BlinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 BlinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(BlinkyText);
		 
		 //Pinky Sprites
		 //Pinky North
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 //Pinky East
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 //Pinky South
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 //Pinky West
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Pinky/PinkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 PinkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(PinkyText);
		 
		 //Inky Sprites
		 //Inky North
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 //Inky East
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 //Inky South
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 //Inky West
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Inky/InkyL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 InkyText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(InkyText);
		 
		 //Clyde Sprites
		 //Clyde North
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeU1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeU2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
		 //Clyde East
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeR1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeR2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
		 //Clyde South
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeD1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeD2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
		 //Clyde West
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeL1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
		 Texture = loader.load( 'Images/Style3/Ghosts/Clyde/ClydeL2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 ClydeText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 Style3Texture.push(ClydeText);
	 }
	
	 //Upload the Pac-mans Sprite Sheets into the Texture Array
	 function loadPac(){
		 PacList=[], PlayerTexture=[];
		 
		 //Sprites
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 //---------- Original Sprites --------------------------
		 //Pac 1 Sprites
		 //P1 North
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_U1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_U2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P1 East
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_R1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_R2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P1 South
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_D1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_D2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P1 West
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_L1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P1/P1_L2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 
		 //Pac 2 Sprites
		 //P2 North
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_U1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_U2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P2 East
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_R1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_R2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P2 South
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_D1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_D2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P2 West
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_L1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P2/P2_L2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 
		 //Pac 3 Sprites
		 //P3 North
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_U1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_U2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P3 East
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_R1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_R2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P3 South
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_D1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_D2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P3 West
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_L1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P3/P3_L2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 
		 //Pac 4 Sprites
		 //P4 North
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_U1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_U2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P4 East
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_R1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_R2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P4 South
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_D1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_D2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 //P4 West
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_L1.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 Texture = loader.load( 'Images/OriginalSprites/Pac-Man Sprites/P4/P4_L2.png' );
		 Texture.minFilter = THREE.LinearFilter;
		 pacText =  new THREE.SpriteMaterial( { map: Texture, color: 0xffffff } );
		 OriginalTexture.push(pacText);
		 
		 PlayerTexture = OriginalTexture.slice(36, 68);
	 }
     
	 //Upload the Items/Fruits Sprite Sheets into the Texture Arrray
	 function loadItems(){
		 //Sprites
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 //---------- Original Sprites --------------------------
		 //Pellets
		 var texture = loader.load( 'Images/Fruits/pellets.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pelletTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(pelletTexture);
		 //Apple
		 texture = loader.load( 'Images/Fruits/Apple.png' );
		 texture.minFilter = THREE.LinearFilter;
		 appleTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(appleTexture);		 
		 //Banana
		 texture = loader.load( 'Images/Fruits/Banana.png' );
		 texture.minFilter = THREE.LinearFilter;
		 bananaTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(bananaTexture);		 
		 //Cherry
		 texture = loader.load( 'Images/Fruits/Cherry.png' );
		 texture.minFilter = THREE.LinearFilter;
		 cherryTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(cherryTexture);		 
		 //Grape
		 texture = loader.load( 'Images/Fruits/Grape.png' );
		 texture.minFilter = THREE.LinearFilter;
		 grapeTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(grapeTexture);
		 //Orange
		 texture = loader.load( 'Images/Fruits/Orange.png' );
		 texture.minFilter = THREE.LinearFilter;
		 orangeTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(orangeTexture);		 
		 //Pear
		 texture = loader.load( 'Images/Fruits/Pear.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pearTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(pearTexture);		 
		 //Pretzel
		 texture = loader.load( 'Images/Fruits/Pretzel.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pretzelTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(pretzelTexture);		 
		 //Strawberry
		 texture = loader.load( 'Images/Fruits/Strawberry.png' );
		 texture.minFilter = THREE.LinearFilter;
		 strawberryTexture = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 OriginalTexture.push(strawberryTexture);		 
		 
		 //---------------------Style 1 Sprites Shiny!!!!---------------------
		 //Pellets
		 texture = loader.load( 'Images/Style1/Fruits/pellets.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 //Apple
		 texture = loader.load( 'Images/Style1/Fruits/Apple.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 //Banana
		 texture = loader.load( 'Images/Style1/Fruits/Banana.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 //Cherry
		 texture = loader.load( 'Images/Style1/Fruits/Cherry.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 //Grape
		 //Skipping Grapes for now and re-entering the Grape texture
		 texture = loader.load( 'Images/Fruits/Grape.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 //Orange
		 texture = loader.load( 'Images/Style1/Fruits/Orange.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 //Pear
		 texture = loader.load( 'Images/Style1/Fruits/Pear.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 //Pretzel
		 texture = loader.load( 'Images/Fruits/Pretzel.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);		 
		 //Strawberry
		 texture = loader.load( 'Images/Style1/Fruits/Strawberry.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style1Texture.push(t);
		 
		 //---------------------Style 2 Sprites 3D Shiny!!!!---------------------
		 //Pellets
		 texture = loader.load( 'Images/Style2/Fruits/pellets.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 //Apple
		 texture = loader.load( 'Images/Style2/Fruits/Apple.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 //Banana
		 texture = loader.load( 'Images/Style2/Fruits/Banana.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 //Cherry
		 texture = loader.load( 'Images/Style2/Fruits/Cherry.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 //Grape
		 //Skipping Grapes for now and re-entering the Grape texture
		 texture = loader.load( 'Images/Fruits/Grape.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 //Orange
		 texture = loader.load( 'Images/Style2/Fruits/Orange.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 //Melon
		 texture = loader.load( 'Images/Style2/Fruits/Melon.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 //Pretzel
		 //Skipping Grapes for now and re-entering the Grape texture
		 texture = loader.load( 'Images/Fruits/Pretzel.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);		 
		 //Strawberry
		 texture = loader.load( 'Images/Style2/Fruits/Strawberry.png' );
		 texture.minFilter = THREE.LinearFilter;
		 t = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 Style2Texture.push(t);
		 
		 //---------------- Game Over -----------------------
		 texture = loader.load( 'Images/Game Over.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var go = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
	 }
	
	 //Upload the Game Back Board
	 function load_Board(){		 
		 //Load Board
		 var planeGeometry = new THREE.PlaneBufferGeometry (40.5, 40,0);
		 var planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000}); //RGB
		 Board = new THREE.Mesh(planeGeometry, planeMaterial);
		 Board.position.set(0,yShifter,-2.4); //xyz
		 scene.add(Board);

		 //Outline
		 var OutlineGeometry = new THREE.PlaneBufferGeometry (49, 42,0);
		 var OutlineMaterial = new THREE.MeshBasicMaterial({color: 0x050538}); //RGB
		 Outline = new THREE.Mesh(OutlineGeometry, OutlineMaterial);
		 Outline.position.set(0,yShifter,-2.5); //xyz
		 scene.add(Outline);
	 }
	 
	 //Upload the Text
	 function load_Text(){
		 //Players Score
		 P1Score = P2Score = P3Score = P4Score = 0;
		 
		 //P1Text
		 P1Text = new THREEx.DynamicText2DObject();
		 P1Text.parameters.text= "P1: "+P1Score;
		 P1Text.parameters.font= "55px Arial";
		 P1Text.parameters.fillStyle= "Red";
		 P1Text.parameters.align = "center";
		 P1Text.dynamicTexture.canvas.width = 256;
		 P1Text.dynamicTexture.canvas.height = 256;
		 P1Text.position.set(-18,18,-3);
		 P1Text.scale.set(7.5,7.25,1);
		 P1Text.update();
		 //scene.add(P1Text);
		 //console.log(P1Text);
		 
		 //P2Text
		 P2Text = new THREEx.DynamicText2DObject();
		 P2Text.parameters.text= "P2: "+P2Score;
		 P2Text.parameters.font= "55px Arial";
		 P2Text.parameters.fillStyle= "DodgerBlue";
		 P2Text.parameters.align = "center";
		 P2Text.dynamicTexture.canvas.width = 256;
		 P2Text.dynamicTexture.canvas.height = 256;
		 P2Text.position.set(-6,18,-3);
		 P2Text.scale.set(7.5,7.25,1);
		 P2Text.update();
		 //scene.add(P2Text);
		 
		 //P3Text
		 P3Text = new THREEx.DynamicText2DObject();
		 P3Text.parameters.text= "P3: "+P3Score;
		 P3Text.parameters.font= "55px Arial";
		 P3Text.parameters.fillStyle= "Green";
		 P3Text.parameters.align = "center";
		 P3Text.dynamicTexture.canvas.width = 256;
		 P3Text.dynamicTexture.canvas.height = 256;
		 P3Text.position.set(6,18,-3);
		 P3Text.scale.set(7.5,7.25,1);
		 P3Text.update();
		 //scene.add(P3Text);
		 
		 //P4Text
		 P4Text = new THREEx.DynamicText2DObject();
		 P4Text.parameters.text= "P4: "+P4Score;
		 P4Text.parameters.font= "55px Arial";
		 P4Text.parameters.fillStyle= "DarkOrchid ";
		 P4Text.parameters.align = "center";
		 P4Text.dynamicTexture.canvas.width = 256;
		 P4Text.dynamicTexture.canvas.height = 256;
		 P4Text.position.set(18,18,-3);
		 P4Text.scale.set(7.5,7.25,1);
		 P4Text.update();
		 //scene.add(P4Text);
	 }

	 //Upload the Buttons
	 function load_Buttons(){
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 
		 //Change Background Button
		 //bgButton.parameters.text= "Change Sprites";
		 T = loader.load( 'Images/bgButton.png' );
		 T.minFilter = THREE.LinearFilter;
		 var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
		 bgButton = new THREE.Sprite(T1);	
		 bgButton.posX = 19;
		 bgButton.posY =  22.95;
		 bgButton.posZ = -2;
		 bgButton.position.set(bgButton.posX, bgButton.posY, bgButton.posZ);
		 bgButton.position.set(19,22.95,-2); 
		 bgButton.scale.set(14,5,1);		  
		 
		 //Start Button
		 startButton = new THREEx.DynamicText2DObject()
		 startButton.parameters.text= "Start Game";
		 startButton.parameters.font= "135px Arial";
		 startButton.parameters.fillStyle= "#FF0000";
		 startButton.parameters.align = "center";
		 startButton.dynamicTexture.canvas.width = 1024;
		 startButton.dynamicTexture.canvas.height = 256;
		 startButton.posX = 0;
		 startButton.posY = -3;
		 startButton.posZ = 5;
		 startButton.position.set(startButton.posX, startButton.posY, startButton.posZ);
		 startButton.scale.set(16,4,1);
		 startButton.parameters.lineHeight=0.6;
		 startButton.update();
		 startButton.name = "startButton";
		 startButton.visble = true;
		 
		 //About Button
		 aboutButton = new THREEx.DynamicText2DObject()
		 aboutButton.parameters.text= "About";
		 aboutButton.parameters.font= "135px Arial";
		 aboutButton.parameters.fillStyle= "#FF1493"; //Pinky
		 aboutButton.parameters.align = "center";
		 aboutButton.dynamicTexture.canvas.width = 1024;
		 aboutButton.dynamicTexture.canvas.height = 256;
		 aboutButton.posX = -15;
		 aboutButton.posY = -9;
		 aboutButton.posZ = 5;
		 aboutButton.position.set(aboutButton.posX, aboutButton.posY, aboutButton.posZ);
		 aboutButton.scale.set(16,4,1);
		 aboutButton.parameters.lineHeight=0.6;
		 aboutButton.update();
		 aboutButton.name = "aboutButton";
		 aboutButton.visble = true;
		 
		 //Credit Button
		 creditButton = new THREEx.DynamicText2DObject()
		 creditButton.parameters.text= "Credits";
		 creditButton.parameters.font= "135px Arial";
		 creditButton.parameters.fillStyle= "#FF8C00";
		 creditButton.parameters.align = "center";
		 creditButton.dynamicTexture.canvas.width = 1024;
		 creditButton.dynamicTexture.canvas.height = 256;
		 creditButton.posX = 0;
		 creditButton.posY = -15;
		 creditButton.posZ = 5;
		 creditButton.position.set(creditButton.posX, creditButton.posY, creditButton.posZ);
		 creditButton.scale.set(16,4,1);
		 creditButton.parameters.lineHeight=0.6;
		 creditButton.update();
		 creditButton.name = "creditButton";
		 creditButton.visble = true;
		 
		 //How To Play Button
		 howToPlayButton = new THREEx.DynamicText2DObject()
		 howToPlayButton.parameters.text= "How To Play";
		 howToPlayButton.parameters.font= "135px Arial";
		 howToPlayButton.parameters.fillStyle= "#1E90FF";
		 howToPlayButton.parameters.align = "center";
		 howToPlayButton.dynamicTexture.canvas.width = 1024;
		 howToPlayButton.dynamicTexture.canvas.height = 256;
		 howToPlayButton.posX = 13.75;
		 howToPlayButton.posY = -9;
		 howToPlayButton.posZ = 5;
		 howToPlayButton.position.set(howToPlayButton.posX, howToPlayButton.posY, howToPlayButton.posZ);
		 howToPlayButton.scale.set(16,4,1);
		 howToPlayButton.parameters.lineHeight=0.6;
		 howToPlayButton.update();
		 howToPlayButton.name = "creditButton";
		 howToPlayButton.visble = true;
		 
		 //Return Button
		 returnButton = new THREEx.DynamicText2DObject()
		 returnButton.parameters.text= "Return to Start Screen";
		 returnButton.parameters.font= "86px Arial";
		 returnButton.parameters.fillStyle= "#F0FEF0";
		 returnButton.parameters.align = "center";
		 returnButton.dynamicTexture.canvas.width = 1024;
		 returnButton.dynamicTexture.canvas.height = 256;
		 returnButton.posX = 0;
		 returnButton.posY = -23;
		 returnButton.posZ = 5;
		 returnButton.position.set(returnButton.posX, returnButton.posY, returnButton.posZ);
		 returnButton.scale.set(16,6,1);
		 returnButton.update();
		 returnButton.visble = true;
		 returnButton.name = "returnButton";
		 
		 //playAgainButton
		 playAgainButton = new THREEx.DynamicText2DObject()
		 playAgainButton.parameters.text= "Play Again";
		 playAgainButton.parameters.font= "86px Arial";
		 playAgainButton.parameters.fillStyle= "#F0FEF0";
		 playAgainButton.parameters.align = "center";
		 playAgainButton.dynamicTexture.canvas.width = 1024;
		 playAgainButton.dynamicTexture.canvas.height = 256;
		 playAgainButton.posX = 0;
		 playAgainButton.posY = -23;
		 playAgainButton.posZ = 5;
		 playAgainButton.position.set(playAgainButton.posX, playAgainButton.posY, playAgainButton.posZ);
		 playAgainButton.scale.set(16,6,1);
		 playAgainButton.update();
		 playAgainButton.visble = true;
		 playAgainButton.name = "playAgainButton";
		 
		 //titleSectionText
		 titleSectionText = new THREEx.DynamicText2DObject()
		 titleSectionText.parameters.text= "";
		 titleSectionText.parameters.font= "85px Arial";
		 titleSectionText.parameters.fillStyle= "#F0FEF0";
		 titleSectionText.parameters.align = "center";
		 titleSectionText.dynamicTexture.canvas.width = 1024;
		 titleSectionText.dynamicTexture.canvas.height = 256;
		 titleSectionText.position.set(0,-22,5);
		 titleSectionText.scale.set(15,5,1);
		 titleSectionText.update();
		 titleSectionText.visble = true;
		 titleSectionText.name = "titleSectionText";
		 
		 //textBox
		 textBox = new THREEx.DynamicText2DObject()
		 textBox.parameters.text= "";
		 textBox.parameters.font= "45px Arial";
		 textBox.parameters.fillStyle= "#FF24b3";
		 textBox.parameters.align = "center";
		 textBox.dynamicTexture.canvas.width = 1024;
		 textBox.dynamicTexture.canvas.height = 1024;
		 textBox.position.set(0,-22,5);
		 //textBox.scale.set(6,5,1);
		 textBox.update();
		 textBox.visble = true;
		 textBox.name = "textBox";
		 
		 //Source Link Button
		 sourceLinkButton = new THREEx.DynamicText2DObject()
		 sourceLinkButton.parameters.text= "Link to the Source";
		 sourceLinkButton.parameters.font= "85px Arial";
		 sourceLinkButton.parameters.fillStyle= "#FBFF9F";
		 sourceLinkButton.parameters.align = "center";
		 sourceLinkButton.dynamicTexture.canvas.width = 1024;
		 sourceLinkButton.dynamicTexture.canvas.height = 256;
		 sourceLinkButton.posX = 15;
		 sourceLinkButton.posY = -18;
		 sourceLinkButton.posZ = 1;
		 sourceLinkButton.position.set(sourceLinkButton.posX, sourceLinkButton.posY, sourceLinkButton.posZ);
		 sourceLinkButton.scale.set(15,5,1);
		 sourceLinkButton.update();
		 sourceLinkButton.visble = true;
		 sourceLinkButton.url = null;
		 sourceLinkButton.name = "sourceLinkButton";
	 }

	 //Upload Game Maze 1
	 function load_Game_Maze_1(){
		 gameMaze=[];
		 
		 //Block 0
		 var b = { x: -3, y: 10, type:"top corner", block: null }
		 gameMaze.push(b);
		 
		 //Block 1
		 b = { x: -9, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 2
		 b = { x: -8, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 3
		 b = { x: -6, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 4
		 b = { x: -5, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 5
		 b = { x: -3, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 6
		 b = { x: -1, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 7
		 b = { x: 0, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 8
		 b = { x: 1, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 9
		 b = { x: 3, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 10
		 b = { x: 4, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 11
		 b = { x: 5, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 12
		 b = { x: 7, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 13
		 b = { x: 8, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 14
		 b = { x: 9, y: 9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 15
		 b = { x: -9, y: 8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 16
		 b = { x: 0, y: 8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 17
		 b = { x: 3, y: 8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 18
		 b = { x: 5, y: 8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 19
		 b = { x: 8, y: 8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 20
		 b = { x: -9, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 21
		 b = { x: -7, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 22
		 b = { x: -6, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 23
		 b = { x: -4, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 24
		 b = { x: -2, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 25
		 b = { x: 2, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 26
		 b = { x: 3, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 27
		 b = { x: 5, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 28
		 b = { x: 6, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 29
		 b = { x: 10, y: 7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 30
		 b = { x: -4, y: 6, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 31
		  b = { x: 0, y: 6, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 32
		  b = { x: 8, y: 6, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 33
		  b = { x: -10, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 34
		 b = { x: -9, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 35
		 b = { x: -8, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 36
		 b = { x: -6, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 37
		 b = { x: -5, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 38
		 b = { x: -4, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 39
		 b = { x: -2, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 40
		 b = { x: 0, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 41
		 b = { x: 2, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 42
		 b = { x: 3, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 43
		 b = { x: 4, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 44
		 b = { x: 5, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 45
		 b = { x: 6, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 46
		 b = { x: 8, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 47
		 b = { x: 9, y: 5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 48
		 b = { x: -10, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 49
		 b = { x: -9, y: 3, type:"null", block: null }
		 gameMaze.push(b);		 
		 
		 //Block 50
		 b = { x: -8, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 51
		 b = { x: -6, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 52
		 b = { x: -5, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 53
		 b = { x: -4, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 54
		 b = { x: -2, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 55
		 b = { x: -1, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 56
		 b = { x: 1, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 57
		 b = { x: 2, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 58
		 b = { x: 3, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 59
		 b = { x: 5, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 60
		 b = { x: 6, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 61
		 b = { x: 7, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 62
		 b = { x: 9, y: 3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 63
		 b = { x: -5, y: 2, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 64
		 b = { x: 5, y: 2, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 65
		 b = { x: -9, y: 1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 66
		 b = { x: -8, y: 1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 67
		 b = { x: -7, y: 1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 68
		 b = { x: -3, y: 1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 69
		 b = { x: 3, y: 1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 70
		 b = { x: 7, y: 1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 71
		 b = { x: 9, y: 1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 72
		 b = { x: -9, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 73
		 b = { x: -8, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 74
		 b = { x: -7, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 75
		 b = { x: -5, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 76
		 b = { x: -3, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 77
		 b = { x: 3, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 78
		 b = { x: 5, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 79
		 b = { x: 7, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 80
		 b = { x: 9, y: 0, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 81
		 b = { x: -7, y: -1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 82
		  b = { x: -5, y: -1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 83
		  b = { x: 9, y: -1, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 84
		 b = { x: -9, y: -2, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 85
		  b = { x: -3, y: -2, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 86
		  b = { x: 3, y: -2, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 87
		  b = { x: 4, y: -2, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 88
		  b = { x: 5, y: -2, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 89
		  b = { x: 7, y: -2, type:"null", block: null }
		 gameMaze.push(b);		 
		 
		 //Block 90
		 b = { x: -9, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 91
		 b = { x: -7, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 92
		  b = { x: -6, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 93
		  b = { x: -5, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 94
		  b = { x: -3, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 95
		  b = { x: -2, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 96
		  b = { x: -1, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 97
		  b = { x: 1, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 98
		  b = { x: 2, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 99
		  b = { x: 3, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 100
		  b = { x: 7, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 101
		  b = { x: 8, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 102
		  b = { x: 9, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 103
		  b = { x: 10, y: -3, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 104
		  b = { x: 1, y: -4, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 105
		 b = { x: 2, y: -4, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 106
		 b = { x: 3, y: -4, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 107
		 b = { x: 5, y: -4, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 108
		 b = { x: -10, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 109
		 b = { x: -8, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 110
		 b = { x: -7, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 111
		 b = { x: -5, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 112
		 b = { x: -4, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 113
		 b = { x: -3, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 114
		 b = { x: -2, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 115
		 b = { x: -1, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 116
		 b = { x: 5, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 117
		 b = { x: 7, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 118
		 b = { x: 8, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 119
		 b = { x: 9, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 120
		 b = { x: 10, y: -5, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 121
		 b = { x: -5, y: -6, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 122
		 b = { x: 1, y: -6, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 123
		 b = { x: 2, y: -6, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 124
		 b = { x: 3, y: -6, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 125
		 b = { x: -9, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 126
		 b = { x: -7, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 127
		 b = { x: -5, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 128
		 b = { x: -3, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 129
		 b = { x: -2, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 130
		 b = { x: -1, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 131
		 b = { x: 1, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 132
		 b = { x: 5, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 133
		 b = { x: 7, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 134
		 b = { x: 8, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 135
		 b = { x: 9, y: -7, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 136
		 b = { x: -5, y: -8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 137
		 b = { x: -4, y: -8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 138
		 b = { x: -3, y: -8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 139
		 b = { x: 3, y: -8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 140
		 b = { x: 4, y: -8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 141
		 b = { x: 5, y: -8, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 142
		 b = { x: -9, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 143
		 b = { x: -7, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 144
		 b = { x: -5, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 145
		 b = { x: -4, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 146
		 b = { x: -1, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 147
		 b = { x: 0, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 148
		 b = { x: 1, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 149
		 b = { x: 5, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 150
		 b = { x: 7, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 151
		 b = { x: 8, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 152
		 b = { x: 9, y: -9, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 153
		 b = { x: -2, y: -10, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 154
		 b = { x: -1, y: -10, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 155
		 b = { x: 0, y: -10, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 156
		 b = { x: 1, y: -10, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 157
		 b = { x: 2, y: -10, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 158
		 b = { x: 3, y: -10, type:"null", block: null }
		 gameMaze.push(b);
		 
		 //Block 159 - Portal
		 b = { x: 4, y: 8, type:"Portal", block: null }
		 gameMaze.push(b);
		 
		 //Block 160 - Portal
		 b = { x: -4, y: -7, type:"Portal", block: null }
		 gameMaze.push(b);
		 
		 //Block 161 - Portal
		 b = { x: -10, y: 4, type:"Portal", block: null }
		 gameMaze.push(b);
		 
		 //Block 162 - Portal
		 b = { x: 10, y: -4, type:"Portal", block: null }
		 gameMaze.push(b);
		 
		 //Block 163 - Yard
		 b = { x: -1, y: 1, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 164 - Yard
		 b = { x: 0, y: 1, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 165 - Yard
		 b = { x: 1, y: 1, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 166 - Yard
		 b = { x: -1, y: 0, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 167 - Yard
		 b = { x: 0, y: 0, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 168 - Yard
		 b = { x: 1, y: 0, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 169 - Yard
		 b = { x: -1, y: -1, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 170 - Yard
		 b = { x: 0, y: -1, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 //Block 171 - Yard
		 b = { x: 1, y: -1, type:"Ghost Yard", block: null }
		 gameMaze.push(b);
		 
		 
		 
		 var blockGeometry = new THREE.PlaneBufferGeometry (1.5, 1.5,0);
		 var blockMaterial = new THREE.MeshBasicMaterial({color: 0x2252df}); //RGB
		 var portalMaterial = new THREE.MeshBasicMaterial({color: 0xff528f}); //RGB
		 var yardMaterial = new THREE.MeshBasicMaterial({color: 0x55ff5f}); //RGB
		 
		 for(var x = 0; x< gameMaze.length; x++){
			 if(gameMaze[x].type == "Portal")
				 gameMaze[x].block = new THREE.Mesh(blockGeometry, portalMaterial);
			 else if(gameMaze[x].type == "Ghost Yard")
				 gameMaze[x].block = new THREE.Mesh(blockGeometry, yardMaterial);
			 else
				gameMaze[x].block = new THREE.Mesh(blockGeometry, blockMaterial);
			
			 scene.add(gameMaze[x].block);
			 gameMaze[x].block.position.set(gameMaze[x].x*xMultiplier, gameMaze[x].y*yMultiplier+yShifter, -2);
		 }
		 
	 }
	 
	 //Creates four hidden buttons that allow for the touch screen controls to operate normally
	 function load_Touch_Screen_Controls(){
		 var rectShape, zPosition = -3.5;
		 var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		 
		 //North Touch Screen Button
		 rectShape = new THREE.Shape();
		 //rectShape.moveTo( X, Y );
		 rectShape.moveTo( -20, 15-yShifter );
		 rectShape.lineTo( -5, 2-yShifter );
		 rectShape.lineTo( 5, 2-yShifter  );
		 rectShape.lineTo( 20, 15-yShifter );
		 rectShape.lineTo( -20, 15-yShifter );
		 var topGeometry = new THREE.ShapeGeometry( rectShape );
		 NorthButton = new THREE.Mesh(topGeometry, material);
		 //NorthButton.material.transparent  = true;
		 NorthButton.material.opacity = 0.2;
		 NorthButton.posX = 0;
		 NorthButton.posY =  yShifter+2;
		 NorthButton.posZ = zPosition;
		 NorthButton.position.set(NorthButton.posX, NorthButton.posY, NorthButton.posZ);		
		 addButton(NorthButton);
		 
		 
		 //South Touch Screen Button
		 rectShape = new THREE.Shape();
		 //rectShape.moveTo( X, Y );
		 rectShape.moveTo( -20, -23-yShifter );
		 rectShape.lineTo( -5, -11-yShifter );
		 rectShape.lineTo( 5, -11-yShifter  );
		 rectShape.lineTo( 20, -23-yShifter );
		 rectShape.lineTo( -20, -23-yShifter );
		 var bottomGeometry = new THREE.ShapeGeometry( rectShape );
		 SouthButton = new THREE.Mesh(bottomGeometry, material);
		 //SouthButton.material.opacity = 0.2;
		 //SouthButton.material.transparent  = true;
		 SouthButton.posX = 0;
		 SouthButton.posY =  yShifter+1.25;
		 SouthButton.posZ = zPosition;
		 SouthButton.position.set(SouthButton.posX, SouthButton.posY, SouthButton.posZ);				 
		 scene.add(SouthButton);
		 objects.push(SouthButton);
		 addButton(SouthButton);
		 
		 //West Touch Screen Button
		 rectShape = new THREE.Shape();
		 //rectShape.moveTo( X, Y );
		 rectShape.moveTo( -13, 17-yShifter );
		 rectShape.lineTo( 0, 6-yShifter );
		 rectShape.lineTo( 0, -6-yShifter  );
		 rectShape.lineTo( -13, -17-yShifter );
		 rectShape.lineTo( -13, 17-yShifter );
		 var leftGeometry = new THREE.ShapeGeometry( rectShape );
		 WestButton = new THREE.Mesh(leftGeometry, material);
		 WestButton.posX = -9;
		 WestButton.posY =  yShifter-2;
		 WestButton.posZ = zPosition;
		 WestButton.position.set(WestButton.posX, WestButton.posY, WestButton.posZ);		
		 addButton(WestButton);
		 
		 //East Touch Screen Button
		 rectShape = new THREE.Shape();
		 //rectShape.moveTo( X, Y );
		 rectShape.moveTo( 13, 17-yShifter );
		 rectShape.lineTo( 0, 6-yShifter );
		 rectShape.lineTo( 0, -6-yShifter  );
		 rectShape.lineTo( 13, -17-yShifter );
		 rectShape.lineTo( 13, 17-yShifter );
		 var leftGeometry = new THREE.ShapeGeometry( rectShape );
		 EastButton = new THREE.Mesh(leftGeometry, material);
		 EastButton.posX = 9;
		 EastButton.posY =  yShifter-2;
		 EastButton.posZ = zPosition;
		 EastButton.position.set(EastButton.posX, EastButton.posY, EastButton.posZ);		 
		 addButton(EastButton);
	 }
	  
	 //From Pacman 3D- Creates/Returns the Pellets
	 var createDot = function () {
		 return function () {
			 //Pellets lol I made this one too!!! :D
			 //Loader for Sprites
			 var loader = new THREE.TextureLoader();
			 loader.crossOrigin = true;
			 var Texture00 = loader.load( 'Images/Fruits/pellets.png' );
			 Texture00.minFilter = THREE.LinearFilter;
			 var Pells = new THREE.SpriteMaterial( { map: Texture00, color: 0xffffff } );
		 	 Pellets =  new THREE.Sprite(Pells);	
		 	 Pellets.scale.set(0.5,0.25,1);
			 return Pellets;
		 };
	 }();
	 
	 //
	 function addItem(){
		 var item;
		 var text = new THREE.SpriteMaterial( { map: pelletTexture, color: 0xffffff } );
		 item =  new THREE.Sprite(text);	
		 item.scale.set(0.75,0.75,1);
		 return item;
	 }
	 
	 //Set the Item 
	 function setItem(pacItem){
		 //Pellet and Super Pellet Texture
		 if(pacItem == "Pellet" || pacItem == "Super Pellet")
			 return pelletTexture;
		 //Apple Texture
		 else if(pacItem == "Apple")
			 return appleTexture;
		 //Banana Texture
		 else if(pacItem == "Banana")
			 return bananaTexture;
		 //Cherry Texture
		 else if(pacItem == "Cherry")
			 return cherryTexture;
		 //Orange Texture
		 else if(pacItem == "Orange")
			 return orangeTexture;
		 //Pear Texture
		 else if(pacItem == "Pear")
			 return pearTexture;
		 //Pretzel Texture
		 else if(pacItem == "Pretzel")
			 return pretzelTexture;
		 //Strawberry Texture
		 else if(pacItem == "Strawberry")
			 return strawberryTexture;
		 //Grape Texture
		 else if(pacItem == "Grape")
			 return grapeTexture;
		 else
			 return pelletTexture;	
	 }
	 
	 //For Additional Ghost Creation
	 function addGhost(){
		 var ghosts =  new THREE.Sprite();	
		 ghosts.position.set(0,0,-2); //xyz
		 ghosts.scale.set(1.75,1.75,1);
		 return ghosts;
	 }	 
	 
	 //For Additional Pac-man Creation
	 function addPac(){
		 var pac =  new THREE.Sprite();	
		 pac.position.set(0,0,-2); //xyz
		 return pac;
	 }
	 
	 //A Function to remove my buttons a lot more easily - This Function will add a button to the scene and to the clickable array
	 function addButton(button){
		 //Removal of the startButton
		 try{
			 scene.add(button);
			 objects.push(button);
		 }catch(e){
			 Console.log("Failed  to add button '"+ button.name+"'");
		 }
	 }
	 
	 //A Function to remove my buttons a lot more easily - This Function will remove a button from the scene and from the clickable array
	 function removeButton(button){
		 //Removal of the startButton
		 try{
			 scene.remove(button);
			 objects.splice( objects.indexOf(button) , 1);
		 }catch(e){
			 Console.log("Failed  to remove button '"+ button.name+"'");
		 }
	 }
	 
	 //Loads the Start Screen of the Game
	 function load_Start_Screen(){
		 //Load Title
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 
		 //Source for the Title Image: https://fontmeme.com/pac-man-font/
		 var T = loader.load( 'Images/Title.png' );
		 T.minFilter = THREE.LinearFilter;
		 var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
		 Title1 = new THREE.Sprite(T1);			
		 scene.add(Title1);
		 Title1.position.set(0,15.95,-2); 
		 Title1.scale.set(32,7,1);		 
		 
		 //Loads the Buttons
		 load_Buttons();  
		 		 
		 //Menu Buttons
		 //Start Button
		 addButton(startButton);
		 
		 //About Button
		 addButton(aboutButton);	 
		 
		 //Credit Button
		 addButton(creditButton);
		 
		 //How To Play Button
		 addButton(howToPlayButton);	
		 
		 
		 
		 
		 
	 }
	 
	 //Loads the About Page of the Game
	 function load_About_Screen(){
		 //Temporarily remove the Start, Credit, About and How to Play Buttons
		 removeButton(startButton);
		 removeButton(howToPlayButton);
		 removeButton(creditButton);
		 removeButton(aboutButton);
		 
		 //Adjust the Section Title and then add it to the scene
		 titleSectionText.parameters.text= "About:";
		 titleSectionText.parameters.font= "150px Arial";
		 titleSectionText.parameters.fillStyle= "#FF1493";
		 titleSectionText.position.set(-16,12,5);
		 titleSectionText.parameters.lineHeight=0.6;
		 titleSectionText.update();
		 scene.add(titleSectionText);
		 
		 textBox.parameters.text= " Pac-Mania is my final project for the university that I graduated from. The foundation of this game is based on Namaco's 'Pac-man Battle Royale' game. I had already decided that for my final project to create an online multi-player game for my friends to enjoy. Then after visiting Barcade in Downtown New Haven, I decided that Pac-man would be the basis for my project. However, I didn't want to simply recreate the classic Pac-man game, I wanted to put my own twist and style in the game. My own madness per se. So please enjoy this game of madness, chaos and ghosts frenzy... Pac-Mania.";
		 textBox.parameters.font= "115px Arial";
		 textBox.parameters.fillStyle= "#FF44c3";
		 textBox.position.set(0,-6,5);		 		 
		 textBox.material.shininess=10;
		 textBox.parameters.lineHeight=0.105;
		 textBox.dynamicTexture.context.lineWidth=2.75;
		 textBox.dynamicTexture.canvas.width = 4096;
		 textBox.dynamicTexture.context.miterLimit=25;
		 textBox.parameters.margin=0.05;
		 textBox.scale.set(42,21,1);
		 textBox.dynamicTexture.texture.wrapS = 1000;
		 textBox.dynamicTexture.texture.wrapT = 1000;
		 textBox.update();
		 scene.add(textBox);
		 console.log(textBox);
		 
		 //Add the Return Button
		 addButton(returnButton);
		 //Adjust the Title
		 Title1.position.set(0,20.95,-2); 
		 Game_Status="About";
	 }
	 
	 //Loads the How To Play Page of the Game
	 function load_How_to_Play_Screen(){
		 //Temporarily remove the Start, Credit, About and How to Play Buttons
		 removeButton(startButton);
		 removeButton(howToPlayButton);
		 removeButton(creditButton);
		 removeButton(aboutButton);
		 
		 //Scene Number Reset
		 sceneNumber = 0;
		 
		 //Display Box
		 displayBox =  new THREE.Sprite(htpTextArray[sceneNumber]);	
		 scene.add(displayBox);
		 displayBox.scale.x  = htpTextArray[sceneNumber].scalingX;
		 displayBox.scale.y  = htpTextArray[sceneNumber].scalingY;
		 displayBox.name = "displayBox";
		 displayBox.position.set(0,1.5,1);
		 
		 //Adjust the Section Title and then add it to the scene
		 titleSectionText.parameters.text= "How To Play:";
		 titleSectionText.parameters.font= "150px Arial";
		 titleSectionText.parameters.fillStyle= "#1E90FF";
		 titleSectionText.position.set(-13,12,5);
		 titleSectionText.parameters.lineHeight=0.6;
		 titleSectionText.update();
		 scene.add(titleSectionText);
		 
		 textBox.parameters.text= htpTextArray[sceneNumber].text;
		 textBox.parameters.font= "150px Arial";
		 textBox.parameters.fillStyle= "#1E54FF";
		 textBox.position.set(0,-14,5);		 		 
		 textBox.material.shininess=0;
		 textBox.parameters.lineHeight=0.15;
		 textBox.dynamicTexture.context.lineWidth=2.5;
		 textBox.dynamicTexture.canvas.width = 4096;
		 textBox.dynamicTexture.context.miterLimit=25;
		 textBox.parameters.margin=0.05;
		 textBox.scale.set(45,15,1);
		 textBox.update();
		 scene.add(textBox);
		 
		 //Arrow Buttons
		 addButton(rightArrowButton);
		 addButton(leftArrowButton);
		 leftArrowButton.material.color  = new THREE.Color("rgb( 50, 50,50)");
		 rightArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
		 
		 //Add the Return Button
		 addButton(returnButton);
		 
		 //Adjust the Title
		 Title1.position.set(0,20.95,-2); 
		 Game_Status="How to Play";
	 }
	  
	 //Loads the Credit Page of the Game
	 function load_Credit_Screen(){
		 //Temporarily remove the Start, Credit, About and How to Play Buttons
		 removeButton(startButton);
		 removeButton(howToPlayButton);
		 removeButton(creditButton);
		 removeButton(aboutButton);
		 
		 //Scene Number Reset
		 sceneNumber = 0;		 
		 
		 //Display Box
		 displayBox =  new THREE.Sprite(creditDisplayArray[sceneNumber]);	
		 scene.add(displayBox);
		 displayBox.scale.x  = creditDisplayArray[sceneNumber].scalingX;
		 displayBox.scale.y  = creditDisplayArray[sceneNumber].scalingY;
		 displayBox.name = "displayBox";
		 displayBox.position.set(0,2,2);
		 
		 //Adjust the Section Title and then add it to the scene
		 titleSectionText.parameters.text= "Credits:";
		 titleSectionText.parameters.font= "150px Arial";
		 titleSectionText.parameters.fillStyle= "#FF8C00";
		 titleSectionText.position.set(-17,12,1);
		 titleSectionText.parameters.lineHeight=0.6;
		 titleSectionText.update();
		 scene.add(titleSectionText);
		 
		 textBox.parameters.text=  creditDisplayArray[sceneNumber].text;
		 textBox.parameters.font= "150px Arial";
		 textBox.parameters.fillStyle= "#FF8C00";
		 textBox.position.set(0,-15,5);		 		 
		 textBox.material.shininess=10;
		 textBox.parameters.lineHeight=0.15;
		 textBox.dynamicTexture.context.lineWidth=2.5;
		 textBox.dynamicTexture.canvas.width = 4096;
		 textBox.dynamicTexture.context.miterLimit=25;
		 textBox.parameters.margin=0.05;
		 textBox.scale.set(45,15,1);
		 textBox.update();
		 scene.add(textBox);
		 
		 //Add the Source Link
		 addButton(sourceLinkButton);
		 sourceLinkButton.url = creditDisplayArray[sceneNumber].url;
		 
		 //Arrow Buttons
		 addButton(rightArrowButton);
		 addButton(leftArrowButton);
		 leftArrowButton.material.color  = new THREE.Color("rgb( 50, 50,50)");
		 rightArrowButton.material.color  = new THREE.Color("rgb( 255, 255,255)");
					 
		 
		 //Add the Return Button
		 addButton(returnButton);
		 
		 //Adjust the Title
		 Title1.position.set(0,20.95,-2); 
		  Game_Status="Credit"
	 }
	  
	 //The Return function to go back to the Start Screen
	 function return_to_Start_Screen(){
		 //Remove the Return Button
		 removeButton(returnButton);
		 
		 //Remove the Section Title
		 scene.remove(titleSectionText);
		 
		 //Remove the link Source
		 if(scene.getObjectByName('sourceLinkButton') != null)
			 removeButton(sourceLinkButton);
		 
		 //Removes the textBox if it is present
		 if(scene.getObjectByName('textBox') != null)
			 scene.remove(textBox);
		 
		 //Removes the displayBox if it is present
		 if(scene.getObjectByName('displayBox') != null){
			 displayBox.scale.set(20,20,1);	
			 scene.remove(displayBox);
		 }
			 
		 
		 //Removes the arrows if it is present
		 if(scene.getObjectByName('rightArrowButton') != null)
			 scene.remove(rightArrowButton);
		 if(scene.getObjectByName('leftArrowButton') != null)
			 scene.remove(leftArrowButton);
		 
		 //Add back the buttons
		 addButton(startButton);
		 addButton(howToPlayButton);
		 addButton(creditButton);
		 addButton(aboutButton);
		 
		 //Readjust the Title
		 Title1.position.set(0,15.95,-2); 
		 Title1.scale.set(32,7,1);		 
		 Game_Status="Ready";
		 
		 //Remove Ghost if present
		 while(GhostList.length >0){
			 scene.remove(GhostList[0]);
			 GhostList.splice(0,1);
		 }
		 
	 }
	
	 //Load the images for the about, Credits and How to Play
	 function load_Display_Pictures(){
		 
		 displayBox =  new THREE.Sprite(null);
		 displayBox.name = "displayBox";		 
		 
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 //---------- About --------------------------
		 
		 
		 //---------- Credit --------------------------
		 //OriginalSpriteSheet
		 var texture = loader.load( 'Images/OriginalSprites/Sprite.gif' );
		 texture.minFilter = THREE.LinearFilter;
		 var pic = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 pic.text = "The default Sprites Sheet of the Ghost and the fruits      (Not including the Grapes).";
		 pic.url = "https://pixshark.com/ms-pacman-pixel.htm";
		 pic.scalingX = 20;
		 pic.scalingY = 20;
		 creditDisplayArray.push(pic);
		 //Style Sheet 1
		 texture = loader.load( 'Images/Style1/53209.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pic = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 pic.text = "The Style 1 Sprites Sheet.";
		 pic.url = "https://www.spriters-resource.com/pc_computer/pacmanchampionshipeditiondx/";
		 pic.scalingX = 23;
		 pic.scalingY = 23;
		 creditDisplayArray.push(pic);
		 //Style Sheet 2
		 texture = loader.load( 'Images/Style2/103599.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pic = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 pic.text = "The Style 2 Sprites Sheet has the same sprite              source as Style 1.";
		 pic.url = "https://www.spriters-resource.com/pc_computer/pacmanchampionshipeditiondx/";
		 pic.scalingX = 23;
		 pic.scalingY = 23;
		 creditDisplayArray.push(pic);
		 //Title
		 texture = loader.load( 'Images/Title.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pic = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 pic.text = "Here is the source of the title image for Pac-mania.";
		 pic.url = "https://fontmeme.com/fonts/pac-font-fontalicious-font/";
		 pic.scalingX = 18;
		 pic.scalingY = 7;
		 creditDisplayArray.push(pic);
		 //Game Over
		 texture = loader.load( 'Images/Game Over.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pic = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 pic.text = "Here is the source of the 'Game Over' image.";
		 pic.url = "https://flamingtext.com/logo/Design-Robot?_variations=true";
		 pic.scalingX = 22;
		 pic.scalingY = 14;
		 creditDisplayArray.push(pic);
		 //Upload the GameOver Texture while I'm at it
		 gameOver =  new THREE.Sprite(pic);		
		 gameOver.name =  "Game Over";		
		 
		 //---------- How To Play -----------------
		 //Source: https://stackoverflow.com/questions/196498/how-do-i-load-the-contents-of-a-text-file-into-a-javascript-variable
		 
		 //How to Play Cover
		 texture = loader.load( 'Images/HtpCover.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text =  "Didn't Load....";
		 htp.scalingX = 35;
		 htp.scalingY = 14;
		 htpTextArray.push(htp);
		 //Controls Option 1, 2 & 3
		 texture = loader.load( 'Images/Controls123.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text =  "Didn't Load....";
		 htp.scalingX = 20;
		 htp.scalingY = 20;
		 htpTextArray.push(htp);
		 //Controls Option 4
		 texture = loader.load( 'Images/Controls4.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text =  "Didn't Load....";
		 htp.scalingX = 20;
		 htp.scalingY = 20;
		 htpTextArray.push(htp);
		 //Bumping
		 texture = loader.load( 'Images/Controls4.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0x000000 } );
		 htp.text =  "Didn't Load....";
		 htp.scalingX = 20;
		 htp.scalingY = 20;
		 htpTextArray.push(htp);
		 //Fruit Listings
		 texture = loader.load( 'Images/fruit listing.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 20;
		 htp.scalingY = 17;
		 htpTextArray.push(htp);
		 //Apple
		 texture = loader.load( 'Images/appleInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 //Banana
		 texture = loader.load( 'Images/bananaInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 //Cherry
		 texture = loader.load( 'Images/cherryInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 //Grapes
		 texture = loader.load( 'Images/grapeInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 //Orange
		 texture = loader.load( 'Images/orangeInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 //Pear
		 texture = loader.load( 'Images/pearInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 //Pretzel
		 texture = loader.load( 'Images/preztelInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 //Strawberry
		 texture = loader.load( 'Images/strawberryInfo.png' );
		 texture.minFilter = THREE.LinearFilter;
		 var htp = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 htp.text = "Didn't Load....";
		 htp.scalingX = 30;
		 htp.scalingY = 12;
		 htpTextArray.push(htp);
		 
		  jQuery.get("HowToPlay.txt", undefined, function(data) {
			 //Prints the full data
			 //console.log(data);
			 var dataLength = data.split("\n").length;
			 
			 for(var x = 0; x< htpTextArray.length & x*2 < dataLength; x++){
				 //console.log(data.split("\n")[x*2]);
				 htpTextArray[x].text = data.split("\n")[x*2];
				 
				 // 0 - The cover text for the How to Play
				 // 1 - The fruits intro for the How to Play
				 // 2 - The Apple
				 // 3 - The Banana
				 // 4 - The Cherry
				 // 5 - The Grape
				 // 6 - The Orange
				 // 7 - The Pear/Melon
				 // 8 - The Pretzel
				 // 9 - The Strawberry
			 }
			 
			 }, "html").done(function() {
				 console.log("second success");
			 }).fail(function(jqXHR, textStatus) {
				 console.log(textStatus);
			 }).always(function() {
				 console.log("finished");
		 });
		 
		 
		 
		 
		 //---------- Right Arrow ------------------
		 texture = loader.load( 'Images/rightArrow.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pic = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 rightArrowButton =  new THREE.Sprite(pic);
		 rightArrowButton.posX = 21;
		 rightArrowButton.posY =  0;
		 rightArrowButton.posZ = -1;
		 rightArrowButton.position.set(rightArrowButton.posX, rightArrowButton.posY, rightArrowButton.posZ);
		 rightArrowButton.scale.set(6,6,1);
		 rightArrowButton.name = "rightArrowButton";
		 //---------- Left Arrow --------------------
		 texture = loader.load( 'Images/leftArrow.png' );
		 texture.minFilter = THREE.LinearFilter;
		 pic = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
		 leftArrowButton =  new THREE.Sprite(pic);	 
		 leftArrowButton.posX = -21;
		 leftArrowButton.posY =  0;
		 leftArrowButton.posZ = -1;
		 leftArrowButton.position.set(leftArrowButton.posX, leftArrowButton.posY, leftArrowButton.posZ);
		 leftArrowButton.scale.set(6,6,1);
		 leftArrowButton.name = "leftArrowButton";
	 }
	 
	 
}

window.onload = init;	
//window.onload = setup;	