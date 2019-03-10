const express = require('express');
const app = express();
const socketIo = require('socket.io');
var five = require('johnny-five')
var Raspi = require('raspi-io').RaspiIO;
var board = new five.Board({
	io: new Raspi()
});

const expressServer = app.listen(8000);
const io = socketIo(expressServer)

board.on("ready", function() {
	
	var motors = new five.Motors([
     { pins: { dir: "GPIO23", pwm: "GPIO18" }, invertPWM: true },
     { pins: { dir: "GPIO26", pwm: "GPIO19" }, invertPWM: true }
   ]);

	var servos = new five.Servos([{
		pin: 'GPIO12',
		pwmRange: [600,2400],
		startAt: 78
	}, {
		pin: 'GPIO13',
		pwmRange: [600,2400],
		startAt: 70
	}]);
	
	//var proximity = new five.Proximity({
		//controller: 'HCSR04',
		//pin: 'GPIO6'
	//})
	
	//proximity.on('data', function() {
		//console.log('Proximity: ')
		//console.log(' cm : ', this.cm)
		//console.log(' in : ', this.in)
		//console.log('----------------')
	//})
	
	//proximity.on('change', function() {
		//console.log('This obstruction has moved.')
	//})
	
	
io.on('connection',(socket)=>{
	socket.on('forward', (dataFromClient)=>{
		console.log("Full speed ahead!");
		motors.forward(255);
	})
	socket.on('backward', ()=> {
		console.log("Backwards");
		motors.reverse(255);
	})
	socket.on('right', ()=> {
		console.log("Turn Right");
		motors[1].forward(200);
		motors[0].reverse(200);
	})
	socket.on('left', ()=> {
		console.log("Turn Left");
		motors[1].reverse(200);
		motors[0].forward(200); 
	})
	socket.on('upright', ()=> {
		motors[1].forward(250);
		motors[0].reverse(150);
	})
	socket.on('stop', ()=>{
		motors.stop();
	})
	socket.on('servoRight', ()=> {
		console.log('Camera Right')
		servos[0].to(0, 500);
	})
	socket.on('servoLeft', ()=> {
		console.log('Camera Left')
		servos[0].to(180, 500);
	})
	socket.on('servoUp', ()=> {
		console.log('Camera Up')
		servos[1].to(0, 500);
	})
	socket.on('servoDown', ()=> {
		console.log('Camera Down')
		servos[1].to(180, 500);
	});
	socket.on('servoHome', ()=> {
		console.log('home')
		servos[0].home()
		servos[1].home()
	})
	socket.on('servoStop', ()=> {
		servos.stop()
	})
	
})



});
