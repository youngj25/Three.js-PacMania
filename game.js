var socket, PacMania = io('/pacMania', {forceNew:true});
var player=-1;
var Game_Status="Ready",camera;
var objects = [], board = [], dominoes= [];
//Start Game
var mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster(), pos = new THREE.Vector3();
//Text
var clickable = [];

//PacMania
var ghost,ghost2,ghost3,ghost4,ghost5,ghost6,ghost7,ghost8,ghost9;
var Outline, Board, gameMaze = [];
var Width = 0, Height = 0;
var xMultiplier  = 1.9, yMultiplier=1.9, yShifter = -1;
var backgroundButton, ghostButton; //Background functions

function init() {
	 // create a scene, that will hold all our elements such as objects, cameras and lights.
	 var scene = new THREE.Scene();				
	
	 // create a camera, which defines where we're looking at.
	 camera = new THREE.PerspectiveCamera(50, 500/ 500, 0.1, 1000);
	 camera.position.set(0,0,50);
	 scene.add(camera);
	 
	 // create a render and set the size
	 var renderer = new THREE.WebGLRenderer({ antialias: true} );
	 renderer.setClearColor(new THREE.Color(0x000000, 0.0));
	
	 for ( var x=0; Width+Height == 0; x++){
		 if(window.innerWidth > 1000-x*100 && window.innerHeight > 1000-x*100){
			 Width = 850-x*100;			
			 Height = 850-x*95;	
		 }	
		 else if( x >= 8){
			 Width = window.innerWidth*0.5;
			 Height = window.innerHeight*0.6;
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
	
	 PacMania.on('Update Game State', function(data){
		 //console.log(data)
		 
		 for(var x=0; x<data.GhostList.length; x++){
			 if(x == 0){
				 if(scene.getObjectByName('Ghost1') == null)
					 scene.add(ghost);
				 ghost.position.x = data.GhostList[x].x*xMultiplier;
				 ghost.position.y = data.GhostList[x].y*yMultiplier+yShifter;
				// gameMaze[0].block.position.x = data.GhostList[x].x*xMultiplier;
				 //gameMaze[0].block.position.y =data.GhostList[x].y*yMultiplier+yShifter-0.75;
			 
			}
			else  if(x == 1){
				 if(scene.getObjectByName('Ghost2') == null)
					 scene.add(ghost2);
				 ghost2.position.x = data.GhostList[x].x*xMultiplier;
				 ghost2.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			else  if(x == 2){
				 if(scene.getObjectByName('Ghost3') == null)
					 scene.add(ghost3);
				 ghost3.position.x = data.GhostList[x].x*xMultiplier;
				 ghost3.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			else  if(x == 3){
				 if(scene.getObjectByName('Ghost4') == null)
					 scene.add(ghost4);
				 ghost4.position.x = data.GhostList[x].x*xMultiplier;
				 ghost4.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			else  if(x == 4){
				 if(scene.getObjectByName('Ghost5') == null)
					 scene.add(ghost5);
				 ghost5.position.x = data.GhostList[x].x*xMultiplier;
				 ghost5.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			else  if(x == 5){
				 if(scene.getObjectByName('Ghost6') == null)
					 scene.add(ghost6);
				 ghost6.position.x = data.GhostList[x].x*xMultiplier;
				 ghost6.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			else  if(x == 6){
				 if(scene.getObjectByName('Ghost7') == null)
					 scene.add(ghost7);
				 ghost7.position.x = data.GhostList[x].x*xMultiplier;
				 ghost7.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			else  if(x == 7){
				 if(scene.getObjectByName('Ghost8') == null)
					 scene.add(ghost8);
				 ghost8.position.x = data.GhostList[x].x*xMultiplier;
				 ghost8.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			else  if(x == 8){
				 if(scene.getObjectByName('Ghost9') == null)
					 scene.add(ghost9);
				 ghost9.position.x = data.GhostList[x].x*xMultiplier;
				 ghost9.position.y = data.GhostList[x].y*yMultiplier+yShifter;
			}
			
		 }
		 
		 //console.log("Pac Mania")
		 //console.log(data)
	 });
	 	
	 //EVENT LISTENERS!!!!
	
	 //Keyboard Functions
	 //var onKeyDown = function(event) {
	 function onKeyDown(event) {
		 //Space Bar Changes Background
		 if (event.keyCode == 38 || event.keyCode ==104) { // Up Arrow
			 var data = { direction: "up"  };
			 PacMania.emit('move',data);
		 }
		 else if (event.keyCode == 40  || event.keyCode ==98) { // Down Arrow
			 var data = { direction: "down"  };
			 PacMania.emit('move',data);
		 }
		 //else console.log("Key: "+event.keyCode);
	 }; 
	 document.addEventListener('keydown', onKeyDown, false);
		
	 //Window Resize Event
	 function onWindowResize(){
		 Width = Height = 0;	
		 for ( var x=0; Width+Height == 0; x++){
			 if(window.innerWidth > 1000-x*100 && window.innerHeight > 1000-x*100){
				 Width = 850-x*100;		
				 Height = 850-x*95;	
			 }	
			 else if( x >= 8){
				 Width = window.innerWidth*0.5;
				 Height = window.innerHeight*0.75;
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
	 
	 //call the render function
	 renderer.render(scene, camera);
	 
	 //add spotlight for the shadows
	 var spotLight = new THREE.SpotLight(0xffffff);
	 spotLight.position.set(0, 0, 25);
	 spotLight.castShadow = false;
	 spotLight.intensity =2;
	 scene.add(spotLight);			 
	 
	 //call the render function
	 var step = 0;
	 load_Board();
	 renderScene();
	 load_Buttons();
	 drag_objects();
	 loadGhosts();
	 load_Game_Maze_1();
	
	 function renderScene(){
		 try{
			 //Render steps
			 step += 1;
				
			 //render using requestAnimationFrame
			 requestAnimationFrame(renderScene);
			 renderer.render(scene, camera);			
				
			 //Move all the players
			 scene.traverse(function (e) {
				 
			 });
		 }catch(e){
			 //functionToHandleError(e);		
			 //He HE HE don't say a word if errors happen				
		 }
	 }
	
	 function drag_objects(){
		 var dragControls  = new THREE.DragControls( objects, camera, renderer.domElement );
				
			 dragControls.addEventListener( 'dragstart', function(event) {
																		 if (event.object == backgroundButton){
																			 console.log("Start the Game");			
																			 PacMania.emit('Initiate Game Render');
																		 }
																		 else if (event.object == ghostButton){
																			 console.log("Add a Ghost");			
																			 PacMania.emit('Add Ghost');
																			 
																		 }
																		 //console.log("lol start of drag: ");
																		 
																		 });
																		 
			 dragControls.addEventListener( 'drag', function(event)   {});
																		
			 dragControls.addEventListener( 'dragend', function(event)   {});
																		 
																		 
																		 
			 //console.log(dragControls);
																		 
			 //https://www.learnthreejs.com/drag-drop-dragcontrols-mouse/
	 }

	 function loadGhosts(){
		 var ghostGeometry = new THREE.PlaneGeometry(1.5,1.5,0);
		 var Material = new THREE.MeshBasicMaterial({color: 0xffffff}); //RGB
		 ghost = new THREE.Mesh(ghostGeometry, Material);
		 scene.add(ghost);
		 ghost.position.set(0,0,-2); //xyz
		 ghost.name = 'Ghost1';
		 
		 Material = new THREE.MeshBasicMaterial({color: 0xaa55aa}); //RGB
		 ghost2 = new THREE.Mesh(ghostGeometry, Material);
		 ghost2.position.set(0,0,-2); //xyz
		 ghost2.name = 'Ghost2';
		 
		 Material = new THREE.MeshBasicMaterial({color: 0xaa5555}); //RGB
		 ghost3 = new THREE.Mesh(ghostGeometry, Material);
		 ghost3.position.set(0,0,-2); //xyz
		 ghost3.name = 'Ghost3';
		 
		 Material = new THREE.MeshBasicMaterial({color: 0xaaff55}); //RGB
		 ghost4 = new THREE.Mesh(ghostGeometry, Material);
		 ghost4.position.set(0,0,-2); //xyz
		 ghost4.name = 'Ghost4';
		 
		 Material = new THREE.MeshBasicMaterial({color: 0xfa11f5}); //RGB
		 ghost5 = new THREE.Mesh(ghostGeometry, Material);
		 ghost5.position.set(0,0,-2); //xyz
		 ghost5.name = 'Ghost5';
		 
		 Material = new THREE.MeshBasicMaterial({color: 0x2a11ff}); //RGB
		 ghost6 = new THREE.Mesh(ghostGeometry, Material);
		 ghost6.position.set(0,0,-2); //xyz
		 ghost6.name = 'Ghost6';		 
		 
		 Material = new THREE.MeshBasicMaterial({color: 0xfa11f5}); //RGB
		 ghost7 = new THREE.Mesh(ghostGeometry, Material);
		 ghost7.position.set(0,0,-2); //xyz
		 ghost7.name = 'Ghost7';
		 
		 Material = new THREE.MeshBasicMaterial({color: 0x2af125}); //RGB
		 ghost8 = new THREE.Mesh(ghostGeometry, Material);
		 ghost8.position.set(0,0,-2); //xyz
		 ghost8.name = 'Ghost8';
		 
		 Material = new THREE.MeshBasicMaterial({color: 0xfaccaf}); //RGB
		 ghost9 = new THREE.Mesh(ghostGeometry, Material);
		 ghost9.position.set(0,0,-2); //xyz
		 ghost9.name = 'Ghost9';
	 }
	
	 function load_Board(){
		 
		 //Load Board
		 var planeGeometry = new THREE.PlaneBufferGeometry (40.5, 40,0);
		 var planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000}); //RGB
		 Board = new THREE.Mesh(planeGeometry, planeMaterial);
		 Board.position.set(0,yShifter,-2); //xyz
		 scene.add(Board);

		 //Outline
		 var OutlineGeometry = new THREE.PlaneBufferGeometry (49, 42,0);
		 var OutlineMaterial = new THREE.MeshBasicMaterial({color: 0x050538}); //RGB
		 Outline = new THREE.Mesh(OutlineGeometry, OutlineMaterial);
		 Outline.position.set(0,yShifter,-3); //xyz
		 scene.add(Outline);
		 
		 //Title
		 var loader = new THREE.TextureLoader();
		 loader.crossOrigin = true;
		 
		 //Source for the Title Image: https://fontmeme.com/pac-man-font/
		 var T = loader.load( 'Images/Title.png' );
		 T.minFilter = THREE.LinearFilter;
		 var T1 =  new THREE.SpriteMaterial( { map: T, color: 0xffffff } );
		 Title1 = new THREE.Sprite(T1);				
		
		 scene.add(Title1);
		 Title1.position.set(0,21.75,-2); 
		 Title1.scale.set(24,4,1);
	 }

	 function load_Buttons(){
		 //Change Background Button
		 backgroundButton = new THREEx.DynamicText2DObject()
		 backgroundButton.parameters.text= "Start Game Status";
		 backgroundButton.parameters.font= "85px Arial";
		 backgroundButton.parameters.fillStyle= "Yellow";
		 backgroundButton.parameters.align = "center";
		 backgroundButton.dynamicTexture.canvas.width = 1024;
		 backgroundButton.dynamicTexture.canvas.height = 256;
		 backgroundButton.position.set(12,-21.5,5);
		 backgroundButton.scale.set(15,5,1);
		 backgroundButton.update();
		 scene.add(backgroundButton);
		 objects.push(backgroundButton);
		 
		 //Add Ghost
		 ghostButton = new THREEx.DynamicText2DObject()
		 ghostButton.parameters.text= "Add Ghost";
		 ghostButton.parameters.font= "85px Arial";
		 ghostButton.parameters.fillStyle= "Lime";
		 ghostButton.parameters.align = "center";
		 ghostButton.dynamicTexture.canvas.width = 1024;
		 ghostButton.dynamicTexture.canvas.height = 256;
		 ghostButton.position.set(-12,-22,5);
		 ghostButton.scale.set(15,5,1);
		 ghostButton.update();
		 //scene.add(ghostButton);
		 //objects.push(ghostButton);
	 }

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
	 
}

window.onload = init;	
//window.onload = setup;	