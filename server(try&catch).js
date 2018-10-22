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
var ghostCreationCountDown = 4, ghostCreationList=[];

PacMania.on('connection',function(socket){
	 console.log("Pac-Mania Served has been accessed");
	 console.log("The client's ID:" + socket.id);
	 
	 PacSocketList.push(socket);
	  
	 //var mapNodes = [], gameRender = null, step=0;
	 //var nodesList; // For the aStar Algorithm
	 //var ghostsArray = [], pacArray = [], pellets = [];
	 //var ghostsStatus = "Scatter", ghostsCountDown=200, ghostRandomModeGeneratorNumber =11; //ghostRandomModeGeneratorNumber gets low and make the ghost more aggressive (default is 21)
	 
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
		 connection = [31];
		 node = {x:4, y:8, Connectednodes:connection,
							North:-1, East:-1,South:31,West:-1};
		 mapNodes.push(node); 
		 //Portal A - Node 118
		 connection = [91];
		 node = {x:-4, y:-7, Connectednodes:connection,
							North:91, East:-1,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Portal B - Node 119
		 connection = [35];
		 node = {x:-10, y:4, Connectednodes:connection,
							North:-1, East:35,South:-1,West:-1};
		 mapNodes.push(node); 
		 //Portal B - Node 120
		 connection = [84];
		 node = {x:10, y:-4, Connectednodes:connection,
							North:-1, East:-1,South:-1,West:84};
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
		 
		 
		 
		 
	 }
	 
	 //Start Game
     socket.on('Initiate Game Render', function(data) {
		 if(gameRender == null){			 
			 console.log("Started the Game State");
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
			  
			 gameRender = setInterval( UpdateGameState, 25);
		 }
		 else{
			 //console.log("Ended the Game State");
			 //clearInterval(gameRender);
			 //gameRender = null;
			 
			 addPac(socket.id);
		 } 
     });
	 
	 socket.on('Add Ghost', function(data) {
		 
		// addGhost();
		 console.log("Ghosts #: "+ghostsArray.length);
		 //PacMania.emit('Add Ghost');
	 });
	 
	 socket.on('Add Player', function(data) {
		 //Add Player;
		 addPac(socket.id);
		 console.log("Player added with the id: "+ socket.id);
		 console.log("PacArray Length: "+pacArray.length);
	 });
	 
	 socket.on('Move', function(data){
		 var found = false;
		 
		 for(var x = 0; x<pacArray.length && !found; x++)
			 if(pacArray[x].id == socket.id){
				 //console.log("P"+(x+1)+" Direction: "+data.direction);
				 pacArray[x].intendedDirection = data.direction;
				 found = true;
			 }
			 
		 if(!found) console.log("Error occured");
	 });
	 
	 //Update the Game State
	 function UpdateGameState(){
		 //step++;
		 var pacmanDistanceTravelDivsor = 20;
		 var baseSpeed = 1.5;
		 
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
				 }
				 //A118 -> A117
				 else if(ghostsArray[ghostCount].nextNode == 118){
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = 118;
					 ghostsArray[ghostCount].nextNode = 117;
					 ghostsArray[ghostCount].x = 4;
					 ghostsArray[ghostCount].y = 8;
				 }				 
				 //B119 -> B120
				 else if(ghostsArray[ghostCount].nextNode == 119){
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = 119;
					 ghostsArray[ghostCount].nextNode = 120;
					 ghostsArray[ghostCount].x = 10;
					 ghostsArray[ghostCount].y = -4;
				 }
				 //B120 -> B119
				 else if(ghostsArray[ghostCount].nextNode == 120){
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = 120;
					 ghostsArray[ghostCount].nextNode = 119;
					 ghostsArray[ghostCount].x = -10;
					 ghostsArray[ghostCount].y = 4;
				 }
				 
				 //Next Node Selected
				 try{
					 ghostsArray[ghostCount].oldNode = ghostsArray[ghostCount].lastNode;
					 ghostsArray[ghostCount].lastNode = ghostsArray[ghostCount].nextNode;
					 
					 if(ghostsStatus == "Scatter"){
						 if(ghostsArray[ghostCount].returnPath.length > 0 )
							 ghostsArray[ghostCount].returnPath = [];
						 
						 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
					 }
					 else if(ghostsStatus == "Home"){
						 
						  //To solve the issue of the going home error that get stucks at the portal
						 if(ghostsArray[ghostCount].oldNode == 92 && ghostsArray[ghostCount].lastNode == 91 ){
							 ghostsArray[ghostCount].direction = 'South';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode =  118;
							 console.log("Caught the Error!!!!! Portal A: 118 -> 117");
						 }
						 if(ghostsArray[ghostCount].oldNode == 118 && ghostsArray[ghostCount].lastNode == 117 ){
							 ghostsArray[ghostCount].direction = 'North';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].x = 4;
							 ghostsArray[ghostCount].y = 7;
							 ghostsArray[ghostCount].nextNode =  31;
							 console.log("Caught the Error!!!!! Portal A: 117 -> 118");
						 }
						 else if(ghostsArray[ghostCount].oldNode == 119 && ghostsArray[ghostCount].lastNode == 120 ){
							 ghostsArray[ghostCount].direction = 'West';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode =  84;
							 console.log("Caught the Error!!!!! Portal B: 119 -> 120");
						 }
						 else if(ghostsArray[ghostCount].oldNode == 120 && ghostsArray[ghostCount].lastNode == 119 ){
							 ghostsArray[ghostCount].direction = 'East';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode =  35;
							 console.log("Caught the Error!!!!! Portal B: 120 -> 119");
						 }
						 
						 
						 
						 //Now finding the path
						 else if(ghostsArray[ghostCount].returnPath.length <= 0 )
							 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode ,ghostsArray[ghostCount].home)
						
						 // if the Array is still empty then that means we are at our goal location so go to a random next location 
						 if(ghostsArray[ghostCount].returnPath.length <= 0 )
							 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
						 else // if the Array is not empty then follow the path
							 ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
						 //ghostsArray[ghostCount].returnPath.shift();						 
					 }
					 else if(ghostsStatus == "Chase"){
						 
						 //To solve the issue of the going home error that get stucks at the portal
						 if(ghostsArray[ghostCount].oldNode == 92 && ghostsArray[ghostCount].lastNode == 91 ){
							 ghostsArray[ghostCount].direction = 'South';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode =  118;
							 console.log("Caught the Error!!!!! Portal A: 118 -> 117");
						 }
						 if(ghostsArray[ghostCount].oldNode == 118 && ghostsArray[ghostCount].lastNode == 117 ){
							 ghostsArray[ghostCount].direction = 'North';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].x = 4;
							 ghostsArray[ghostCount].y = 7;
							 ghostsArray[ghostCount].nextNode =  31;
							 console.log("Caught the Error!!!!! Portal A: 117 -> 118");
						 }
						 else if(ghostsArray[ghostCount].oldNode == 119 && ghostsArray[ghostCount].lastNode == 120 ){
							 ghostsArray[ghostCount].direction = 'West';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode =  84;
							 console.log("Caught the Error!!!!! Portal B: 119 -> 120");
						 }
						 else if(ghostsArray[ghostCount].oldNode == 120 && ghostsArray[ghostCount].lastNode == 119 ){
							 ghostsArray[ghostCount].direction = 'East';
							 ghostsArray[ghostCount].directionPhase = 0;
							 ghostsArray[ghostCount].nextNode =  35;
							 console.log("Caught the Error!!!!! Portal B: 120 -> 119");
						 }
						 
						 
						 //Now finding the path
						 else if(ghostsArray[ghostCount].returnPath.length <= 0 )
							 ghostsArray[ghostCount].returnPath = loadAstarNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode , pacArray[ghostsArray[ghostCount].targetPlayer].nextNode )
						
						 // if the Array is still empty then that means we are at our goal location so go to a random next location 
						 if(ghostsArray[ghostCount].returnPath.length <= 0 )
							 ghostsArray[ghostCount].nextNode = loadRandomNode(ghostsArray[ghostCount].oldNode, ghostsArray[ghostCount].lastNode );
						 else // if the Array is not empty then follow the path
							 ghostsArray[ghostCount].nextNode = ghostsArray[ghostCount].returnPath.shift();
						 //ghostsArray[ghostCount].returnPath.shift();						 
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
			 
				 if(ghostsArray[ghostCount].directionPhase % 10 == 0)
					 ghostsArray[ghostCount].directionSprite=  (ghostsArray[ghostCount].directionSprite+1)%2; 
					
		 }
		
		 //PAC-MAN
		 //Loops for PAC-MANS
		 for(var pacCount = 0; pacCount < pacArray.length; pacCount++){
			 
			 //To stop the effects of fruits
			 if(pacArray[pacCount].effectTime != 0){
				 pacArray[pacCount].effectTime--;
				 if(pacArray[pacCount].effectTime <= 0){
					 pacArray[pacCount].effectTime  = 0;
					 pacArray[pacCount].effectTime  = 0;
					 pacArray[pacCount].speed = 1;
					 pacArray[pacCount].density = 1;
					 pacArray[pacCount].fruitEffect = null;
					 pacArray[pacCount].status = null;
					 
				 }
			 }
			 
			 //If the intendedDirection is opposite of the current Direction then go back
			 if((pacArray[pacCount].intendedDirection == 'North' && pacArray[pacCount].direction == 'South' && pacArray[pacCount].fruitEffect != "Drunk")||
				(pacArray[pacCount].intendedDirection == 'South' && pacArray[pacCount].direction == 'North' && pacArray[pacCount].fruitEffect != "Drunk")||
				(pacArray[pacCount].intendedDirection == 'East' && pacArray[pacCount].direction == 'West' && pacArray[pacCount].fruitEffect != "Drunk")||
				(pacArray[pacCount].intendedDirection == 'West' && pacArray[pacCount].direction == 'East' && pacArray[pacCount].fruitEffect != "Drunk")
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
			 else if(pacArray[pacCount].x == mapNodes[ pacArray[pacCount].nextNode ].x && pacArray[pacCount].y == mapNodes[ pacArray[pacCount].nextNode ].y && pacArray[pacCount].fruitEffect != "Drunk"){ 
				 //When the ghosts arrives at the nextNode location
				  
				 //For the portals teleportation
				 //A117 -> A118
				 if(pacArray[pacCount].nextNode == 117){
					 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
					 pacArray[pacCount].lastNode = 117;
					 pacArray[pacCount].nextNode = 118;
					 pacArray[pacCount].x = -4;
					 pacArray[pacCount].y = -7;
				 }
				 //A118 -> A117
				 else if(pacArray[pacCount].nextNode == 118){
					 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
					 pacArray[pacCount].lastNode = 118;
					 pacArray[pacCount].nextNode = 117;
					 pacArray[pacCount].x = 4;
					 pacArray[pacCount].y = 8;
				 }				 
				 //B119 -> B120
				 else if(pacArray[pacCount].nextNode == 119){
					 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
					 pacArray[pacCount].lastNode = 119;
					 pacArray[pacCount].nextNode = 120;
					 pacArray[pacCount].x = 10;
					 pacArray[pacCount].y = -4;
				 }
				 //B120 -> B119
				 else if(pacArray[pacCount].nextNode == 120){
					 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
					 pacArray[pacCount].lastNode = 120;
					 pacArray[pacCount].nextNode = 119;
					 pacArray[pacCount].x = -10;
					 pacArray[pacCount].y = 4;
				 }
				 
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
					 
				 }catch(e){
					 console.log("error");
				 }
				 
			 }
			 else{
				 //Since your Drunk!!!
				 
				 pacArray[pacCount].oldNode = pacArray[pacCount].lastNode;
				 pacArray[pacCount].lastNode = pacArray[pacCount].nextNode;
				 pacArray[pacCount].nextNode = loadRandomNode(pacArray[pacCount].oldNode, pacArray[pacCount].lastNode );
			 
			 
			 /**
				  //To solve the issue of the going home error that get stucks at the portal
				 if(ghostsArray[ghostCount].oldNode == 92 && ghostsArray[ghostCount].lastNode == 91 ){
					 ghostsArray[ghostCount].direction = 'South';
					 ghostsArray[ghostCount].directionPhase = 0;
					 ghostsArray[ghostCount].nextNode =  118;
					 console.log("Caught the Error!!!!! Portal A: 118 -> 117");
				 }
				 if(ghostsArray[ghostCount].oldNode == 31 && ghostsArray[ghostCount].lastNode == 117 ){
					 ghostsArray[ghostCount].direction = 'North';
					 ghostsArray[ghostCount].directionPhase = 0;
					 ghostsArray[ghostCount].nextNode =  118;
					 console.log("Caught the Error!!!!! Portal A: 117 -> 118");
				 }
				 else if(ghostsArray[ghostCount].oldNode == 119 && ghostsArray[ghostCount].lastNode == 120 ){
					 ghostsArray[ghostCount].direction = 'West';
					 ghostsArray[ghostCount].directionPhase = 0;
					 ghostsArray[ghostCount].nextNode =  84;
					 console.log("Caught the Error!!!!! Portal B: 119 -> 120");
				 }
				 else if(ghostsArray[ghostCount].oldNode == 120 && ghostsArray[ghostCount].lastNode == 119 ){
					 ghostsArray[ghostCount].direction = 'East';
					 ghostsArray[ghostCount].directionPhase = 0;
					 ghostsArray[ghostCount].nextNode =  35;
					 console.log("Caught the Error!!!!! Portal B: 120 -> 119");
				 }
				 **/
			 
			 }
			 
			 //Check for Pellets
			 didPacEncounterItem(pacArray[pacCount]);
			 //Check for Ghosts
			 didPacEncounterGhost(pacArray[pacCount]);
			 
		 }
		 
		 PacMania.emit('Update Game State', data={	 GhostList : ghostsArray, PacList : pacArray, Pellet: pacItems	 });
		 
		 ghostStatusUpdate();
		 
		 if(pacItems.length < 3){
		
			 var creationList = [ ];
		 
			 for(var pelletAdditions = 0; pelletAdditions < (Math.floor( Math.random()*12)+14); pelletAdditions++){
				 var addPellets = true;
				 var first = Math.floor(Math.random()*115);
				 var second = -1;
				 
				 while(second == -1 ||second == 117 || second == 118 || second == 119 || second == 120)
					 second = mapNodes[first].Connectednodes[ Math.floor( Math.random()*mapNodes[ first ].Connectednodes.length ) ];
				 
				 var pel = {first:first, second:second};
				 creationList.push (pel);
				 // ghostsArray.push (	g	); 
				 
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
			 directionShiftCount:0,
			 directionSprite:0,
			 status : null
		 };
		 
		 if(g.type == "Blinky")// Default value
			 g.home = 6;
		 else if(g.type == "Pinky")
			 g.home = 0;
		 else if(g.type == "Inky")
			 g.home = 116;
		 else if(g.type == "Clyde")
			 g.home = 110;
		 
			 
		 ghostsArray.push (	g	); 
	 }
	 
	 //Add a PAC-MAN
	 function addPac (socket) {
		  
		 var p = {
			 //PAC-MAN Object
			 id:socket,
			 x : -8,
			 y : -6,
			 speed: 1,
			 density:1,
			 score: 300,
			 lastNode : 89,
			 nextNode : 90,
			 oldNode : -1,
			 direction : 'East',
			 intendedDirection : 'North',
			 directionShiftCount : 0,
			 directionSprite : 0,
			 status : null,
			 fruitEffect: null,
			 effectTime:0
		 };
			 
		 pacArray.push (	p	); 
	 }

	 //Add Pellets(){
	 function addPacItems(firstNode, secondNode){
		 //Spacing Value for the Pellets
		 //How much space between each pellet
		 pelletSpacing = 0.5;
		 var fruitLocation = Math.floor(((mapNodes[firstNode ].y-mapNodes[secondNode ].y)/pelletSpacing)/2);
		 var fruitsOdds = 50; // meant to be used like this 1/fruitsOdds // Should be greater than 50
		 
		 
		 //Different Y Values
		 if(mapNodes[firstNode ].x == mapNodes[secondNode ].x){
			 
			 if(mapNodes[firstNode ].y > mapNodes[secondNode ].y)
				 pelletSpacing = -pelletSpacing;
			 
			 for(var pNo = 0; pNo <= Math.abs(mapNodes[firstNode ].y-mapNodes[secondNode ].y)/Math.abs(pelletSpacing); pNo++){
			 
				 var p = {
					 //Pellet Object
					 x : mapNodes[firstNode ].x,
					 y : mapNodes[firstNode ].y + pNo*pelletSpacing,
					 worth: 10,
					 type : "Pellet"
				 };
				 
				 //Fruit Insertion
				 if(fruitLocation == pNo && fruitLocation>=2){
					 var fruitNo = Math.floor(Math.random()*fruitsOdds);
					 //Apple, Banana, Cherry, Orange, Pear, Pretzel, Strawberry,Grapes
					 //Pellets and Super Pellets
					 
					 if(fruitNo == 0 || fruitNo == 25){
						 p.type = "Super Pellet";
						 p.worth = 0;	 
					 }
					 else if(fruitNo >= 1 && fruitNo <= 3){
						 p.type = "Apple";
						 p.worth = 50;	 
					 }
					 else if(fruitNo >= 4 && fruitNo <= 6){
						 p.type = "Banana";
						 p.worth = 10;	 
					 }
					 else if(fruitNo >= 7 && fruitNo <= 9){
						 p.type = "Cherry";
						 p.worth = 100;	 
					 }
					 else if(fruitNo >= 10 && fruitNo <= 12){
						 p.type = "Orange";
						 p.worth = 250;	 
					 }
					 else if(fruitNo >= 13 && fruitNo <= 15){
						 p.type = "Pear";
						 p.worth = 50;	 
					 }
					 else if(fruitNo >= 16 && fruitNo <= 18){
						 p.type = "Pretzel";
						 p.worth = 50;	 
					 }
					 else if(fruitNo >= 19 && fruitNo <= 21){
						 p.type = "Strawberry";
						 p.worth = 150;	 
					 }
					 else if(fruitNo >= 21 && fruitNo <= 24){
						 p.type = "Grape";
						 p.worth = 200;	 
					 }
					 
					 //To make room for the fruit we remove the previous and next nodes
					 if(fruitNo <= 25){
						 pNo++; // Skip next pellet insertion
						 pacItems.splice(pacItems.length-1,1); //Remove Previous Pellet
					 }
					 
				 }
					 
					 
				 pacItems.push(p);
			 }
		 }
		 
		 //Different X Values
		 else if(mapNodes[firstNode ].y == mapNodes[secondNode ].y){
			 
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
					 var fruitNo = Math.floor(Math.random()*fruitsOdds);
					 //Apple, Banana, Cherry, Orange, Pear, Pretzel, Strawberry,Grapes
					 //Pellets and Super Pellets
					 
					 if(fruitNo == 0 || fruitNo == 25){
						 p.type = "Super Pellet";
						 p.worth = 0;	 
					 }
					 else if(fruitNo >= 1 && fruitNo <= 3){
						 p.type = "Apple";
						 p.worth = 50;	 
					 }
					 else if(fruitNo >= 4 && fruitNo <= 6){
						 p.type = "Banana";
						 p.worth = 10;	 
					 }
					 else if(fruitNo >= 7 && fruitNo <= 9){
						 p.type = "Cherry";
						 p.worth = 100;	 
					 }
					 else if(fruitNo >= 10 && fruitNo <= 12){
						 p.type = "Orange";
						 p.worth = 250;	 
					 }
					 else if(fruitNo >= 13 && fruitNo <= 15){
						 p.type = "Pear";
						 p.worth = 50;	 
					 }
					 else if(fruitNo >= 16 && fruitNo <= 18){
						 p.type = "Pretzel";
						 p.worth = 50;	 
					 }
					 else if(fruitNo >= 19 && fruitNo <= 21){
						 p.type = "Strawberry";
						 p.worth = 150;	 
					 }
					 else if(fruitNo >= 21 && fruitNo <= 24){
						 p.type = "Grape";
						 p.worth = 200;	 
					 }
					 
					 //To make room for the fruit we remove the previous and next nodes
					 if(fruitNo <= 25){
						 pNo++; // Skip next pellet insertion
						 pacItems.splice(pacItems.length-1,1); //Remove Previous Pellet
					 }
					 
				 }
					 
				 
				 
				 pacItems.push(p);
			 }
		 }
		 
		 //console.log("Pellets Size:"+pellets.length);
	 }
	 
	 //Pac-man Encounters/Eats Pellets
	 function didPacEncounterItem(Pac){
		 //When the Pacman are in the same location as pellet, near a pellet
		 for(var pel = 0; pel < pacItems.length; pel++){
			 var pelletRadius =0.35;
			 if( Math.abs(Pac.x - pacItems[pel].x)<=pelletRadius && Math.abs(Pac.y - pacItems[pel].y)<=pelletRadius){
				 
				 
				 if(pacItems[pel].type == "Banana"){
					 Pac.speed = 2;
					 Pac.density = 0.5;
					 Pac.effectTime = 500;
					 Pac.fruitEffect = "Speed 200%";
				 }
				 else if(pacItems[pel].type == "Orange"){
					 Pac.speed = 0.6;
					 Pac.density = 1.5;
					 Pac.effectTime = 500;
					 Pac.fruitEffect = "Speed 60%";
				 }
				 else if(pacItems[pel].type == "Grape"){
					 Pac.speed = 1.5;
					 Pac.effectTime = 375;
					 Pac.fruitEffect = "Drunk";
				 }
				 else if(pacItems[pel].type == "Super Pellet"){
					 Pac.speed = 1.25;
					 Pac.fruitEffect = "Super PAC-MAN";
					 Pac.effectTime = 600;
				 }
				
				
				 Pac.score += pacItems[pel].worth;						
				 pacItems.splice(pel,1);
			 }
		 }		 
	 }
	 
	 function didPacEncounterGhost(Pac){
		 
		 if(Pac.fruitEffect == "Super PAC-MAN"){
			 for(var ghostNo = 0; ghostNo < ghostsArray.length; ghostNo++)
				 //Check x values first
				 if(Math.abs(ghostsArray[ghostNo].x - Pac.x)<=0.25)
					 if(Math.abs(ghostsArray[ghostNo].y - Pac.y)<=0.25){
						 ghostsArray.splice(ghostNo,1);
						 ghostNo--;
					 }
		 }
		 else{
			 for(var ghostNo = 0; ghostNo < ghostsArray.length; ghostNo++)
				 //Check x values first
				 if(Math.abs(ghostsArray[ghostNo].x - Pac.x)<=0.25)
					 if(Math.abs(ghostsArray[ghostNo].y - Pac.y)<=0.25){
						 console.log(ghostsArray[ghostNo].type+" Killed Pac!!!");
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
			 
			 
			if(randomGhostMode <= 4 && ghostsStatus != "Home"){
				 ghostsStatus = "Home";
				 ghostsCountDown = 550+Math.floor(Math.random()*300);
				 console.log("Mode: Home");
			}
			else{
				
				 if(randomGhostMode <= 4)
					  randomGhostMode = Math.floor(Math.random()*Math.floor(ghostRandomModeGeneratorNumber-5))+5;
				 
				 
				 if(randomGhostMode < 10){
					 ghostsStatus = "Chase";
					 ghostsCountDown = 500+Math.floor(Math.random()*400);
					 console.log("Mode: Chase");
					 
					 //Assigning Targets
					 for(var ghostCount =0; ghostCount<ghostsArray.length;ghostCount++)
								ghostsArray[ghostCount].targetPlayer = Math.floor(Math.random()*pacArray.length);
					 
				 }
				 else if(randomGhostMode > 10){
					 ghostsStatus = "Scatter";
					 ghostsCountDown = 700+Math.floor(Math.random()*300);
					 console.log("Mode: Scatter");
					 
					 //Count Down to Ghost Creation
					 if(ghostsArray.length <= 8)
					     ghostCreationCountDown--;
				 }
				 
				 
				 
				 
				 
				 if(ghostCreationCountDown <= 0){
					 addGhost("Random");
					 ghostCreationCountDown = Math.floor(Math.random()*12)+5;
					 console.log("A Ghost Appeared!!! ("+ghostsArray[ghostsArray.length-1].type+")");
				 }
				 
				 //console.log("Mode: Scatter");
			}
			
			 //ghostRandomModeGeneratorNumber -= 0.05
			 
			 
		 }
		 
	 }
	 	 
	 //Loads a random node	
	 function loadRandomNode(lastNode,nextNode){		
		 var nodeNumber = mapNodes[ nextNode ].Connectednodes[ Math.floor( Math.random()*mapNodes[ nextNode ].Connectednodes.length ) ];
			
		 while(nodeNumber == lastNode || nodeNumber == nextNode || nodeNumber == -1)
			 nodeNumber = mapNodes[ nextNode ].Connectednodes[ Math.floor( Math.random()*mapNodes[ nextNode ].Connectednodes.length ) ];
		 
		 return nodeNumber;
	 }
	
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
	
	 //Leaving the PacMania Game
     socket.on('disconnect', function() {
		 for(var x = 0; x<pacArray.length; x++)
			 if(pacArray[x].id == socket.id){
				 console.log("Player "+(x+1)+" - "+socket.id+" has Disconnected!");
				 pacArray.splice(x,1);
			 }
		
		 if(pacArray.length == 0){
			 console.log("Pacmania Server just became Idle");
			 ghostsArray = [];
			 if(gameRender != null){
				 clearInterval(gameRender);
				 gameRender = null;
			 }
		}
    });
 
});


////////////////////////////////////////////////////////////
// Pong
var Pong = io.of('/pong');
var socketList= [];
var gameRendering, step = 0;

Pong.on('connection', function(socket){
	 console.log("Pong Served has been accessed");
	 console.log("The client's ID:" + socket.id);
	
	 socketList.push(socket);
	
	 var ceiling = 16.5, floor = -16;
	 var leftScore = 0, rightScore = 0;
	 var ball = {
		x : 0,
		y : 0,
		speed : 0.1, //Think of this as the speed for horizontally
		angle : 0.1,   //Think of this as the speed for vertically (how fast the ball goes towards the ceiling/floor)
		GoingUpOrDown:"Down",
		GoingLeftOrRight:"Right"
	 };
	 var leftPaddle = {
		 y : 0,
		 x : -19, //Should not change!!
		 paddleLength:7,
		 socket: null,
		 colorUpdate: false 
	 }
	 var rightPaddle = {
		 y : 0,
		 x : 19, //Should not change!!
		 paddleLength:7,
		 socket: null,
		 colorUpdate: false 
	 }
	
	 //Players set into position
	 if (leftPaddle.socket == null){
		 leftPaddle.socket = socket.id;
	 }
	 else if (rightPaddle.socket == null){
		 rightPaddle.socket = socket.id;
	 }
	
	 gameRendering = setInterval( UpdateGameState, 15);
	
 	 function UpdateGameState() {
		 step+= 0.1; //Not sure if I still need this though lol
		 
		 //Up or Down Functionality
		 //If the ball is currently going down
		 if(ball.GoingUpOrDown == "Down"){
			 ball.y -= ball.angle;
			 
			 if(ball.y <=  floor) 
				 ball.GoingUpOrDown = "Up";
			 else if(ball.y >= ceiling) // just incase this will correct any error
				 ball.GoingUpOrDown = "Down";
		 }
		 //If the ball is currently going up
		 else if(ball.GoingUpOrDown == "Up"){
			 ball.y += ball.angle;
			 
			 //if the ball hits the ceiling, make it reflect downwards
			 if(ball.y >= ceiling) 
				 ball.GoingUpOrDown = "Down";
			 else if(ball.y <=  floor) // just incase this will correct any error
				 ball.GoingUpOrDown = "Up";
		 }
		 
		 //Left or Right Functionality
		 //Left Paddle
		 if(ball.GoingLeftOrRight == "Left"){
			 ball.x -= ball.speed;

			 //If the ball reaches the leftPaddle
			 if( ball.x <= leftPaddle.x && ball.x > leftPaddle.x-1.5 &&
			     ball.y <= ( leftPaddle.y + leftPaddle.paddleLength*0.5) &&
				 ball.y >= ( leftPaddle.y - leftPaddle.paddleLength*0.5)){
					 ball.GoingLeftOrRight = "Right";
				 
				 //Upper part of the paddle
				 if( ball.y >= ( leftPaddle.y + leftPaddle.paddleLength*0.25) &&
					 ball.y <= ( leftPaddle.y + leftPaddle.paddleLength*0.55 ))  {
					 	 if(ball.angle<1)
							 ball.angle += 0.1;
						 leftPaddle.colorUpdate = true;
				 }
				  //Middle part of the paddle
				 else if( ball.y <= ( leftPaddle.y + leftPaddle.paddleLength*0.25) &&
							  ball.y >= ( leftPaddle.y - leftPaddle.paddleLength*0.25))  {
									 leftPaddle.colorUpdate = true;
				 }		
				 //Lower part of the paddle
				 else if( ball.y <= ( leftPaddle.y - leftPaddle.paddleLength*0.25) &&
							  ball.y >= ( leftPaddle.y - leftPaddle.paddleLength*0.55))  {
								 if(ball.angle>-1)
									 ball.angle -= 0.1;
								 leftPaddle.colorUpdate = true;
				 }
			 }
			 //Misses the paddle
			 else if( ball.x < leftPaddle.x-1.5) {
					 rightScore += 1;
					 ball.speed = 0;
					 console.log("Score: " + leftScore + "|" + rightScore);
					 clearInterval(gameRendering);
					 gameRendering = null;
				 }
		 }
		 //Right Paddle
		 else if(ball.GoingLeftOrRight == "Right"){
			 ball.x += ball.speed;
			 
			 //If the ball reaches the rightPaddle
			 if(ball.x > rightPaddle.x && ball.x < rightPaddle.x+0.2) {
				 ball.GoingLeftOrRight = "Left";
				 
				 //Upper part of the paddle
				 if( ball.y >= ( rightPaddle.y + rightPaddle.paddleLength*0.25) &&
					 ball.y <= ( rightPaddle.y + rightPaddle.paddleLength*0.55 ))  {
					 if(ball.angle> -1)
						 ball.angle -= 0.1;
					 ball.angle = Math.abs(ball.angle-0.1);
					 rightPaddle.colorUpdate = true;
					 ball.GoingLeftOrRight = "Left";
				 }
				 //Middle part of the paddle
				 else if( ball.y <= ( rightPaddle.y + rightPaddle.paddleLength*0.25) &&
					 ball.y >= ( rightPaddle.y - rightPaddle.paddleLength*0.25))  {
					 rightPaddle.colorUpdate = true;
					 ball.GoingLeftOrRight = "Left";
				 }				 
				 //Lower part of the paddle
				 else if( ball.y <= ( rightPaddle.y - rightPaddle.paddleLength*0.25) &&
					 ball.y >= ( rightPaddle.y - rightPaddle.paddleLength*0.55))  {
					  if(ball.angle<1)
						 ball.angle += 0.1;
					 rightPaddle.colorUpdate = true;
					 ball.GoingLeftOrRight = "Left";
				 }
			}
			 //Misses the paddle
			 else if(ball.x > rightPaddle.x+0.2) {
					 leftScore += 1;
					 ball.speed = 0;
					 console.log("Score: " + leftScore + "|" + rightScore);
					 clearInterval(gameRendering);
					 gameRendering = null;
			 }
		 }		 
		
		 //Broad cast the Pong Game State
		 Pong.emit('Update Game State', 
						 data={
							 //Ball
								 ballPositionX : ball.x,
								 ballPositionY : ball.y,
							
							//LeftPaddle
								 leftPaddlePosition : leftPaddle.y,
								 leftUpdate: leftPaddle.colorUpdate,
								
							 //RightPaddle
								 rightPaddlePosition : rightPaddle.y,
								 rightUpdate: rightPaddle.colorUpdate,
							
							 //Score
								 rightScore : rightScore,
								 leftScore : leftScore
						 });
						 
		 leftPaddle.colorUpdate = false;
		 rightPaddle.colorUpdate = false;
	 }
	
	 //Move Paddle
     socket.on('movePaddle', function(data) {
		 
		 //Left Paddle
		 if(leftPaddle.socket == socket.id){
			 if(data.direction == "up" && (leftPaddle.y+leftPaddle.paddleLength/2)<ceiling){
				 leftPaddle.y += 1;
			 }
			 else if(data.direction == "down" && (leftPaddle.y-leftPaddle.paddleLength/2)>floor){
				 leftPaddle.y -= 1;
			 }
			 
			 //console.log("Left");
		 }
		 //Right Paddle
		 else if(rightPaddle.socket == socket.id){
			 if(data.direction == "up" && (rightPaddle.y+rightPaddle.paddleLength/2)<ceiling){
				 rightPaddle.y += 1;
			 }
			 else if(data.direction == "down" && (rightPaddle.y-rightPaddle.paddleLength/2)>floor){
				 rightPaddle.y -= 1;
			 }
			 
			 console.log("Right");
		 }
     });
	 
	 //Drag Paddle
     socket.on('dragPaddle', function(data) {
		 
		 //Left Paddle
		 if(leftPaddle.socket == socket.id){
			 leftPaddle.y = data.yLoc;
			 
			 //console.log("Left");
		 }
		 //Right Paddle
		 else if(rightPaddle.socket == socket.id){
			 rightPaddle.y = data.yLoc;
			 //console.log("Right");
		 }
     });
	 
	 //Play Again
	 socket.on('playAgain',function(){
		 if(gameRendering != null){
			 
			 console.log("A Game is still in play.");
		 }
		else{
			 resetGame();
			 
			 ball.angle = Math.floor(Math.random()*11)/10;
			 
			 leftPaddle.socket = socket.id;
			 
			 gameRendering = setInterval( UpdateGameState, 15);
		 }
	});
	
	 //Reset Function
	 function resetGame(){
		 //Reset the Ball Stats
		 ball.x = 0;
		 ball.y = 0;
		 ball.speed = 0.1;
		 ball.angle = 0.1;
		 ball.GoingUpOrDown = "Down";
		 ball.GoingLeftOrRight = "Right";
		 
		 //Left Paddle
		 leftPaddle.y = 0;
		 leftPaddle.paddleLength = 7;
		 leftPaddle.socket = null;
		 
		 //Right Paddle
		 rightPaddle.y = 0;
		 rightPaddle.paddleLength = 7;
		 rightPaddle.socket = null;
		 
		 //Score
		 //leftScore = 0;
		 //rightScore = 0;
		 
		 console.log("Reset!!");
	 }
	
	 //Leaving the Pong Game
     socket.on('disconnect', function() {
		 console.log(socket.id+" has Disconnected!");
		 for(var x=0; x<socketList.length;x++)
			 if(socketList[x].id == socket.id)
				 socketList.splice(x,1);
			 else
				 console.log( socketList[x].id + " != " + socket.id);
		
		
		 if(socketList.length == 0){
			 console.log("Pong Server just became Idle");
			 resetGame();
			 if(gameRendering != null){
				 clearInterval(gameRendering);
				 gameRendering = null;
			 }
		}
    });
 
 });


///////////////////////////////////////////////////////////////////////////////////
//OLD Pac-man SERVER!!!!!!!
var PacPlayers = [];
//When the Target Player is set to -1, it goes back home and then if it set to #>player it goes randomly around the board
//Change target player from chasing node to chasing player last location
var P1Direction="North",P1IntendedDirection="North",oldNode=-1,prevNode=25,currNode=22;
var numberOfPacPlayer=0;
var Pac = io.of('/pacman'), PacStatus = "Idle";
var gameLevel, BA=0, nodes=[]; //GameLevel is so that everyone can know which game map to load
var fruitNode=-1,fruit=0, fruitCountDown=6,gameCountdown=10,lastCurr=0, drunkCountdown =10, drunkPlayer = -1;
var BlinkyTarget=10, PinkyTarget=0, InkyTarget=39, ClydeTarget=25, ghostCoundDown=15, ghostStatus=1;
//An array list of all the game items that the pacman players can eat ( pellets, superPellets and fruits)
var items = [], PlayersTables = [], ghosts = [], Players = []; //Players hold just the array number and the player general info
var IntervalID = null, fruitIntervalID = null, ghostIntervalID = null, Countdown = null, drunkIntervalID = null; // intervals
var loading = 30; //Set Loading time for the Game

Pac.on('connection', function(socket){
	console.log("PAcman Served has been accessed");
	
	
	console.log("The client's ID:" + socket.id);
	var data ={
		id: socket.id,
		username:null,
		status: "active",
		count:1000,
		wins:0,
		Blinky:"omw",
		Pinky:"omw",
		Inky:"omw",
		Clyde:"omw",
		P1:"omw",
		P2:"omw",
		P3:"omw",
		P4:"omw"
	};
	PacPlayers.push(data);
	console.log("The client with the ID:"+PacPlayers[PacPlayers.length-1].id+" has been added.");
	//numberOfPacPlayer++;
	
	//var sendData = {playerNo: PacPlayers.length};
	
	//Pac.to(PacPlayers[(PacPlayers.length-1)].id).emit('PlayerInfo',sendData);
	console.log("This client is player "+(PacPlayers.length-1));
	console.log("__________________________________________________");
	
	if(nodes.length == 0){
		gameLevel=1;
		loadNodes();
		console.log("Loaded the nodes for GameLevel 1!!!");
	}
	
	//var PlayersTables = [];
	//Start Count Down to the Next Game
	socket.on('Start Count to the Next Game', function(){
		//Add Player to the Players table
		if(PacStatus != "Active" && PlayersTables.length < 4){
			var data = {
				id:socket.id,
				player: (PlayersTables.length+1),
				PlayerScore:0,
				status: "Still Playing",
				Direction:"",
				IntendedDirection:"",
				oldNode:-1,
				prevNode:-1,
				currNode:-1
			};
			
			if(PlayersTables.length == 0){
				data.Direction = "North";
				data.IntendedDirection = "North";
				data.prevNode = 25;
				data.currNode = 22;			
			}
			else if(PlayersTables.length == 1){
				data.Direction = "North";
				data.IntendedDirection = "North";
				data.prevNode = 35;
				data.currNode = 39;	
			}
			else if(PlayersTables.length == 2){
				data.Direction = "South";
				data.IntendedDirection = "South";
				data.prevNode = 0;
				data.currNode = 6;	
			}
			else if(PlayersTables.length == 3){
				data.Direction = "South";
				data.IntendedDirection = "South";
				data.prevNode = 10;
				data.currNode = 15;	
			}
			
			
			PlayersTables.push(data);
			var sendData = {playerNo: PlayersTables.length};
			Pac.to(PlayersTables[(PlayersTables.length-1)].id).emit('PlayerInfo',sendData);
			
			if(PlayersTables.length <= 4){
				
				data ={
					player:PlayersTables.length,
					position:PlayersTables.length-1 // position in the PlayerTable Array
				};
				
				Players.push(data);
			};
			console.log("Size: "+Players.length);
			numberOfPacPlayer++;
			Pac.to(socket.id).emit('Proceed To The Game Level');
			//console.log("We found Player "+PlayersTables.length);
			//Pac.emit('Whose Playing', data = { numberOfPlayers: PlayersTables.length });
			
			if(PacStatus == "Idle"){
				loading = 31;			
				PacStatus = "Countdown";
				Countdown = setInterval(CountdownmyCallback, 1000);
				loadGhost();
				
				function CountdownmyCallback() {
					loading--;
					console.log("Countdown: "+loading);
					var data; // was score V
					Pac.emit('Countdown',data = {count:loading, numberOfPlayers: PlayersTables.length});	
				  
					if(loading <= 0){
						
						clearInterval(Countdown);
						PacStatus = "Active";
						fruitIntervalID = setInterval(fruitCallback, 1000);
						ghostIntervalID = setInterval(ghostCallback, 1000);
						//console.log("Next Fruit Countdown: " + fruitCountDown);
					}
					
					function fruitCallback() {
						//console.log("Fruit Countdown: "+fruitCountDown);
						fruitCountDown--;
						
						if(PacStatus != "Active") clearInterval(fruitIntervalID);
						else if(fruitCountDown <= 0){
							insertItems();
							fruitCountDown = Math.floor(Math.random()*50)+20;
							console.log("Next Fruit Countdown: " + fruitCountDown);
						}
					}
					
					function ghostCallback() {
					//console.log("Fruit Countdown: "+fruitCountDown);
						ghostCoundDown--;
						if(PacStatus != "Active") clearInterval(ghostCallback);
						else if(ghostCoundDown <= 0){
							ghostCoundDown = Math.floor(Math.random()*15)+10;
							ghostStatus += Math.floor(Math.random()*2)+1;
							//console.log("code:"+ghostStatus);
							ghostStatus = ghostStatus%(PlayersTables.length+2);
							//console.log("code:"+ghostStatus);
							if(ghostStatus == 0){
								ghosts[0].Status = "Home";
								ghosts[1].Status = "Home";
								ghosts[2].Status = "Home";
								ghosts[3].Status = "Home";
								
								ghostCoundDown = 12;
								console.log("0-Ghost Go Home!!!! code:"+ghostStatus+"  Count = "+ghostCoundDown);
								list_all_the_players();
							}
							else if(ghostStatus == 1){
								ghosts[0].Status = "Wander";
								ghosts[1].Status = "Wander";
								ghosts[2].Status = "Wander";
								ghosts[3].Status = "Wander";
								
								ghostCoundDown = Math.floor(Math.random()*12)+6;
								console.log("1-Ghost Wander!!! code:"+ghostStatus+"  Count = "+ghostCoundDown)
							} 
							else{
								ghosts[0].Status = "Chase";
								ghosts[1].Status = "Chase";
								ghosts[2].Status = "Chase";
								ghosts[3].Status = "Chase";
								
								//console.log("Number of Players: "+PlayersTables.length+" / "+Players.length);
								ghosts[0].targetPlayer = ghostTargeting();
								ghosts[1].targetPlayer = ghostTargeting();
								ghosts[2].targetPlayer = ghostTargeting();
								ghosts[3].targetPlayer = ghostTargeting();
								
								ghostCoundDown = Math.floor(Math.random()*15)+5;
								console.log("Ghost Attack code:"+ghostStatus+"  Count = "+ghostCoundDown);
								console.log(ghosts[0].Name+" is chasing Pac-Man Player "+(ghosts[0].targetPlayer+1));
								console.log(ghosts[1].Name+" is chasing Pac-Man Player "+(ghosts[1].targetPlayer+1));
								console.log(ghosts[2].Name+" is chasing Pac-Man Player "+(ghosts[2].targetPlayer+1));
								console.log(ghosts[3].Name+" is chasing Pac-Man Player "+(ghosts[3].targetPlayer+1));
								
							} 
							console.log("______________________________________");
						}
					}
				}
				//Source: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
			}
			else if(PacStatus == "Countdown") console.log("Ignore because there is already a Game/Countdown going on");
		}
		else{
			console.log("Making a Player wait their turn!!");
			Pac.to(socket.id).emit('Wait!');
		}
	});
	
	//Lower Counter by one
	socket.on('Lower Count', function() {
		if(loading >= 6){
			loading -= 1;
		}
	});
	
	//Send the Player their information!!!
	socket.on('Ready Player', function() {
		var playerID=0;
			console.log("The client's ID!!!!!!!!:" + socket.id);
			for(var x = 0; x < PacPlayers.length-1; x++){
				if(PacPlayers[PacPlayers.length-1].id == socket.id)
					playerID=x;
			}
			
		var sendData = {
						playerNo: (playerID+1)
						};
		Pac.to(PacPlayers[playerID].id).emit('PlayerInfo',sendData);
		
		
		
		/**
		
		Pac.emit('Add Pellets', 
				data={
					futureNode:temp,
					xLoc:nodes[temp].x,
					yLoc:nodes[temp].y
					});
			**/
			
			function gameCountDownFunction(){
				gameCountdown--;
				//console.log(gameCountdown + " seconds til the game starts")
				if(gameCountdown == 0){
					console.log("Starting Game!!");
					clearInterval(IntervalID);
					PacStatus = "Active";
					fruitIntervalID = setInterval(myCallback, 1000);
					//console.log("Next Fruit Countdown: " + fruitCountDown);
				}
				
			}
			
			function myCallback() {
				//console.log("Fruit Countdown: "+fruitCountDown);
				fruitCountDown--;
				if(fruitCountDown == 0){
					insertItems();
					fruitCountDown = Math.floor(Math.random()*50)+20;
					console.log("Next Fruit Countdown: " + fruitCountDown);
				}
					
				//var data;
				//Dom.emit('Countdown',scores = {count:loading});	
			  
				if(PacStatus != "Active"){
					clearInterval(fruitIntervalID);
				}
			}
	});
	//Prints list of Players
	socket.on('Print List of Players', function() {
		for(var x =0; x<PacPlayers.length;x++)
			console.log("Player "+(x+1)+" with the id:"+PacPlayers[x].id);
		
		addPellets();
	});
	
	//Players update direction
	//Player1 updates
	socket.on('player 1', function(sendData) {
		PlayersTables[0].IntendedDirection = sendData.direction;
		
		//Direction is East and we want to go back (West)
		if(PlayersTables[0].Direction == "East" && PlayersTables[0].IntendedDirection == "West"){
			PlayersTables[0].Direction = "West";
			
			PlayersTables[0].oldNode = PlayersTables[0].prevNode;
			PlayersTables[0].prevNode = PlayersTables[0].currNode;
			PlayersTables[0].currNode = PlayersTables[0].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P1 Updates', data={ node:PlayersTables[0].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P1 = "omw";
		}
		else if(PlayersTables[0].Direction == "South" && PlayersTables[0].IntendedDirection == "North" && PlayersTables[0].prevNode != 41 && PlayersTables[0].prevNode != 40){
			PlayersTables[0].Direction = "North";
			PlayersTables[0].oldNode = PlayersTables[0].prevNode;
			PlayersTables[0].prevNode = PlayersTables[0].currNode;
			PlayersTables[0].currNode = PlayersTables[0].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P1 Updates', data={ node:PlayersTables[0].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P1 = "omw";
		}
		else if(PlayersTables[0].Direction == "West" && PlayersTables[0].IntendedDirection == "East"){
			PlayersTables[0].Direction = "East";
			PlayersTables[0].oldNode = PlayersTables[0].prevNode;
			PlayersTables[0].prevNode = PlayersTables[0].currNode;
			PlayersTables[0].currNode = PlayersTables[0].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P1 Updates', data={ node:PlayersTables[0].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P1 = "omw";
			
		}
		else if(PlayersTables[0].Direction == "North" && PlayersTables[0].IntendedDirection == "South" && PlayersTables[0].prevNode != 41 && PlayersTables[0].prevNode != 40){
			PlayersTables[0].Direction = "South";
			PlayersTables[0].oldNode = PlayersTables[0].prevNode;
			PlayersTables[0].prevNode = PlayersTables[0].currNode;
			PlayersTables[0].currNode = PlayersTables[0].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P1 Updates', data={ node:PlayersTables[0].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P1 = "omw";
		}
		
	});
	
	//Player2 updates
	socket.on('player 2', function(sendData) {
		//P1Direction="North",P1IntendedDirection,oldNode,prevNode,currNode;
		//console.log("Received: "+sendData.direction);
		PlayersTables[1].IntendedDirection = sendData.direction;
		var pos =1;		
		
		if(PlayersTables[pos].Direction == "East" && PlayersTables[pos].IntendedDirection == "West"){
			PlayersTables[1].Direction = "West";
			PlayersTables[1].oldNode = PlayersTables[1].prevNode;
			PlayersTables[1].prevNode = PlayersTables[1].currNode;
			PlayersTables[1].currNode = PlayersTables[1].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P2 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P2 = "omw";
		}
		else if(PlayersTables[pos].Direction == "South" && PlayersTables[pos].IntendedDirection == "North" && PlayersTables[pos].prevNode != 41 && PlayersTables[pos].prevNode != 40){
			PlayersTables[1].Direction = "North";
			PlayersTables[1].oldNode = PlayersTables[1].prevNode;
			PlayersTables[1].prevNode = PlayersTables[1].currNode;
			PlayersTables[1].currNode = PlayersTables[1].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P2 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P2 = "omw";
		}
		else if(PlayersTables[pos].Direction == "West" && PlayersTables[pos].IntendedDirection == "East"){
			PlayersTables[pos].Direction = "East";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P2 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P2 = "omw";
		}
		else if(PlayersTables[pos].Direction == "North" && PlayersTables[pos].IntendedDirection == "South" && PlayersTables[pos].prevNode != 41 && PlayersTables[pos].prevNode != 40){
			PlayersTables[pos].Direction = "South";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P2 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P2 = "omw";
		}
		
	});
	
	//Player3 updates
	socket.on('player 3', function(sendData) {
		//P1Direction="North",P1IntendedDirection,oldNode,prevNode,currNode;
		//console.log("Received: "+sendData.direction);
		PlayersTables[2].IntendedDirection = sendData.direction;
		var pos =2;		
		
		if(PlayersTables[pos].Direction == "East" && PlayersTables[pos].IntendedDirection == "West"){
			PlayersTables[pos].Direction = "West";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P3 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P3 = "omw";
		}
		else if(PlayersTables[pos].Direction == "South" && PlayersTables[pos].IntendedDirection == "North" && PlayersTables[pos].prevNode != 41 && PlayersTables[pos].prevNode != 40){
			PlayersTables[pos].Direction = "North";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P3 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P3 = "omw";
		}
		else if(PlayersTables[pos].Direction == "West" && PlayersTables[pos].IntendedDirection == "East"){
			PlayersTables[pos].Direction = "East";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P3 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P3 = "omw";
		}
		else if(PlayersTables[pos].Direction == "North" && PlayersTables[pos].IntendedDirection == "South" && PlayersTables[pos].prevNode != 41 && PlayersTables[pos].prevNode != 40){
			PlayersTables[pos].Direction = "South";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P3 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P3 = "omw";
		}
		
	});
	
	//Player4 updates
	socket.on('player 4', function(sendData) {
		//P1Direction="North",P1IntendedDirection,oldNode,prevNode,currNode;
		//console.log("Received: "+sendData.direction);
		PlayersTables[3].IntendedDirection = sendData.direction;
		var pos =3;		
		
		if(PlayersTables[pos].Direction == "East" && PlayersTables[pos].IntendedDirection == "West"){
			PlayersTables[pos].Direction = "West";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P4 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P4 = "omw";
		}
		else if(PlayersTables[pos].Direction == "South" && PlayersTables[pos].IntendedDirection == "North" && PlayersTables[pos].prevNode != 41 && PlayersTables[pos].prevNode != 40){
			PlayersTables[pos].Direction = "North";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P4 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P4 = "omw";
		}
		else if(PlayersTables[pos].Direction == "West" && PlayersTables[pos].IntendedDirection == "East"){
			PlayersTables[pos].Direction = "East";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P4 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P4 = "omw";
		}
		else if(PlayersTables[pos].Direction == "North" && PlayersTables[pos].IntendedDirection == "South" && PlayersTables[pos].prevNode != 41 && PlayersTables[pos].prevNode != 40){
			PlayersTables[pos].Direction = "South";
			PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
			PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
			PlayersTables[pos].currNode = PlayersTables[pos].oldNode;
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P4 Updates', data={ node:PlayersTables[pos].currNode });
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P4 = "omw";
		}
		
	});
	
	//Sockets when Blinky Arrived
	socket.on('Blinky Arrived', function(sendData) {
		var BlinkyCount = 0;
		var players = sendData.Player - 1;
		var sentTheNextNode = false;
		
		try{
			if(PacPlayers[players] == null){
				console.log("B.Missing Player noticed and removed...");
				console.log("B.Player: "+sendData.Player);
				console.log("B.PacPlayers: "+PacPlayers.length);
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");			
			}			
			else if(ghosts[0].Prev != sendData.arrived){
				//console.log("B.This players is at the wrong node("+sendData.arrived+")!!! Correct it now("+ghosts[0].Prev+")!!!!! *****");
				var data={
							futureNode:ghosts[0].Prev,
							xLoc:nodes[ghosts[0].Prev].x,
							yLoc:nodes[ghosts[0].Prev].y
							};
				Pac.to(socket.id).emit('Blinky',data);			
			}			
			else if(PacPlayers[players] != null && ghosts[0].Prev == sendData.arrived){
				PacPlayers[players].Blinky = "arrived";
			
				for(var x=0; BlinkyCount != PlayersTables.length && x < PlayersTables.length; x++)
					if(PacPlayers[x] != null && PacPlayers[x].Blinky == "arrived")
						BlinkyCount++;
				
				if(BlinkyCount >= numberOfPacPlayer){
					data;
					var temp = ghosts[0].Curr;			
					
					Pac.emit('Blinky', 
						data={
							futureNode:temp,
							xLoc:nodes[temp].x,
							yLoc:nodes[temp].y
							});
							
					sentTheNextNode = true;
					//console.log("B*Curr:"+BlinkyPath[0]+"  *Prev:"+temp);
					//console.log("Status: "+ghostStatus);
					if(ghostStatus >= 2 && ghosts[0].targetPlayer >= 0){
						//ensure that the default isn't null
						if(ghosts[0].targetPlayer == null)
							targetPlayer = ghosts[2].targetPlayer = ghostTargeting();
						if(PlayersTables[ghosts[0].targetPlayer] != null && PlayersTables[ghosts[0].targetPlayer].currNode == 40 || PlayersTables[ghosts[0].targetPlayer].currNode == 11){
							ghosts[0].targetNode = 36;					
						}
							
						else if(PlayersTables[ghosts[0].targetPlayer].currNode == 41 || PlayersTables[ghosts[0].targetPlayer].currNode == 36)
							ghosts[0].targetNode = 11;
						else ghosts[0].targetNode = PlayersTables[ghosts[0].targetPlayer].currNode;
					}
					else if(ghostStatus == 0) ghosts[0].targetNode =ghosts[0].Home;
					
					//Blinky A* Search Alg.
					if(ghosts[0].Curr == ghosts[0].targetNode || ghosts[0].targetNode == -1 || ghostStatus == 1) ghosts[0].Curr = loadRandomNode(ghosts[0].Prev,temp);
					else ghosts[0].Curr = loadAstarNode(ghosts[0].Prev, temp, ghosts[0].targetNode);
					
					ghosts[0].Old = ghosts[0].Prev;
					ghosts[0].Prev = temp;
					
					if(ghosts[0].Old == 11 && ghosts[0].Prev == 40){
						ghosts[0].Prev = 36;
					}
					else if(ghosts[0].Old == 36 && ghosts[0].Prev == 41){
						ghosts[0].Prev = 11;
					}
					
					for(var x=0; x < numberOfPacPlayer; x++)
						PacPlayers[x].Blinky = "omw";
				}//else console.log("Gotta wait for everyone else...");
			}
			
		}catch(e){
			console.log("Error occurred: sentTheNextNode = "+sentTheNextNode)
			if(!sentTheNextNode){
				//Send out the data
				var data={
							futureNode:ghosts[0].Prev,
							xLoc:nodes[ghosts[0].Prev].x,
							yLoc:nodes[ghosts[0].Prev].y
							};
				Pac.to(socket.id).emit('Blinky',data);
				
			}
			ghosts[0].Curr = loadRandomNode(ghosts[0].Prev,ghosts[0].Prev);
			ghosts[0].Old = ghosts[0].Prev;
				
			if(ghosts[0].Old == 11 && ghosts[0].Prev == 40){
				ghosts[0].Prev = 36;
			}
			else if(ghosts[0].Old == 36 && ghosts[0].Prev == 41){
				ghosts[0].Prev = 11;
			}
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].Blinky = "omw";
			
			ghosts[0].targetPlayer = ghostTargeting();
		}
	});
	//Sockets when Pinky Arrived
	socket.on('Pinky Arrived', function(sendData) {
		//console.log("P.Received: Player "+sendData.Player+" "+sendData.status+" the Prev is "+ghosts[1].Prev);
		
		var PinkyCount=0;
		var players= sendData.Player - 1;
		var sentTheNextNode = false;
			/**
			if(PacPlayers[players] != null)
				PacPlayers[players].Pinky = "arrived";
			
			for(var x=0; PinkyCount != PacPlayers.length && (x < numberOfPacPlayer) && x< PacPlayers.length; x++)
				if(PacPlayers[x] != null && PacPlayers[x].Pinky == "arrived")
					PinkyCount++;
			**/
		try{
			if(PacPlayers[players] == null){
				console.log("P.Missing Player noticed and removed...");
				console.log("P.Player: "+sendData.Player);
				console.log("P.PacPlayers: "+PacPlayers.length);
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");			
			}			
			else if(ghosts[1].Prev != sendData.arrived){
				//console.log("P.This players is at the wrong node("+sendData.arrived+")!!! Correct it now("+ghosts[1].Prev+")!!!!! *****");
				var data={
							futureNode:ghosts[1].Prev,
							xLoc:nodes[ghosts[1].Prev].x,
							yLoc:nodes[ghosts[1].Prev].y
							};
				Pac.to(socket.id).emit('Pinky',data);			
			}			
			else if(PacPlayers[players] != null && ghosts[1].Prev == sendData.arrived){
				PacPlayers[players].Pinky = "arrived";
				
				for(var x=0; PinkyCount != PlayersTables.length && x < PlayersTables.length; x++)
					if(PacPlayers[x] != null && PacPlayers[x].Pinky == "arrived")
						PinkyCount++;			
				
				//console.log("P:"+PinkyCount+" - "+PacPlayers.length+" Number of Pac Players: "+numberOfPacPlayer);
				if(PinkyCount >= numberOfPacPlayer){
					data;
					var temp = ghosts[1].Curr;
					//temp is the node that sent out
					
					Pac.emit('Pinky', 
						data={
							futureNode:temp,
							xLoc:nodes[temp].x,
							yLoc:nodes[temp].y
							});
					
					sentTheNextNode = true;
					/**
					if(ghostStatus != 0){
						if(PlayersTables[0].currNode == 40 || PlayersTables[0].currNode == 11)
							PinkyTarget = 36
						else if(PlayersTables[0].currNode == 41 || PlayersTables[0].currNode == 36)
							PinkyTarget = 11
						else PinkyTarget = PlayersTables[0].currNode;
					}
					**/
					
					if(ghostStatus >= 2 && ghosts[1].targetPlayer >= 0){
						//ensure that the default isn't null
						if(ghosts[1].targetPlayer == null) 
							targetPlayer = ghosts[2].targetPlayer = ghostTargeting();
						if(PlayersTables[ghosts[1].targetPlayer] != null && PlayersTables[ghosts[1].targetPlayer].currNode == 40 || PlayersTables[ghosts[1].targetPlayer].currNode == 11){
							ghosts[1].targetNode = 36;					
						}					
						else if(PlayersTables[ghosts[1].targetPlayer].currNode == 41 || PlayersTables[ghosts[1].targetPlayer].currNode == 36)
							ghosts[1].targetNode = 11;
						else{ // Pinky target node are exactly two nodes in the direction of the target Pac-man
							var Pinkysteps=0;
							ghosts[1].targetNode = PlayersTables[ghosts[1].targetPlayer].currNode;
							
							
							while(Pinkysteps <= 2){
								if(nodes[ghosts[1].targetNode].North != -1 && PlayersTables[ghosts[1].targetPlayer].Direction == "North")
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].North;
								
								else if(nodes[ghosts[1].targetNode].East != -1 && PlayersTables[ghosts[1].targetPlayer].Direction == "East")
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].East;
								
								else if(nodes[ghosts[1].targetNode].South != -1 && PlayersTables[ghosts[1].targetPlayer].Direction == "South")
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].South;
								
								else if(nodes[ghosts[1].targetNode].West != -1 && PlayersTables[ghosts[1].targetPlayer].Direction == "West")
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].West;
									
								else if(nodes[ghosts[1].targetNode].North != -1)
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].North;
									
								else if(nodes[ghosts[1].targetNode].East != -1)
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].East;
									
								else if(nodes[ghosts[1].targetNode].South != -1)
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].South;
								
								else if(nodes[ghosts[1].targetNode].West != -1)
									ghosts[1].targetNode = nodes[ghosts[1].targetNode].West;
								
								Pinkysteps++;
							}
							
						} 
					}
					else if(ghostStatus == 0) ghosts[1].targetNode = ghosts[1].Home;
					
					//Pinky A* Search Alg. 
					if(ghosts[1].Curr == ghosts[1].targetNode || ghosts[1].targetNode == -1 || ghostStatus == 1) ghosts[1].Curr = loadRandomNode(ghosts[1].Prev,temp);
					else ghosts[1].Curr = loadAstarNode(ghosts[1].Prev, temp, ghosts[1].targetNode);
					
					ghosts[1].Old = ghosts[1].Prev;
					ghosts[1].Prev = temp;
					
					if(ghosts[1].Old == 11 && ghosts[1].Prev == 40){
						ghosts[1].Prev = 36;
					}
					else if(ghosts[1].Old == 36 && ghosts[1].Prev == 41){
						ghosts[1].Prev = 11;
					}
					
					for(var x=0; x < numberOfPacPlayer; x++)
						PacPlayers[x].Pinky = "omw";
				}//else console.log("Gotta wait for everyone else...");
			}
		}catch(e){
			console.log("P.Error occured: sentTheNextNode = "+sentTheNextNode)
			if(!sentTheNextNode){
				//Send out the data
				var data={
							futureNode:ghosts[1].Prev,
							xLoc:nodes[ghosts[1].Prev].x,
							yLoc:nodes[ghosts[1].Prev].y
							};
				Pac.to(socket.id).emit('Pinky',data);
				
			}
			ghosts[1].Curr = loadRandomNode(ghosts[1].Prev,ghosts[1].Prev);
			ghosts[1].Old = ghosts[1].Prev;
				
			if(ghosts[1].Old == 11 && ghosts[1].Prev == 40){
				ghosts[1].Prev = 36;
			}
			else if(ghosts[1].Old == 36 && ghosts[1].Prev == 41){
				ghosts[1].Prev = 11;
			}
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].Pinky = "omw";
			
			ghosts[1].targetPlayer = ghostTargeting();
		}
	});
	//Sockets when Inky Arrived
	socket.on('Inky Arrived', function(sendData) {
		var InkyCount=0, targetPlayer = 25;
		if(ghosts[2] != null) targetPlayer = ghosts[2].targetPlayer;
		var players= sendData.Player - 1;
		var sentTheNextNode = false;
		
		try{
			if(PacPlayers[players] == null){
				console.log("I.Missing Player noticed and removed...");
				console.log("I.Player: "+sendData.Player);
				console.log("I.PacPlayers: "+PacPlayers.length);
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");			
			}			
			else if(ghosts[2].Prev != sendData.arrived){
				//console.log("I.This players is at the wrong node("+sendData.arrived+")!!! Correct it now("+ghosts[2].Prev+")!!!!! *****");
				var data={
							futureNode:ghosts[2].Prev,
							xLoc:nodes[ghosts[2].Prev].x,
							yLoc:nodes[ghosts[2].Prev].y
							};
				Pac.to(socket.id).emit('Inky',data);			
			}	
			
			else if(PacPlayers[players] != null && ghosts[2].Prev == sendData.arrived){
				PacPlayers[players].Inky = "arrived";
				
				for(var x=0; InkyCount != PlayersTables.length && x < PlayersTables.length; x++)
					if(PacPlayers[x] != null && PacPlayers[x].Inky == "arrived")
						InkyCount++;
					
				if(InkyCount >= numberOfPacPlayer){
					var data;
					//var temp = InkyPath.shift();
					var temp = ghosts[2].Curr;
					Pac.emit('Inky', 
						data={
							futureNode:temp,
							xLoc:nodes[temp].x,
							yLoc:nodes[temp].y
							});
					sentTheNextNode = true;
					if(ghostStatus >= 2 && ghosts[2].targetPlayer >= 0){
						//ensure that the default isn't null
						if(ghosts[2].targetPlayer == null)
							targetPlayer = ghosts[2].targetPlayer = ghostTargeting();
						
						if(PlayersTables[ghosts[2].targetPlayer] != null && PlayersTables[ghosts[2].targetPlayer].currNode == 40 || PlayersTables[ghosts[2].targetPlayer].currNode == 11){
							
							ghosts[2].targetNode = 36;					
						}					
						else if(PlayersTables[ghosts[2].targetPlayer].currNode == 41 || PlayersTables[ghosts[2].targetPlayer].currNode == 36)
							ghosts[2].targetNode = 11;
						else{//Inky will attack from a far off point but from the center
							var Inkysteps=0;
							ghosts[2].targetNode = PlayersTables[ghosts[2].targetPlayer].currNode;
							
							
							while(Inkysteps <= 2){
								if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].North != -1 && nodes[PlayersTables[ghosts[2].targetPlayer].currNode].y < 0)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].North;
								
								else if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].East != -1 && nodes[PlayersTables[ghosts[2].targetPlayer].currNode].x < 0)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].East;
								
								else if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].South != -1 && nodes[PlayersTables[ghosts[2].targetPlayer].currNode].y > 0)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].South;
								
								else if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].West != -1 && nodes[PlayersTables[ghosts[2].targetPlayer].currNode].x > 0)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].West;
									
								else if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].North != -1)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].North;
									
								else if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].East != -1)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].East;
									
								else if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].South != -1)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].South;
								
								else if(nodes[PlayersTables[ghosts[2].targetPlayer].currNode].West != -1)
									ghosts[2].targetNode = nodes[PlayersTables[ghosts[2].targetPlayer].currNode].West;
								
								Inkysteps++;
							}						
						} 
					}
					else if(ghostStatus == 0) ghosts[2].targetNode = ghosts[2].Home;
					//Inky A* Search Alg. 
					if(ghosts[2].Curr == ghosts[2].targetNode || ghosts[2].targetNode == -1 || ghostStatus == 1) ghosts[2].Curr = loadRandomNode(ghosts[2].Prev,temp);
					else ghosts[2].Curr = loadAstarNode(ghosts[2].Prev, temp, ghosts[2].targetNode);	
					ghosts[2].Old = ghosts[2].Prev;
					ghosts[2].Prev = temp;
					if(ghosts[2].Old == 11 && ghosts[2].Prev == 40){
						ghosts[2].Prev = 36;
					}
					else if(ghosts[2].Old == 36 && ghosts[2].Prev == 41){
						ghosts[2].Prev = 11;
					}
					
					for(var x=0; x < numberOfPacPlayer; x++)
						PacPlayers[x].Inky = "omw";
				}
			}
		}catch(e){
			//console.log("I.Error occurred: sentTheNextNode = "+sentTheNextNode)
			//console.log(sendData);
			if(!sentTheNextNode){
				//Send out the data
				var data={
							futureNode:ghosts[2].Prev,
							xLoc:nodes[ghosts[2].Prev].x,
							yLoc:nodes[ghosts[2].Prev].y
							};
				Pac.to(socket.id).emit('Inky',data);
				
			}
			ghosts[2].Curr = loadRandomNode(ghosts[2].Prev,ghosts[2].Prev);
			ghosts[2].Old = ghosts[2].Prev;
				
			if(ghosts[2].Old == 11 && ghosts[2].Prev == 40){
				ghosts[2].Prev = 36;
			}
			else if(ghosts[2].Old == 36 && ghosts[2].Prev == 41){
				ghosts[2].Prev = 11;
			}
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].Inky = "omw";
			
			ghosts[2].targetPlayer = ghostTargeting();
		}
	});
	//Sockets when Clyde Arrived
	socket.on('Clyde Arrived', function(sendData) {
		var ClydeCount=0;
		var players= sendData.Player - 1;
		var sentTheNextNode = false;
		
		try{
			if(PacPlayers[players] == null){
				console.log("I.Missing Player noticed and removed...");
				console.log("I.Player: "+sendData.Player);
				console.log("I.PacPlayers: "+PacPlayers.length);
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");			
			}			
			else if(ghosts[3].Prev != sendData.arrived){
				//console.log("I.This players is at the wrong node("+sendData.arrived+")!!! Correct it now("+ghosts[3].Prev+")!!!!! *****");
				var data={
							futureNode:ghosts[3].Prev,
							xLoc:nodes[ghosts[3].Prev].x,
							yLoc:nodes[ghosts[3].Prev].y
							};
				Pac.to(socket.id).emit('Clyde',data);			
			}	
			else if(PacPlayers[players] != null && ghosts[3].Prev == sendData.arrived){
				PacPlayers[players].Clyde = "arrived";		
			
				for(var x=0; ClydeCount != PlayersTables.length && x < PacPlayers.length; x++)
					if(PacPlayers[x] != null && PacPlayers[x].Clyde == "arrived")
						ClydeCount++;
			
			//console.log("Clyde sent "+ClydeCount+" #"+numberOfPacPlayer);
				
				if(ClydeCount >= numberOfPacPlayer){
					var data;
					var temp = ghosts[3].Curr;
					
					Pac.emit('Clyde', 
						data={
							futureNode:temp,
							xLoc:nodes[temp].x,
							yLoc:nodes[temp].y
							});
							
					sentTheNextNode = true;
					
					if(ghostStatus >= 2 && ghosts[3].targetPlayer >= 0){
						//ensure that the default isn't null
						if(ghosts[3].targetPlayer == null)
							targetPlayer = ghosts[2].targetPlayer = ghostTargeting();
						if(PlayersTables[ghosts[3].targetPlayer] != null && PlayersTables[ghosts[3].targetPlayer].currNode == 40 || PlayersTables[ghosts[3].targetPlayer].currNode == 11){
							ghosts[3].targetNode = 36;					
						}					
						else if(PlayersTables[ghosts[3].targetPlayer].currNode == 41 || PlayersTables[ghosts[3].targetPlayer].currNode == 36)
							ghosts[3].targetNode = 11;
						else{//Clyde will attack from a far off point but run away once he gets close
							var runAway = false, littleBroInDanger= false;
							ghosts[3].targetNode = PlayersTables[ghosts[3].targetPlayer].currNode;
							
							if(Math.abs(nodes[PlayersTables[ghosts[3].targetPlayer].currNode].x-nodes[ghosts[3].Curr].x) <= 2 && 
								Math.abs(nodes[PlayersTables[ghosts[3].targetPlayer].currNode].y-nodes[ghosts[3].Curr].y) <= 2)
								runAway = true;
							
								if(runAway && !littleBroInDanger){//if Little brother in danger then this will not work and it will continue his assault 
									 ghosts[3].targetNode = -1;
								}
							} //ghosts[3].targetNode = PlayersTables[ghosts[3].targetPlayer].currNode;
					}
					else if(ghostStatus == 0) ghosts[3].targetNode = ghosts[3].Home;
					
					//Clyde A* Search Alg. 
					if(ghosts[3].Curr == ghosts[3].targetNode || ghosts[3].targetNode == -1 || ghostStatus == 1) ghosts[3].Curr = loadRandomNode(ghosts[3].Prev,temp);
					else ghosts[3].Curr = loadAstarNode(ghosts[3].Prev, temp, ghosts[3].targetNode);
					
					ghosts[3].Old = ghosts[3].Prev;
					ghosts[3].Prev = temp;
					
					if(ghosts[3].Old == 11 && ghosts[3].Prev == 40){
						ghosts[3].Prev = 36;
					}
					else if(ghosts[3].Old == 36 && ghosts[3].Prev == 41){
						ghosts[3].Prev = 11;
					}
					
					
					for(var x=0; x < numberOfPacPlayer; x++)
						PacPlayers[x].Clyde = "omw";
				}
			}
		}catch(e){
			console.log("C.Error occured: sentTheNextNode = "+sentTheNextNode)
			if(!sentTheNextNode){
				//Send out the data
				var data={
							futureNode:ghosts[3].Prev,
							xLoc:nodes[ghosts[3].Prev].x,
							yLoc:nodes[ghosts[3].Prev].y
							};
				Pac.to(socket.id).emit('Clyde',data);
				
			}
			ghosts[3].Curr = loadRandomNode(ghosts[3].Prev,ghosts[3].Prev);
			ghosts[3].Old = ghosts[3].Prev;
				
			if(ghosts[3].Old == 11 && ghosts[3].Prev == 40){
				ghosts[3].Prev = 36;
			}
			else if(ghosts[3].Old == 36 && ghosts[3].Prev == 41){
				ghosts[3].Prev = 11;
			}
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].Clyde = "omw";
			
			ghosts[3].targetPlayer = ghostTargeting();
		}
	});
	//Inserting the Fruit into the Game
	socket.on('Fruits', function() {
		console.log("Fruit Request Received-------------------------------------");
	});
	//Inserting the Pellets into the Game
	socket.on('Pellets', function() {
		console.log("Pellets Requested-------------------------------------");
		addPellets();
	});
	
	//When all of Player 1's PAC-MAN Arrives
	socket.on('Pac 1 Arrived', function(sendData) {
		//console.log("Received from Player "+sendData.Player+" !!!!!!!!!!!!!!!!!!!!!!!!!");
		var P1Count=0;
		var players = sendData.Player - 1;
		if(PacPlayers[players] != null)
			PacPlayers[players].P1 = "arrived";
		
		for(var x=0; P1Count != PacPlayers.length && (x < numberOfPacPlayer) && x< PacPlayers.length; x++)
			if(PacPlayers[x] != null && PacPlayers[x].P1 == "arrived")
				P1Count++;
		
		if(P1Count >= numberOfPacPlayer){
			//console.log("Activated!!!");
			//Check to see if you got the fruit first
			if(PlayersTables[0] != null && fruitNode == PlayersTables[0].currNode){
				/*List of Fruits
				Fruit 0 - Apple
				Fruit 1 - Banana
				Fruit 2 - Cherry
				Fruit 3 - Orange
				Fruit 4 - Pear
				Fruit 5 - Pretzel
				Fruit 6 - Strawberry
				Fruit 7 - Grape
				Item 8	- Pellet
				Item 9 	- Super Pellet
				*/
				if(fruit == 7){
					console.log("Someone got drunk off of grapes lol ..player 1 you good? Grapes were at Node "+fruitNode);
					drunkIntervalID = setInterval(drunkPacmanCallback, 1000);
					PlayersTables[0].status = "Drunk";
					drunkPlayer = 0;
				}
				//Reset fruitNode to -1 
				fruitNode = -1;
				
				Pac.emit('Update Players', data={ fruit:fruit, player:0 });
			}
			
			if(drunkPlayer != 0){
				//Search for intentions for first then continue with whatever option is available
				if(PlayersTables[0].IntendedDirection == "West" && nodes[PlayersTables[0].currNode].West != -1){
					PlayersTables[0].Direction = "West";
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].West;
					//console.log("P1 Arrived: I-West");
				}
				else if(PlayersTables[0].IntendedDirection == "North" && nodes[PlayersTables[0].currNode].North != -1){
					PlayersTables[0].Direction = "North";
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].North;
					//console.log("P1 Arrived: I-North");
				}
				else if(PlayersTables[0].IntendedDirection == "East" && nodes[PlayersTables[0].currNode].East != -1){
					PlayersTables[0].Direction = "East";
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].East;
					//console.log("P1 Arrived: I-East");
				}
				else if(PlayersTables[0].IntendedDirection == "South" && nodes[PlayersTables[0].currNode].South != -1){
					PlayersTables[0].Direction = "South";
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].South;
					//console.log("P1 Arrived: I-South");
				}
				//Continue Direction			
				else if(PlayersTables[0].Direction == "West" && nodes[PlayersTables[0].currNode].West != -1){
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].West;
					//console.log("P1 Arrived: I-West");
				}
				else if(PlayersTables[0].Direction == "North" && nodes[PlayersTables[0].currNode].North != -1){
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].North;
					//console.log("P1 Arrived: I-North");
				}
				else if(PlayersTables[0].Direction == "East" && nodes[PlayersTables[0].currNode].East != -1){
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].East;
					//console.log("P1 Arrived: I-East");
				}
				else if(PlayersTables[0].Direction == "South" && nodes[PlayersTables[0].currNode].South != -1){
					PlayersTables[0].oldNode = PlayersTables[0].prevNode;
					PlayersTables[0].prevNode = PlayersTables[0].currNode;
					PlayersTables[0].currNode = nodes[PlayersTables[0].currNode].South;
					//console.log("P1 Arrived: I-South");
				}
			}
			else{ //if you are drunk go in a random direction
				PlayersTables[0].oldNode = PlayersTables[0].prevNode;
				PlayersTables[0].prevNode = PlayersTables[0].currNode;
				PlayersTables[0].currNode = loadRandomNode(PlayersTables[0].oldNode,PlayersTables[0].prevNode);				
			}//if(drunkPlayer != 0){
			/**
			//Blinky Targeting System Update
			if(P1Direction == "West" && nodes[currNode].West != -1)
				BlinkyTarget = nodes[currNode].West;
			else if(P1Direction == "North" && nodes[currNode].North != -1)
				BlinkyTarget = nodes[currNode].North;
			else if(P1Direction == "East" && nodes[currNode].East != -1)
				BlinkyTarget = nodes[currNode].East;
			else if(P1Direction == "South" && nodes[currNode].South != -1)
				BlinkyTarget = nodes[currNode].South;
			else BlinkyTarget = currNode;
			
			if(BlinkyTarget == 41) BlinkyTarget = 36;
			else if(BlinkyTarget == 40) BlinkyTarget = 11;
			**/
			
			//if(currNode == 41 || currNode == 40)console.log("Curr = "+ currNode);
			
			//Sends out the updates for P1 Pac-Man
			Pac.emit('P1 Updates', data = { node:PlayersTables[0].currNode });
			
			
			if(PlayersTables[0].currNode == 40 && PlayersTables[0].prevNode == 41){
				PlayersTables[0].oldNode = PlayersTables[0].prevNode;
				PlayersTables[0].prevNode = PlayersTables[0].currNode;
				PlayersTables[0].currNode = 36;
				console.log("36a");
			}
			else if(PlayersTables[0].currNode == 41 && PlayersTables[0].prevNode == 40){
				PlayersTables[0].oldNode = PlayersTables[0].prevNode;
				PlayersTables[0].prevNode = PlayersTables[0].currNode;
				PlayersTables[0].currNode = 11;
				console.log("11a");
			}			
			else if (PlayersTables[0].currNode == 41 && PlayersTables[0].prevNode == 36){ //**This one
				PlayersTables[0].oldNode = PlayersTables[0].prevNode;
				PlayersTables[0].prevNode = PlayersTables[0].currNode;
				PlayersTables[0].currNode = 11;
				console.log("11b");
			}
			else if (PlayersTables[0].currNode == 40 && PlayersTables[0].prevNode == 36){
				PlayersTables[0].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[0].prevNode = PlayersTables[0].currNode;
				PlayersTables[0].currNode = 11;
				console.log("11c");
			}
			else if (PlayersTables[0].currNode == 40 && PlayersTables[0].prevNode == 11){ //**This one
				PlayersTables[0].oldNode = PlayersTables[0].prevNode;
				PlayersTables[0].prevNode = PlayersTables[0].currNode;
				PlayersTables[0].currNode = 36;
				console.log("36b");
			}			
			else if (PlayersTables[0].currNode == 41 && PlayersTables[0].prevNode == 11){
				PlayersTables[0].oldNode = PlayersTables[0].prevNode;
				PlayersTables[0].prevNode = PlayersTables[0].currNode;
				PlayersTables[0].currNode = 36;
				console.log("36c");
			}
			else if(PlayersTables[0].currNode == 41 || PlayersTables[0].currNode == 40) console.log("ERROR OCCURED:  P:"+PlayersTables[0].oldNode+"  C:"+PlayersTables[0].currNode);
			
			//console.log("P1 Curr: "+PlayersTables[0].currNode+"  Dir: "+PlayersTables[0].Direction+"  IDir: "+PlayersTables[0].IntendedDirection);
			/**
			if(PlayersTables[0].currNode == 40){
				oldNode = prevNode;
				prevNode = 41;
				PlayersTables[0].currNode = 36;
				console.log("***********Was 40 and changed to "+PlayersTables[0].currNode);
			}
			else if(PlayersTables[0].currNode == 41){
				oldNode = prevNode;
				prevNode = 40;
				PlayersTables[0].currNode = 11;
				console.log("*******Was 41 and changed to "+PlayersTables[0].currNode);
			}
			**/
			//BlinkyTarget = PlayersTables[0].currNode;
			
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P1 = "omw";
		}
	});
	
	//When all of Player 2's PAC-MAN Arrives
	socket.on('Pac 2 Arrived', function(sendData) {
		//console.log("Received from Player "+sendData.Player+" !!!!!!!!!!!!!!!!!!!!!!!!!");
		var P2Count = 0, pos = 1;
		var players = sendData.Player - 1;
		if(PacPlayers[players] != null)
			PacPlayers[players].P2 = "arrived";
		
		for(var x=0; P2Count != PacPlayers.length && (x < numberOfPacPlayer) && x< PacPlayers.length; x++)
			if(PacPlayers[x] != null && PacPlayers[x].P2 == "arrived")
				P2Count++;
		
		if(P2Count >= numberOfPacPlayer){
			//console.log("Activated!!!");
			//Check to see if you got the fruit first
			if(PlayersTables[pos] != null && fruitNode == PlayersTables[pos].currNode){
				/*List of Fruits
				Fruit 0 - Apple
				Fruit 1 - Banana
				Fruit 2 - Cherry
				Fruit 3 - Orange
				Fruit 4 - Pear
				Fruit 5 - Pretzel
				Fruit 6 - Strawberry
				Fruit 7 - Grape
				Item 8	- Pellet
				Item 9 	- Super Pellet
				*/
				if(fruit == 7){
					console.log("Someone got drunk off of grapes lol ..player 2 you good? Grapes were at Node "+fruitNode);
					drunkIntervalID = setInterval(drunkPacmanCallback, 1000);
					PlayersTables[pos].status = "Drunk";
					drunkPlayer = pos;
				}
				
				//Reset fruitNode to -1 
				fruitNode = -1;
				
				Pac.emit('Update Players', data={ fruit:fruit, player:pos});
			}
			
			if(drunkPlayer != pos){
				//Search for intentions for first then continue with whatever option is available
				if(PlayersTables[pos].IntendedDirection == "West" && nodes[PlayersTables[pos].currNode].West != -1){
					PlayersTables[pos].Direction = "West";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].West;
				}
				else if(PlayersTables[pos].IntendedDirection == "North" && nodes[PlayersTables[pos].currNode].North != -1){
					PlayersTables[pos].Direction = "North";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].North;
				}
				else if(PlayersTables[pos].IntendedDirection == "East" && nodes[PlayersTables[pos].currNode].East != -1){
					PlayersTables[pos].Direction = "East";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].East;
				}
				else if(PlayersTables[pos].IntendedDirection == "South" && nodes[PlayersTables[pos].currNode].South != -1){
					PlayersTables[pos].Direction = "South";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].South;
				}
				//Continue Direction			
				else if(PlayersTables[pos].Direction == "West" && nodes[PlayersTables[pos].currNode].West != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].West;
				}
				else if(PlayersTables[pos].Direction == "North" && nodes[PlayersTables[pos].currNode].North != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].North;
				}
				else if(PlayersTables[pos].Direction == "East" && nodes[PlayersTables[pos].currNode].East != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].East;
				}
				else if(PlayersTables[pos].Direction == "South" && nodes[PlayersTables[pos].currNode].South != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].South;
				}
				
			}
			else{ //if you are drunk go in a random direction
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = loadRandomNode(PlayersTables[pos].oldNode,PlayersTables[pos].prevNode);				
			}
			
			//copy and paste up to this point
			//Sends out the updates for P2 Pac-Man
			Pac.emit('P2 Updates', data = { node:PlayersTables[pos].currNode });
			
			
			if(PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 41){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36a");
			}
			else if(PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 40){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11a");
			}			
			else if (PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 36){ //**This one
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11b");
			}
			else if (PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 36){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11c");
			}
			else if (PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 11){ //**This one
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36b");
			}			
			else if (PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 11){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36c");
			}
			else if(PlayersTables[pos].currNode == 41 || PlayersTables[pos].currNode == 40) console.log("ERROR OCCURED:  P:"+PlayersTables[pos].prevNode+"  C:"+PlayersTables[pos].currNode);
				
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P2 = "omw";
		}});
	
	//When all of Player 2's PAC-MAN Arrives
	socket.on('Pac 3 Arrived', function(sendData) {
		//console.log("Received from Player "+sendData.Player+" !!!!!!!!!!!!!!!!!!!!!!!!!");
		var P3Count = 0, pos = 2;
		var players = sendData.Player - 1;
		if(PacPlayers[players] != null)
			PacPlayers[players].P3 = "arrived";
		
		for(var x=0; P3Count != PacPlayers.length && (x < numberOfPacPlayer) && x< PacPlayers.length; x++)
			if(PacPlayers[x] != null && PacPlayers[x].P3 == "arrived")
				P3Count++;
		
		if(P3Count >= numberOfPacPlayer){
			//console.log("Activated!!!");
			//Check to see if you got the fruit first
			if(PlayersTables[pos] != null && fruitNode == PlayersTables[pos].currNode){
				/*List of Fruits
				Fruit 0 - Apple
				Fruit 1 - Banana
				Fruit 2 - Cherry
				Fruit 3 - Orange
				Fruit 4 - Pear
				Fruit 5 - Pretzel
				Fruit 6 - Strawberry
				Fruit 7 - Grape
				Item 8	- Pellet
				Item 9 	- Super Pellet
				*/
				if(fruit == 7){
					console.log("Someone got drunk off of grapes lol ..player 3 you good? Grapes were at Node "+fruitNode);
					drunkIntervalID = setInterval(drunkPacmanCallback, 1000);
					PlayersTables[pos].status = "Drunk";
					drunkPlayer = pos;
				}
				
				//Reset fruitNode to -1 
				fruitNode = -1;
				
				Pac.emit('Update Players', data={ fruit:fruit, player:pos});
			}
			
			if(drunkPlayer != pos){
				//Search for intentions for first then continue with whatever option is available
				if(PlayersTables[pos].IntendedDirection == "West" && nodes[PlayersTables[pos].currNode].West != -1){
					PlayersTables[pos].Direction = "West";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].West;
				}
				else if(PlayersTables[pos].IntendedDirection == "North" && nodes[PlayersTables[pos].currNode].North != -1){
					PlayersTables[pos].Direction = "North";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].North;
				}
				else if(PlayersTables[pos].IntendedDirection == "East" && nodes[PlayersTables[pos].currNode].East != -1){
					PlayersTables[pos].Direction = "East";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].East;
				}
				else if(PlayersTables[pos].IntendedDirection == "South" && nodes[PlayersTables[pos].currNode].South != -1){
					PlayersTables[pos].Direction = "South";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].South;
				}
				//Continue Direction			
				else if(PlayersTables[pos].Direction == "West" && nodes[PlayersTables[pos].currNode].West != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].West;
				}
				else if(PlayersTables[pos].Direction == "North" && nodes[PlayersTables[pos].currNode].North != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].North;
				}
				else if(PlayersTables[pos].Direction == "East" && nodes[PlayersTables[pos].currNode].East != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].East;
				}
				else if(PlayersTables[pos].Direction == "South" && nodes[PlayersTables[pos].currNode].South != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].South;
				}
				
			}
			else{ //if you are drunk go in a random direction
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = loadRandomNode(PlayersTables[pos].oldNode,PlayersTables[pos].prevNode);				
			}
			
			//copy and paste up to this point
			//Sends out the updates for P2 Pac-Man
			Pac.emit('P3 Updates', data = { node:PlayersTables[pos].currNode });
			
			
			if(PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 41){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36a");
			}
			else if(PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 40){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11a");
			}			
			else if (PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 36){ //**This one
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11b");
			}
			else if (PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 36){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11c");
			}
			else if (PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 11){ //**This one
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36b");
			}			
			else if (PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 11){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36c");
			}
			else if(PlayersTables[pos].currNode == 41 || PlayersTables[pos].currNode == 40) console.log("ERROR OCCURED:  P:"+PlayersTables[pos].prevNode+"  C:"+PlayersTables[pos].currNode);
				
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P3 = "omw";
		}});
	
	//When all of Player 2's PAC-MAN Arrives
	socket.on('Pac 4 Arrived', function(sendData) {
		//console.log("Received from Player "+sendData.Player+" !!!!!!!!!!!!!!!!!!!!!!!!!");
		var P4Count = 0, pos = 2;
		var players = sendData.Player - 1;
		if(PacPlayers[players] != null)
			PacPlayers[players].P4 = "arrived";
		
		for(var x=0; P4Count != PacPlayers.length && (x < numberOfPacPlayer) && x< PacPlayers.length; x++)
			if(PacPlayers[x] != null && PacPlayers[x].P4 == "arrived")
				P4Count++;
		
		if(P4Count >= numberOfPacPlayer){
			//console.log("Activated!!!");
			//Check to see if you got the fruit first
			if(PlayersTables[pos] != null && fruitNode == PlayersTables[pos].currNode){
				/*List of Fruits
				Fruit 0 - Apple
				Fruit 1 - Banana
				Fruit 2 - Cherry
				Fruit 3 - Orange
				Fruit 4 - Pear
				Fruit 5 - Pretzel
				Fruit 6 - Strawberry
				Fruit 7 - Grape
				Item 8	- Pellet
				Item 9 	- Super Pellet
				*/
				if(fruit == 7){
					console.log("Someone got drunk off of grapes lol ..player 4 you good? Grapes were at Node "+fruitNode);
					drunkIntervalID = setInterval(drunkPacmanCallback, 1000);
					PlayersTables[pos].status = "Drunk";
					drunkPlayer = pos;
				}
				
				//Reset fruitNode to -1 
				fruitNode = -1;
				
				Pac.emit('Update Players', data={ fruit:fruit, player:pos});
			}
			
			if(drunkPlayer != pos){
				//Search for intentions for first then continue with whatever option is available
				if(PlayersTables[pos].IntendedDirection == "West" && nodes[PlayersTables[pos].currNode].West != -1){
					PlayersTables[pos].Direction = "West";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].West;
				}
				else if(PlayersTables[pos].IntendedDirection == "North" && nodes[PlayersTables[pos].currNode].North != -1){
					PlayersTables[pos].Direction = "North";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].North;
				}
				else if(PlayersTables[pos].IntendedDirection == "East" && nodes[PlayersTables[pos].currNode].East != -1){
					PlayersTables[pos].Direction = "East";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].East;
				}
				else if(PlayersTables[pos].IntendedDirection == "South" && nodes[PlayersTables[pos].currNode].South != -1){
					PlayersTables[pos].Direction = "South";
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].South;
				}
				//Continue Direction			
				else if(PlayersTables[pos].Direction == "West" && nodes[PlayersTables[pos].currNode].West != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].West;
				}
				else if(PlayersTables[pos].Direction == "North" && nodes[PlayersTables[pos].currNode].North != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].North;
				}
				else if(PlayersTables[pos].Direction == "East" && nodes[PlayersTables[pos].currNode].East != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].East;
				}
				else if(PlayersTables[pos].Direction == "South" && nodes[PlayersTables[pos].currNode].South != -1){
					PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
					PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
					PlayersTables[pos].currNode = nodes[PlayersTables[pos].currNode].South;
				}
			}
			else{ //if you are drunk go in a random direction
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = loadRandomNode(PlayersTables[pos].oldNode,PlayersTables[pos].prevNode);				
			}
			
			//copy and paste up to this point
			//Sends out the updates for P2 Pac-Man
			Pac.emit('P4 Updates', data = { node:PlayersTables[pos].currNode });
			
			
			if(PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 41){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36a");
			}
			else if(PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 40){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11a");
			}			
			else if (PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 36){ //**This one
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11b");
			}
			else if (PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 36){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 11;
				console.log("11c");
			}
			else if (PlayersTables[pos].currNode == 40 && PlayersTables[pos].prevNode == 11){ //**This one
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36b");
			}			
			else if (PlayersTables[pos].currNode == 41 && PlayersTables[pos].prevNode == 11){
				PlayersTables[pos].oldNode = PlayersTables[pos].prevNode;
				PlayersTables[pos].prevNode = PlayersTables[pos].currNode;
				PlayersTables[pos].currNode = 36;
				console.log("36c");
			}
			else if(PlayersTables[pos].currNode == 41 || PlayersTables[pos].currNode == 40) console.log("ERROR OCCURED:  P:"+PlayersTables[pos].prevNode+"  C:"+PlayersTables[pos].currNode);
				
			for(var x=0; x < numberOfPacPlayer; x++)
				PacPlayers[x].P4 = "omw";
		}});
	
	//A Player has Died
	socket.on('A Player Died', function(data) {
		console.log("A Player Died.... Player "+data.player+" we have "+(Players.length-1)+" left");
		for(var x = 0; x< Players.length;x++)
			if(Players[x] != null && Players[x].player == data.player){
				console.log(x+". Player "+Players[x].player+" has been terminated...");
				PlayersTables[Players[x].position].status = "Died";
				console.log("There are only "+Players.length+" players left");
				numberOfPacPlayer--;
				var newData = {player : Players[x].player};
				Pac.emit('Player Died', newData);
				Players.splice(x,1);
				//Reassign the Ghost!!!
				if(Players.length > 0){
					if(ghosts[0].targetPlayer == x){
						ghosts[0].targetPlayer = ghostTargeting();
						console.log(ghosts[0].Name+" new target is Player "+(ghosts[0].targetPlayer+1));
					}
					else console.log(ghosts[0].Name+" target is still Player "+(ghosts[0].targetPlayer+1));
					
					if(ghosts[1].targetPlayer == x){
						ghosts[1].targetPlayer =  ghostTargeting();
						console.log(ghosts[1].Name+" new target is Player "+(ghosts[1].targetPlayer+1));
					}
					else console.log(ghosts[1].Name+" target is still Player "+(ghosts[1].targetPlayer+1));
					
					if(ghosts[2].targetPlayer == x){
						ghosts[2].targetPlayer =  ghostTargeting();
						console.log(ghosts[2].Name+" new target is Player "+(ghosts[2].targetPlayer+1));
					}
					else console.log(ghosts[2].Name+" target is still Player "+(ghosts[2].targetPlayer+1));
					
					if(ghosts[3].targetPlayer == x){
						ghosts[3].targetPlayer =  ghostTargeting();
						console.log(ghosts[3].Name+" new target is Player "+(ghosts[3].targetPlayer+1));
					}
					else console.log(ghosts[3].Name+" target is still Player "+(ghosts[3].targetPlayer+1));
				}
				else{
					console.log("");
					console.log("Sorry But... \n ~~~~~~~~~ GAME OVER ~~~~~~~~~ ");
					console.log("");
				}
				console.log("______________________________________");
			}
	});
	//Sends out/Updates the scores to all of the players
	socket.on('Update Scores', function(scores) {
		var Score = {
			P1:-1,
			P2:-1,
			P3:-1,
			P4:-1		
		}
		
		PlayersTables[scores.Player].PlayerScore += scores.score;
		//console.log("Player "+scores.Player+" ate a pellet");
		//console.log("Player 1: "+PlayersTables[0].PlayerScore+"    Player 2: "+PlayersTables[1].PlayerScore);
		if(PlayersTables.length >=1) Score.P1 = PlayersTables[0].PlayerScore;
		if(PlayersTables.length >=2) Score.P2 = PlayersTables[1].PlayerScore;
		if(PlayersTables.length >=3) Score.P3 = PlayersTables[2].PlayerScore;
		if(PlayersTables.length >=4) Score.P4 = PlayersTables[3].PlayerScore;
		
		Pac.emit('scores',Score);		
	});
	//Inserting the Fruit into the Game
	socket.on('Game Over', function() {
		PacStatus = "Idle";
		PlayersTables = [];
		//Report that the Game is over!
		Pac.emit('Game Over');
		//PacPlayers = [];
		console.log("Pacman Server just became Idle");
		numberOfPacPlayer=0;
		ghosts = [];
		resetGame();
		if(IntervalID != null)clearInterval(IntervalID);
		if(Countdown != null)clearInterval(Countdown);
		if(fruitIntervalID != null)clearInterval(fruitIntervalID);
		if(ghostIntervalID != null)clearInterval(ghostIntervalID);
		//Resets the drunk players as well
		if(drunkIntervalID != null)clearInterval(drunkIntervalID);
		drunkPlayer = -1
	});
	//Insert all of the level one Nodes
	function loadNodes(){
				// Node Data includes, x and y positioning,
				//NODE 0
				var connection = [1,6];
				var node = {x:-8, y:3, Connectednodes:connection,
							North:-1, East:1,South:6,West:-1};
				nodes.push(node);
				//NODE 1
				var connection = [0,2,4];
				var node = {x:-5, y:3, Connectednodes:connection,
							North:-1, East:2,South:4,West:0};
				nodes.push(node);
				//NODE 2
				var connection = [1,5];
				var node = {x:-2, y:3, Connectednodes:connection,
							North:-1, East:-1,South:5,West:1};
				nodes.push(node);
				//NODE 3
				var connection = [4,7];
				var node = {x:-6, y:1, Connectednodes:connection,
							North:-1, East:4,South:7,West:-1};
				nodes.push(node);
				//NODE 4
				var connection = [1,3,5];
				var node = {x:-5, y:1, Connectednodes:connection,
							North:1, East:5,South:-1,West:3};
				nodes.push(node);
				//NODE 5
				var connection = [2,4,11,21];
				var node = {x:-2, y:1, Connectednodes:connection,
							North:2, East:11,South:21,West:4};
				nodes.push(node);
				//NODE 6
				var connection = [0,7,22];
				var node = {x:-8, y:0, Connectednodes:connection,
							North:0, East:7,South:22,West:-1};
				nodes.push(node);
				//NODE 7
				var connection = [3,6,18];
				var node = {x:-6, y:0, Connectednodes:connection,
							North:3, East:-1,South:18,West:6};
				nodes.push(node);
				//NODE 8
				var connection = [9,12];
				var node = {x:2, y:3, Connectednodes:connection,
							North:-1, East:9,South:12,West:-1};
				nodes.push(node);
				//NODE 9
				var connection = [8,10,14];
				var node = {x:6, y:3, Connectednodes:connection,
							North:-1, East:10,South:14,West:8};
				nodes.push(node);
				//NODE 10////////////////////////////////////////////////
				var connection = [9,15];
				var node = {x:8, y:3, Connectednodes:connection,
							North:-1, East:-1,South:15,West:9};
				nodes.push(node);
				//NODE 11--left off here!!! it needs the Upward node
				var connection = [5,12,40];
				var node = {x:0, y:1, Connectednodes:connection,
							North:40, East:12,South:-1,West:5};
				nodes.push(node);
				//NODE 12
				var connection = [8,11,16];
				var node = {x:2, y:1, Connectednodes:connection,
							North:8, East:-1,South:16,West:11};
				nodes.push(node);
				//NODE 13
				var connection = [14,17];
				var node = {x:5, y:1, Connectednodes:connection,
							North:-1, East:14,South:17,West:-1};
				nodes.push(node);
				//NODE 14
				var connection = [9,13,15];
				var node = {x:6, y:1, Connectednodes:connection,
							North:9, East:15,South:-1,West:13};
				nodes.push(node);
				//NODE 15
				var connection = [10,14,29];
				var node = {x:8, y:1, Connectednodes:connection,
							North:10, East:-1,South:29,West:14};
				nodes.push(node);
				//NODE 16
				var connection = [12,17,31];
				var node = {x:2, y:0, Connectednodes:connection,
							North:12, East:17,South:31,West:-1};
				nodes.push(node);
				//NODE 17
				var connection = [13,16];
				var node = {x:5, y:0, Connectednodes:connection,
							North:13, East:-1,South:-1,West:16};
				nodes.push(node);
				//NODE 18
				var connection = [7,19];
				var node = {x:-6, y:-1, Connectednodes:connection,
							North:7, East:19,South:-1,West:-1};
				nodes.push(node);
				//NODE 19
				var connection = [18,23];
				var node = {x:-5, y:-1, Connectednodes:connection,
							North:-1, East:-1,South:23,West:18};
				nodes.push(node);
				//NODE 20////////////////////////////////////////////////
				var connection = [21,24];
				var node = {x:-3, y:-2, Connectednodes:connection,
							North:-1, East:21,South:24,West:-1};
				nodes.push(node);
				//NODE 21
				var connection = [5,20,30];
				var node = {x:-2, y:-2, Connectednodes:connection,
							North:5, East:30,South:-1,West:20};
				nodes.push(node);
				//NODE 22
				var connection = [6,23,25];
				var node = {x:-8, y:-3, Connectednodes:connection,
							North:6, East:23,South:25,West:-1};
				nodes.push(node);
				//NODE 23
				var connection = [19,22,24,26];
				var node = {x:-5, y:-3, Connectednodes:connection,
							North:19, East:24,South:26,West:22};
				nodes.push(node);
				//NODE 24
				var connection = [20,23,27];
				var node = {x:-3, y:-3, Connectednodes:connection,
							North:20, East:-1,South:27,West:23};
				nodes.push(node);
				//NODE 25
				var connection = [22,26];
				var node = {x:-8, y:-5, Connectednodes:connection,
							North:22, East:26,South:-1,West:-1};
				nodes.push(node);
				//NODE 26
				var connection = [23,25,27];
				var node = {x:-5, y:-5, Connectednodes:connection,
							North:23, East:27,South:-1,West:25};
				nodes.push(node);
				//NODE 27
				var connection = [24,26,36];
				var node = {x:-3, y:-5, Connectednodes:connection,
							North:24, East:36,South:-1,West:26};
				nodes.push(node);
				//NODE 28
				var connection = [29,34];
				var node = {x:6, y:-1, Connectednodes:connection,
							North:-1, East:29,South:34,West:-1};
				nodes.push(node);
				//NODE 29
				var connection = [15,28,35];
				var node = {x:8, y:-1, Connectednodes:connection,
							North:15, East:-1,South:35,West:28};
				nodes.push(node);
				//NODE 30////////////////////////////////////////////////
				var connection = [21,31,36];
				var node = {x:0, y:-2, Connectednodes:connection,
							North:-1, East:31,South:36,West:21};
				nodes.push(node);
				//NODE 31
				var connection = [16,30,32];
				var node = {x:2, y:-2, Connectednodes:connection,
							North:16, East:-1,South:32,West:30};
				nodes.push(node);
				//NODE 32
				var connection = [31,33];
				var node = {x:2, y:-3, Connectednodes:connection,
							North:31, East:33,South:-1,West:-1};
				nodes.push(node);
				//NODE 33
				var connection = [32,34,37];
				var node = {x:3, y:-3, Connectednodes:connection,
							North:-1, East:34,South:37,West:32};
				nodes.push(node);
				//NODE 34
				var connection = [28,33,35,38];
				var node = {x:6, y:-3, Connectednodes:connection,
							North:28, East:35,South:38,West:33};
				nodes.push(node);
				//NODE 35
				var connection = [29,34,39];
				var node = {x:8, y:-3, Connectednodes:connection,
							North:29, East:-1,South:39,West:34};
				nodes.push(node);
				//NODE 36
				var connection = [27,30,37,41];
				var node = {x:0, y:-5, Connectednodes:connection,
							North:30, East:37,South:41,West:27};
				nodes.push(node);
				//NODE 37
				var connection = [36,33];
				var node = {x:3, y:-5, Connectednodes:connection,
							North:33, East:-1,South:-1,West:36};
				nodes.push(node);
				//NODE 38
				var connection = [34,39];
				var node = {x:6, y:-5, Connectednodes:connection,
							North:34, East:39,South:-1,West:-1};
				nodes.push(node);
				//NODE 39
				var connection = [38,35];
				var node = {x:8, y:-5, Connectednodes:connection,
							North:35, East:-1,South:-1,West:38};
				nodes.push(node);
				//NODE 40// This node is meant for the Ghost to be lead upward
				var connection = [36];
				var node = {x:0, y:5, Connectednodes:connection,
							North:41, East:-1,South:11,West:-1};
				nodes.push(node);
				//NODE 41// This node is meant for the Ghost to be lead downward
				var connection = [11];
				var node = {x:0, y:-7.5, Connectednodes:connection,
							North:36, East:-1,South:-1,West:-1};
				nodes.push(node);
	}
	
	/**function randomPacPlayer(){
		if(PacPlayers.length > 0){
			var count = 0;
			for(var x = 0; x < PacPlayers.length; x++){
				if(PacPlayers[x].status == "Still Playing")
					count++;				
			}
			
			//Count the number of Players that are still playing and then now select a Player from the random
			if(count > 0){
				
				//return 
			}			
			else{
				console.log("Yeah... it looks like all the Player are gone man... sorry")
				return -1;
			}				
		}
		else return -1;
	}**/
	
	//Add more pellets onto the Board
	function addPellets(){
		var pelletsLocations=[];
		var pellets;
		var PSize = Math.floor(Math.random()*10)+5;
		var NumberOfSuperPellets=1;
		//console.log("Pells Started-------------------------------------");
		//Outer loop checks to see if we have ten Pellets path yet
		while(pelletsLocations.length <=PSize){
			//console.log("Pells length: "+pelletsLocations.length);
			pellets = Math.floor(Math.random()*(nodes.length-3));
			var newPath = false;
			var NodeDirection =['0','1','2','3'];
			var nodePath;
			//console.log("Find Paths from Pellets: "+pellets);
			//Ensures that the random Pellet Path is accessible and is not already taken
			while(NodeDirection.length>0 && !newPath){
				newPath = true;
				//console.log("Pellets: "+pellets+"   NDL: "+NodeDirection.length+" directions left");
				var loc = Math.floor(Math.random()*NodeDirection.length);
				var randomNode = NodeDirection[loc];
				NodeDirection.splice(loc,1); //Removes the random direction from the Direction List
				
				//Split into directions
				//nodePath=nodes[pellets].Connectednodes[randomNode];
				
				if(randomNode == 0){
					nodePath=nodes[pellets].North
					//console.log("Pellets: "+pellets+"  Direction: North  nodePath: "+nodePath);
				}
				else if(randomNode == 1){
					nodePath=nodes[pellets].East
					//console.log("Pellets: "+pellets+"  Direction: East  nodePath: "+nodePath);
				}
				else if(randomNode == 2){
					nodePath=nodes[pellets].South
					//console.log("Pellets: "+pellets+"  Direction: South  nodePath: "+nodePath);
				}
				else if(randomNode == 3){
					nodePath=nodes[pellets].West
					//console.log("Pellets: "+pellets+"  Direction: West  nodePath: "+nodePath);
				}
				
				if(nodePath == -1 || nodePath == 40 || nodePath == 41)
					newPath = false;
				
				//Checks whether the Path has any errors
				for(var x=0; x<pelletsLocations.length && newPath; x++){
					if((pellets==pelletsLocations[x].start && nodePath==pelletsLocations[x].end)||
					   (pellets==pelletsLocations[x].end && nodePath==pelletsLocations[x].start)||
					   (nodePath== 40 || nodePath == 36))//idk yet
						newPath = false;
				}
				
				
				//If the newPath is still acceptable
				if(newPath){
					var AddSuperPellet= false;
					if(NumberOfSuperPellets>0 && Math.floor(Math.random()*100)>5){
						NumberOfSuperPellets--;
						AddSuperPellet= true;
					}
					
					var data = {
						start: pellets,
						end: nodePath,
						superPellet:AddSuperPellet
					}
					
					pelletsLocations.push(data);
							//console.log("Pells length: "+pelletsLocations.length);
				}	
				
			}
		}
		var pelletsData;
		Pac.emit('insert Pellets', pelletsData={pelletsList:pelletsLocations});		
	}
	//Loads a random node
	function loadRandomNode(prevNode,currNode){		
		var nodeNumber = prevNode;
		//console.log("Curr:"+currNode+"  Prev:"+prevNode);
		while(nodeNumber == prevNode || (currNode == 11 && nodeNumber == 40 && prevNode == 41) || (currNode == 36 && nodeNumber == 41 && prevNode == 40)){
			nodeNumber=nodes[currNode].Connectednodes[Math.floor(Math.random()*nodes[currNode].Connectednodes.length)];
		}
		//console.log("Returning:"+nodeNumber);
		//console.log("----------------------------");
		return nodeNumber;
	}
	//Follows along the border of the Layout
	function loadBorderNodes(prevNode,currNode){
		//Order goes
			// 0 - 1 - 2 - 5 - 11 - 12 - 8 - 9 - 10 - 15 - 29 - 35 - 39 - 38 - 34 - 33 - 37 - 36 - 27 - 26 - 25 - 22 - 6 - 0
		
		var nodeNumber;
		
		if(currNode == 0) prevNode = 1;
		else if(currNode == 1) prevNode = 2;
		else if(currNode == 2) prevNode = 5;
		else if(currNode == 5) prevNode = 11;
		else if(currNode == 11) prevNode = 12;
		else if(currNode == 12) prevNode = 8;
		else if(currNode == 8) prevNode = 9;
		else if(currNode == 9) prevNode = 10;
		else if(currNode == 10) prevNode = 15;
		else if(currNode == 15) prevNode = 29;
		else if(currNode == 29) prevNode = 35;
		else if(currNode == 35) prevNode = 39;
		else if(currNode == 39) prevNode = 38;
		else if(currNode == 38) prevNode = 34;
		else if(currNode == 34) prevNode = 33;
		else if(currNode == 33) prevNode = 37;
		else if(currNode == 37) prevNode = 36;
		else if(currNode == 36) prevNode = 27;
		else if(currNode == 27) prevNode = 26;
		else if(currNode == 26) prevNode = 25;
		else if(currNode == 25) prevNode = 22;
		else if(currNode == 22) prevNode = 6;
		else if(currNode == 6) prevNode = 0;
		
		return nodeNumber;
	}
	//Load Ghost info into the Array
	function loadGhost(){
		//Blinky - 0
		var g = {
			Name: "Blinky",
			Status: "Wander",
			Curr: 11,
			Prev: 11,
			Old: 11,
			targetPlayer:-1,
			targetNode:0,
			Home:10
		}
		ghosts.push(g);
		//Pinky - 1
		g = {
			Name: "Pinky",
			Status: "Wander",
			Curr: 11,
			Prev: 11,
			Old: 11,
			targetPlayer:-1,
			targetNode:0,
			Home:0
		}
		ghosts.push(g);
		//Inky - 2
		g = {
			Name: "Inky",
			Status: "Wander",
			Curr: 11,
			Prev: 11,
			Old: 11,
			targetPlayer:-1,
			targetNode:-1,
			Home:39
		}
		ghosts.push(g);
		//Clyde - 3
		g = {
			Name: "Clyde",
			Status: "Wander",
			Curr: 11,
			Prev: 11,
			Old: 11,
			targetPlayer:-1,
			targetNode:-1,
			Home:25
		}
		ghosts.push(g);
		console.log("The Ghost info has been loaded!!!");
	}
	
	var nodesList;
	function resetAstarList(){
		//First Empty the nodesList
		nodesList = [];
		for(var x=0;x<nodes.length;x++){
			var node = {id:x, x:nodes[x].x, y:nodes[x].y, Connectednodes:nodes[x].Connectednodes,
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
			if(prevNode == 11) currNode = 36;
			else if(prevNode == 36) currNode = 11;
			else if(prevNode == 40) currNode = 36;
			else if(prevNode == 41) currNode = 11;
			else if(nodes[prevNode].North != -1) currNode = nodes[prevNode].North;
			else if(nodes[prevNode].East != -1) currNode = nodes[prevNode].East;
			else if(nodes[prevNode].South != -1) currNode = nodes[prevNode].South;
			else currNode = nodes[prevNode].West;
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
				return path[path.length-1];
				//return path.reverse();
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
	
	//New Target for the Ghost
	function ghostTargeting(){
		var numberOfPlayersPlaying = 0;
		
		for(var x=0;x< Players.length;x++)
			if(Players[x] != null && PlayersTables[Players[x].position].status == "Still Playing")
				numberOfPlayersPlaying++;
			
		var target= Math.floor(Math.random()*numberOfPlayersPlaying-1)+1;
		var position = 0, count = 0;		
		
		for(var x=0;x< Players.length;x++)
			if(Players[x] != null && PlayersTables[Players[x].position].status  == "Still Playing"){
				count++;
				
				if(count == target) return Players[x].position
				else position = Players[x].position;
			}
		return position;
	}
	
	//Inserting Fruits/Items
	function insertItems(){
		fruit = Math.floor(Math.random()*8);
		//fruit = 7; to test out the grapes
		fruitNode = Math.floor(Math.random()*(nodes.length-4));
		Pac.emit('insert Fruit', 
		
				data={
					fruitNo:fruit,
					node:fruitNode
					});

		//console.log("Node: "+fruitNode+"  Fruit No: "+fruit);
	}
	
	//Drunk Pac-Man lol of of Grapes 
	function drunkPacmanCallback(){
		drunkCountdown--;
		
		if(PacStatus != "Active") clearInterval(drunkIntervalID);					
		else if(drunkCountdown <= 0){
			clearInterval(drunkIntervalID);
			if(PlayersTables[drunkPlayer] != null)
				PlayersTables[drunkPlayer].status = "Still Playing";
			drunkCountdown = 10;
			drunkPlayer = -1;
		}
	}
	
	function list_all_the_players(){
		for(var x = 0; x< Players.length; x++ )
			console.log(x+". Player "+Players[x].player+"  Position: "+Players[x].position);
		
	}
	//Reset everything
	function resetGame(){
		//BlinkyPath=[11,11];
		//PinkyPath=[11,11];
		//InkyPath=[11,11];
		//ClydePath=[11,11];
		numberOfPacPlayer = 0;
		//P1Direction="North",P1IntendedDirection="North",oldNode=-1,prevNode=25,currNode=22;
		ghostCoundDown = 15;
		fruitCountDown = 31;
		fruit = -1;
		fruitNode = -1;
		//PacPlayers = [];
		PlayersTables = [];
		Players = [];
		ghosts = [];
		
		gameCountdown = 6;
		ghostStatus = 1;
	}
	
	//Leaving  Pac-Man Group
    socket.on('disconnect', function() {
		console.log(socket.id+" has Disconnected!");
		for(var x=0; x<PacPlayers.length;x++)
			if(PacPlayers[x].id == socket.id){
				console.log("Player "+x+" has been removed from the PacPlayers Table");
				PacPlayers.splice(x,1);
				numberOfPacPlayer--;
				if(PacPlayers.length == 0) resetGame();
			}
			else console.log(PacPlayers[x].id+" != "+socket.id)
		
		
		if(PacPlayers.length == 0){
			PacStatus = "Idle";
			PlayersTables = [];
			console.log("Pacman Server just became Idle");
			numberOfPacPlayer=0;
			resetGame();
			if(IntervalID != null)clearInterval(IntervalID);
			if(Countdown != null)clearInterval(Countdown);
			if(fruitIntervalID != null)clearInterval(fruitIntervalID);
			if(ghostIntervalID != null)clearInterval(ghostIntervalID);
		}
    });
	
});


//Dominoes SERVER!!!!!!!//////////////////////////////////////////////////////
var DominoesPlayers = [], Dominoes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];
var numberOfDominoesPlayer=0, DominoesTurn = 0, PlayersPassed=0;
var Dom = io.of('/domino');
var DominoesStatus = "Idle"; //Whether the Dominoes Game is "Active", "Idle" or currently in a "Countdown"
Dom.on('connection', function(socket){
	console.log("Dominoes Served has been accessed");
	
	console.log("The client's ID:" + socket.id);
	var data ={
		id: socket.id,
		username:null,
		status: "active",
		count:1000,
		wins:0
	};
	DominoesPlayers.push(data);
	console.log("The client with the ID:"+DominoesPlayers[DominoesPlayers.length-1].id+" has been added.");
	
	//Reshuffle the Dominoes
	socket.on('Shuffle Dominoes Requests', function() {
		console.log("Reshuffled!");
		Dominoes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];
	});
	
	//Prints list of Players
	socket.on('Print List of Players', function() {
		for(var x =0; x<DominoesPlayers.length;x++)
			console.log("Player "+(x+1)+" with the id:"+DominoesPlayers[x].id);
		
		start30SecTimer();
	});

	//Start Count Down to the Next Game
	socket.on('Start Count to the Next Game', function(){
		if(DominoesStatus == "Idle"){
			//var loading= 31;			
			var loading= 31;			
			DominoesStatus = "Countdown";
			var intervalID = setInterval(myCallback, 1000);
			
			function myCallback() {
				loading--;
				console.log("Countdown: "+loading);
				var data;
				Dom.emit('Countdown',scores = {count:loading});	
			  
				if(loading == 0){
					clearInterval(intervalID);
					DominoesStatus = "Active";
					Hand_Out_Dominoes();
				}
			}
			//Source: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
		}
		else
			console.log("Ignore because there is already a count down going on");
	});
	
	//When a player sends in a domino, send back out to all the players!!!
	socket.on('played_Domino', function (data){
		//console.log("Received:"+data.dominoNumber);
		//console.log("Old count:"+DominoesPlayers[data.player-1].count+" new count:"+data.count);
		//console.log("count:"+data.count);
		DominoesPlayers[data.player-1].count = data.count;
		//console.log("count for Player "+data.player+" has been updated to "+DominoesPlayers[data.player-1].count);
		
		var d = {
			dominoNumber:data.dominoNumber,
			preferred_side:data.preferred_side,
			Player: data.player%numberOfDominoesPlayer,
			PlayerDominoes: (data.player-1)%numberOfDominoesPlayer
		};
		
		if(d.Player == 0)
			d.Player == 1;
		if(d.PlayerDominoes == 0)
			d.PlayerDominoes == numberOfDominoesPlayer-1;
		
		Dom.emit('Add_Domino_to_Board',d);
		PlayersPassed=0;
		if(data.handSize!=0)
			Dom.to(DominoesPlayers[(d.Player)].id).emit('CanYouPlay');
		else{
			for(var x=0; x<DominoesPlayers.length;x++)
			if(DominoesPlayers[x].id == socket.id){
				DominoesPlayers[x].wins++;
				console.log("wins:"+DominoesPlayers[x].wins);
				Dom.emit('Winner', data={winner:x});
				DominoesTurn=x+1;
			}
			DominoesStatus = "Idle";
			//Time to Send out the scores
			sendScores();
		}
	});
	
	//A Player Has Passed
	socket.on('No I Can Not Play', function (data){
		var d;
		console.log("PAssed");
		PlayersPassed++;
		
		if(PlayersPassed < DominoesPlayers.length){
			Dom.emit('Player Passed', d= { Player: data.player%numberOfDominoesPlayer, Number:numberOfDominoesPlayer});
			Dom.to(DominoesPlayers[(d.Player)].id).emit('CanYouPlay');
		}
		else{
			console.log("Game Blocked!!!");
			var count = DominoesPlayers[0].count, winningPlayer = 0;
			console.log("Player 1 - count: " + count);			
			
			for(var x=1; x < DominoesPlayers.length && x < 4;x++){
				console.log("Player "+(x+1)+" - count: " + DominoesPlayers[x].count);
				if(DominoesPlayers[x].count < count){
					count = DominoesPlayers[x].count;
					winningPlayer = x;
				}
			}
			Dom.emit('Blocked',data={winner:(winningPlayer),count:count});
			DominoesPlayers[winningPlayer].wins++;
			DominoesStatus = "Idle";
			sendScores();
		}
	});
	
	//A Player Has moves
	socket.on('Yes I Can Play', function (data){
		console.log("playing.... option "+data.no+" from player "+(data.player+1));
		PlayersPassed=0;
	});
	
	//Hands out the Dominoes to the player
    function Hand_Out_Dominoes() {			
		console.log("Sharing out the Dominoes");
		numberOfDominoesPlayer=0;
		if(DominoesTurn >= DominoesPlayers.length){
			DominoesTurn=0;
		}
		
		if(Dominoes.length<=DominoesPlayers.length*7 || Dominoes.length < 28)
			Dominoes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];
		
		if(DominoesPlayers.length >= 5){
			console.log("We HAVE OVER 4 PLAYERS!!!!!!! LOOK INTO THIS!!!!");
			for(var x = 0; x < DominoesPlayers.length;x++){
				console.log("Person "+x+" with the id: "+ DominoesPlayers[x].id);
			}
		}
		
		for(var x = 0;(x<4)&&(x < DominoesPlayers.length);x++){
			//Trial for Random Dominoes Selection
			var hand = {
						one: -1,
						two: -1,
						three: -1,
						four: -1,
						five: -1,
						six: -1,
						seven: -1,
						player:(x+1),
						turn:0
					};
			//Random First Domino
			var place = Math.floor(Math.random()*Dominoes.length);
			hand.one = Dominoes[place];
			//console.log("First: "+Dominoes[place]);
			Dominoes.splice(place, 1);  
			//Random Second Domino
			place = Math.floor(Math.random()*Dominoes.length);
			hand.two = Dominoes[place];
			//console.log("Second: "+Dominoes[place]);
			Dominoes.splice(place, 1);
			//Random Third Domino
			place = Math.floor(Math.random()*Dominoes.length);
			hand.three = Dominoes[place];
			//console.log("Third: "+Dominoes[place]);
			Dominoes.splice(place, 1);
			//Random Fourth Domino
			place = Math.floor(Math.random()*Dominoes.length);
			hand.four = Dominoes[place];
			//console.log("Fourth: "+Dominoes[place]);
			Dominoes.splice(place, 1);
			//Random Fifth Domino
			place = Math.floor(Math.random()*Dominoes.length);
			hand.five = Dominoes[place];
			//console.log("Fifth: "+Dominoes[place]);
			Dominoes.splice(place, 1);
			//Random Sixth Domino
			place = Math.floor(Math.random()*Dominoes.length);
			hand.six = Dominoes[place];
			//console.log("Sixth: "+Dominoes[place]);
			Dominoes.splice(place, 1);
			//Random Seventh Domino
			place = Math.floor(Math.random()*Dominoes.length);
			hand.seven = Dominoes[place];
			//console.log("Seventh: "+Dominoes[place]);
			Dominoes.splice(place, 1);
			
			//io.emit('Hand',hand);
			//Dom.emit('Hand',hand)
			
			Dom.to(DominoesPlayers[x].id).emit('Hand',hand);
			numberOfDominoesPlayer++;
			//https://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js
		}
		//Send out the Scores
		sendScores();
		//Forces anyone that have double 6 to play it first!!!
		//Dom.emit('PlayDoubleSix');
    };
	
	//Gives enough time for everyone to connect
	function start30SecTimer(){
		console.log( new Date());
		//setTimeout(function(){ console.log( new Date()) }, 30000);
		console.log("START TIMER!!!!!!");
		for(var x = 6; x>1; x--){
			setTimeout(function(){
				//sendOutCount(x);
				Dom.emit('count',data={count:count});
				count++;
				}, 2000);
			
		}
		//it just does console log and then comes back and do what it has left to do
		//console.log( new Date());
	}
	
	//Sends out/Updates the scores to all of the players
	function sendScores(){
		
		var scores = {
						P1:-1,
						P2:-1,
						P3:-1,
						P4:-1
					};
		
		if(DominoesPlayers[0] != null){
			scores.P1 = DominoesPlayers[0].wins;
			console.log("P1:"+DominoesPlayers[0].wins)
		}
		if(DominoesPlayers[1] != null){
			scores.P2 = DominoesPlayers[1].wins;
			console.log("P2:"+DominoesPlayers[1].wins)
		}
		if(DominoesPlayers[2] != null){
			scores.P3 = DominoesPlayers[2].wins;
			console.log("P3:"+DominoesPlayers[2].wins)
		}
		if(DominoesPlayers[3] != null){
			scores.P4 = DominoesPlayers[3].wins;
			console.log("P4:"+DominoesPlayers[3].wins)
		}
		
		Dom.emit('scores',scores);		
	}
	
	//Leaving  Dominoes Group
    socket.on('disconnect', function() {
		console.log(socket.id+" has Disconnected!");
		for(var x=0; x<DominoesPlayers.length;x++){
			if(DominoesPlayers[x].id == socket.id){
				console.log("Player "+x+" has been removed from the DominoesPlayers Table");
				DominoesPlayers.splice(x,1);
				numberOfDominoesPlayer--;
			}
			else console.log(DominoesPlayers[x].id+" != "+socket.id)
		}
		if(DominoesPlayers.length == 0){
			DominoesStatus = "Idle";
			console.log("Dominoes Server just became Idle");
		}
    });
});
