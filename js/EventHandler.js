var lastShot;

class EventHandler{
  constructor(){ 'use strict';
  }

  onResize(){ 'use strict';
    if(currentCamera != cameraTop){
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerHeight > 0 && window.innerWidth > 0) {
          this.currentCamera.aspect = window.innerWidth / window.innerHeight;
          this.currentCamera.updateProjectionMatrix();
      }
    }
    else{
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      var aspect = window.innerHeight / window.innerWidth;

      currentCamera.left = frustumSize / - 2;
      currentCamera.right = frustumSize / 2;
      currentCamera.top = frustumSize * aspect / 2;
      currentCamera.bottom = - frustumSize * aspect / 2;

      currentCamera.updateProjectionMatrix();
      
    }
  }

  onKeyDown(event){ 'use strict';
    switch(event.keyCode){
      //"4" wireframe or not
      case 52:
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
              node.material.wireframe = !node.material.wireframe;
            }});
        break;

      //Mudanca de canhoes
      //"Q" seleciona top cannon
      case 81:
          selectedCannon = cannons[0];
          changeColor = 1;
        break;
      //"W" seleciona middle cannon
      case 87:
          selectedCannon = cannons[1];
          changeColor = 2;
        break;
      //"E" seleciona bottom cannon
      case 69:
          selectedCannon = cannons[2];
          changeColor = 3;
        break;

      //"1" Top view
      case 49:
          topOrtho =  true;
        break;

      //"2" Perspective view of field
      case 50:
          fieldPerspective =  true;
        break;

      //"3" Moving Camera
      case 51:
          shootingPerspective = true;
        break;

      //"left arrow" Controla angulo disparo
      case 37:
          leftArrow = true;
        break;

      //"right arrow"
      case 39:
          rightArrow = true;
        break;

      //"SPACE BAR"
      case 32:
        shoot = true;
        break;

      //"R" Adiciona eixos nas bolas
      case 82:
      for(var i = 0; i<numBalls;i++)
        ballArray[i].ballAxis.visible = !ballArray[i].ballAxis.visible;
        break;
      }
  }


  onKeyUp = function(event){ 'use strict';
    switch(event.keyCode){

    //Controla angulo disparo
    //left arrow
      case 37:
        leftArrow = false;
        break;
    //right arrow
      case 39:
        rightArrow = false;
        break;

    //"Q" seleciona top cannon
      case 81:
         changeColor = false;
        break;
    //"W" seleciona middle cannon
      case 87:
         changeColor = false;
        break;
    //"E" seleciona bottom cannon
      case 69:
         changeColor = false;
        break;

    //1 Top view
      case 49:
        currentCamera = cameraTop;
        currentCamera.updateProjectionMatrix();
        currentCamera.lookAt(scene.position);
        topOrtho =  false;
        break;

    //2 Perspective view of field
      case 50:
        currentCamera = cameraField;
        currentCamera.updateProjectionMatrix();
        currentCamera.lookAt(scene.position);
        fieldPerspective =  false;
        break;

    //3 Moving Camera
      case 51:
        //update the current Camera
        currentCamera = cameraMove.getCamera();
        currentCamera.updateProjectionMatrix();
        cameraMove.update();
        shootingPerspective = false;
        break;

     //SPACE BAR
      case 32:
        shoot = false;
        break;
    }
  }


  handlePossibleEvents(deltaTime){
    if(leftArrow && selectedCannon){
      selectedCannon.shootingAngle(2*deltaTime);
    }

    if(rightArrow && selectedCannon){
      selectedCannon.shootingAngle(-2*deltaTime);
    }

    if(shoot){
      var tmp = clock.getElapsedTime();
      var elapsedShot = tmp - lastShot; 
    }

    if (shoot && elapsedShot > 0.4){
      lastShot = tmp;
      //vai buscar posicao onde criar
      var {x, y, z} = selectedCannon.shootpoint.position;
      var pos = new THREE.Vector3();
      var cannonPos = selectedCannon.center.position;
      selectedCannon.shootpoint.getWorldPosition(pos);
      var tmpball = new Ball(pos.x, pos.y, pos.z, 1); 
      tmpball.addAxis();
      if (ballArray[0].ballAxis.visible == true){
        tmpball.ballAxis.visible = true;
      }
      tmpball.velocity = new THREE.Vector3(pos.x - cannonPos.x, 0,pos.z - cannonPos.z);
      var canRot = selectedCannon.center.rotation.y;
      tmpball.ball.rotateY(selectedCannon.angle);
      tmpball.angle += selectedCannon.angle;
      tmpball.momentum = -1;
      scene.add(tmpball.getBall());
      cameraMove.changeWhoToSpy(tmpball.getBall());
      ballArray.push(tmpball);
      numBalls++;
    }

    if(changeColor){
      for(var i=1; i<=3; i++){
        if(i==changeColor){
          cannons[i-1].changeColor("green");
        }
        else if (i!=changeColor)
          cannons[i-1].changeColor("red");
      }
    }

    if(currentCamera == cameraMove.getCamera()){
      cameraMove.update();
    }
  }

}
