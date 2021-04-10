var camera, scene, renderer, clock, delta, eventHandler;
var fence;

var cannons = new Array(3);
var selectedCannon;

var ball;
var ballArray = [];
var numBalls = 0;

var leftArrow = false, rightArrow = false, changeColor=false;
var shoot = false;

var currentCamera, cameraTop, cameraField, cameraMove;
var topOrtho = false, fieldPerspective = false, shootingPerspective = false;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var frustumSize = 150;
var aspect = SCREEN_HEIGHT/SCREEN_WIDTH;

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function createScene(){ 'use strict';
    scene = new THREE.Scene();
    fence = new Fence(0, 2, 0, 50);
    //scene.add(new THREE.AxesHelper(10));
    scene.add(fence.getFenceBody());

    cannons[0] = new Cannon(20, 0, -15, 1.5);
    scene.add(cannons[0].getCannon());

    cannons[1] = new Cannon(20, 0, 0, 1.5);
    scene.add(cannons[1].getCannon());

    cannons[2] = new Cannon(20, 0, 15, 1.5);
    scene.add(cannons[2].getCannon());

    var randomBalls = randomIntFromInterval(50,100);

    for(var i=0; i<randomBalls; i++){
        var x = randomIntFromInterval(-48,-2);
        var z = randomIntFromInterval(-23, 23);
        var m = randomIntFromInterval(10,60);
        var velocity = new THREE.Vector3(randomIntFromInterval(-23,0), 0, randomIntFromInterval(0,23));

        ball = new Ball(x, 0, z,1);
        scene.add(ball.getBall());
        ballArray.push(ball);
        numBalls++;

        ball.addAxis();
        ball.velocity.set(velocity.x, velocity.y, velocity.z);
        ball.momentum = m;
    }
}

function createCamera(){ 'use strict';
    //Orthographic projection from TOP
    cameraTop = new THREE.OrthographicCamera(frustumSize/-2, frustumSize/2, frustumSize *aspect/2, frustumSize*aspect/-2, 0.1, 1000);
    cameraTop.position.y = 100;

    //Perspective of Field
    cameraField = new THREE.PerspectiveCamera(70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
    cameraField.position.x = 43;
    cameraField.position.y = 5;

    //Moving Camera
    cameraMove = new PerspectiveStalker(25, 15, 0, cannons[1].getCannon()); 
    cameraMove.changeWhoToSpy(ball.getBall());

    currentCamera = cameraTop;
    currentCamera.lookAt(scene.position);
}


function render(){ 'use strict';
    renderer.render(scene, currentCamera);
}

function update(){ 'use strict';
    delta = clock.getDelta();

    for(var i = 0; i < numBalls ; i++){
      ballArray[i].checkWallCollisions();
      ballArray[i].checkBallCollisions();
    }

    for(var i = 0; i < numBalls ; i++){
      ballArray[i].update(delta);
    }

    eventHandler.handlePossibleEvents(delta);
}

function init() { 'use strict';
    renderer = new THREE.WebGLRenderer({antialias: true, fullscreen: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    clock = new THREE.Clock({autostart:true});
    lastShot = clock.getElapsedTime();
    eventHandler = new EventHandler();

    createScene();
    createCamera();
    render();

    window.addEventListener("keydown", eventHandler.onKeyDown);
    window.addEventListener("keyup", eventHandler.onKeyUp);
    window.addEventListener("resize", eventHandler.onResize);
}


function animate(){ 'use strict';
  requestAnimationFrame(animate);

  update();
  render();
}
