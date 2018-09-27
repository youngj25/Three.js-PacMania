var socket, PacMania = io('/pacMania', {forceNew:true});
var player=-1;
var Game_Status="Ready",camera;
var objects = [], board = [], dominoes= [];
//Start Game
var mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster(), pos = new THREE.Vector3();
//Text
var clickable = [];

//PacMania
var leftPaddlePos ={ x:-5, y:0}, rightPaddlePos ={ x:5, y:0}, ballPos ={ x:0, y:0};
var ghost, leftPaddle, rightPaddle;
var Outline, Board, PongLine;
var Width = 0, Height = 0;
var backgroundButton, background; //Background functions

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
			 Height = 850-x*120;	
		 }	
		 else if( x >= 8){
			 Width = window.innerWidth*0.75;
			 Height = window.innerHeight*0.5;
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
		 ghost.position.x = data.GhostList[0].x;
		 ghost.position.y = data.GhostList[0].y-2;
		 //console.log("Pac Mania")
		 //console.log(data)
	 });
	
	
	 var ghostGeometry = new THREE.PlaneGeometry(2,2,0);
		 var Material = new THREE.MeshBasicMaterial({color: 0xffffff}); //RGB
		 ghost = new THREE.Mesh(ghostGeometry, Material);
		 scene.add(ghost);
		 ghost.position.set(0,0,0); //xyz
	
	 //EVENT LISTENERS!!!!
	
	 //Keyboard Functions
	 //var onKeyDown = function(event) {
	 function onKeyDown(event) {
		 
	 }; 
	 document.addEventListener('keydown', onKeyDown, false);
		
	 //Window Resize Event
	 function onWindowResize(){
		 for ( var x=0; Width+Height == 0; x++){
			 if(window.innerWidth > 1000-x*100 && window.innerHeight > 1000-x*100){
				 Width = 850-x*100;		
				 Height = 850-x*120;	
			 }	
			 else if( x >= 8){
				 Width = window.innerWidth*0.75;
				 Height = window.innerHeight*0.5;
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
	 loadBasicSet();
	 load_Board();
	 renderScene();
	 load_Buttons();
	 drag_objects();
	
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
																		 if(event.object != backgroundButton)
																			controls.enabled = false;
																		 else if (event.object == backgroundButton){
																			 console.log("Start the Game");			
																			 PacMania.emit('Initiate Game Render');
																		 }
																		 //console.log("lol start of drag: ");
																		 
																		 });
																		 
			 dragControls.addEventListener( 'drag', function(event)   {
																		 if(event.object != backgroundButton){
																			 controls.enabled = true;
																			 //console.log("lol mid drag: ");
																			 if( event.object.name == "Left")
																					event.object.position.x = -20.75;
																			 else if( event.object.name == "Right")
																					 event.object.position.x = 20.75;
																				 
																			 var data = { yLoc: event.object.position.y  };
																			 Pong.emit('dragPaddle',data);
																		 }
																		 
																		 });
																		
			 dragControls.addEventListener( 'dragend', function(event)   {
																			 if(event.object != backgroundButton)
																				 controls.enabled = true;
																			 //console.log("lol end of drag: ");
																			 
																		 });
																		 
																		 
																		 
			 //console.log(dragControls);
																		 
			 //https://www.learnthreejs.com/drag-drop-dragcontrols-mouse/
	 }

	 function loadBasicSet(){
	 }
	
	 function load_Board(){
		 
		 //Load Board
		 var planeGeometry = new THREE.PlaneBufferGeometry (47, 36,0);
		 var planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000}); //RGB
		 Board = new THREE.Mesh(planeGeometry, planeMaterial);
		 Board.position.set(0,-5,-2); //xyz
		 scene.add(Board);

		 //Outline
		 var OutlineGeometry = new THREE.PlaneBufferGeometry (49, 38,0);
		 var OutlineMaterial = new THREE.MeshBasicMaterial({color: 0xffffff}); //RGB
		 Outline = new THREE.Mesh(OutlineGeometry, OutlineMaterial);
		 Outline.position.set(0,-5,-3); //xyz
		 scene.add(Outline);
	 }

	 function load_Buttons(){
		 //Change Background Button
		 backgroundButton = new THREEx.DynamicText2DObject()
		 backgroundButton.parameters.text= "Start Game Status";
		 backgroundButton.parameters.font= "85px Arial";
		 backgroundButton.parameters.fillStyle= "White";
		 backgroundButton.parameters.align = "center";
		 backgroundButton.dynamicTexture.canvas.width = 1024;
		 backgroundButton.dynamicTexture.canvas.height = 256;
		 backgroundButton.position.set(12,17.5,5);
		 backgroundButton.scale.set(15,5,1);
		 backgroundButton.update();
		 scene.add(backgroundButton);
		 objects.push(backgroundButton);
	 }

	 
}

window.onload = init;	
//window.onload = setup;	