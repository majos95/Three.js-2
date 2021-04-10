class Ball{
	constructor(x, y, z, radius){'use strict';

		this.ball = new THREE.Object3D();
		this.wireframe = true;
		this.ballMesh = null;
		this.velocity = new THREE.Vector3(0,0,0);
		this.momentum = null;
		this.ballAxis = null;
		this.angle = 0;
		this.fall = false;
		this.originalScale = new THREE.Vector3(0,0,0);
		this.fallingScale = null;

		this.build(x, y, z, radius);
	}

	build(x, y, z, radius){'use strict';

		this.buildSphere(x,y,z, radius, 0, 2*Math.PI, 0, 2*Math.PI, 15, 15);
	}

	buildSphere(x, y, z, radius, phiStart, phiEnd, thetaStart, thetaEnd, widthSegments, heightSegments){ 'use strict';
		var geometry, mesh, material;
		this.ball.position.set(x,y,z);
	    geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiEnd, thetaStart, thetaEnd);
	    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: this.wireframe});
	    this.ballMesh = new THREE.Mesh(geometry,material);

	    this.ballMesh.position.set(0,0,0);
	  	this.ball.add(this.ballMesh);
		this.originalScale = this.ball.scale.clone();
		this.fallingScale = this.ball.scale.clone();
	}


  	addAxis(){
		this.ballAxis = new THREE.AxesHelper(5);
		this.ball.add(this.ballAxis);
		this.ballAxis.visible = false;
  	}

	getBall(){
	  	return this.ball;
	}

	update(deltaTime){
		if(!(this.fall)){
			if (this.momentum > 0){
				this.momentum -= 3*deltaTime;
			}

			if(this.momentum == -1){
				this.momentum = Math.floor((Math.random()*81)+20);
			}

			if(this.momentum >= 0){
				var direction = this.velocity;
				direction.normalize();
				direction.multiplyScalar(deltaTime * this.momentum);
				this.ball.position.add(direction);
				this.ball.rotateZ(this.momentum*deltaTime);
			}
			else {
				this.momentum = -2;
			}
		}

		if(this.fall) {
			this.ball.position.y -= 10*deltaTime;
			this.ball.rotation.z += 10*deltaTime;

			if(currentCamera == cameraTop){
				this.ball.scale.x = this.fallingScale.x;
				this.ball.scale.y = this.fallingScale.y;
				this.ball.scale.z = this.fallingScale.z;
				this.ball.scale.multiplyScalar(0.99);
				this.fallingScale = this.ball.scale.clone();
			}
			else{
				this.ball.scale.x = this.originalScale.x;
				this.ball.scale.y = this.originalScale.y;
				this.ball.scale.z = this.originalScale.z;
		}
	}
}

	checkWallCollisions(){
		var pos = new THREE.Vector3();
		this.ball.getWorldPosition(pos);

		if((pos.x > -1 && this.velocity.x >= 0 && !this.fall) || (pos.z > 25.5 || pos.z < -25.5))  {
			this.fall = true;
		}

		if(pos.y < -40){
			this.ball.visible = false;
			this.ballAxis.visible = false;
		}

		//LEFT WALL @DONE
		if(pos.x < 1 && pos.x > -48.5 && pos.z > 23.5){
			this.ball.position.set(pos.x, 0, 23.5);
			this.velocity.multiplyVectors(this.velocity, new THREE.Vector3(1,1,-1));
			this.momentum = this.momentum*0.85;

			if (this.velocity.x >= 0){
				this.ball.rotation.y += this.angle*2;
				this.angle += this.angle*2;
			}
			else{
				this.ball.rotation.y += -1 * this.angle*2;
				this.angle += -1*this.angle*2;
			}
		}

		//FAR WALL @DONE
		else if(pos.x < -48.5 && pos.z < 23.5 && pos.z > -23.5){
			this.ball.position.set(-48.5 ,0, pos.z);
			this.velocity.multiplyVectors(this.velocity, new THREE.Vector3(-1,1,1));

			this.momentum = this.momentum*0.85;
			this.ball.rotation.y += Math.PI - 2*this.angle;
			this.angle += Math.PI - 2*this.angle;
		}

		//RIGHT WALL @DONE
		else if(pos.x < 1 && pos.x > -48.5 && pos.z < -23.5){
			this.ball.position.set(pos.x ,0, -23.5);
			this.velocity.multiplyVectors(this.velocity, new THREE.Vector3(1,1,-1));
			this.momentum = this.momentum*0.85;

			if (this.velocity.x >= 0){
				this.ball.rotation.y += this.angle*2;
				this.angle += this.angle*2;
			}
			else{
				this.ball.rotation.y += -1 * this.angle*2;
				this.angle += -1*this.angle*2;
			}
		}
	}

	checkBallCollisions(){
		var posA = new THREE.Vector3(0,0,0);
		var posB = new THREE.Vector3(0,0,0);

		var distance, totalMomentum, tmp;

		var velA = new THREE.Vector3(0,0,0);
		var velB= new THREE.Vector3(0,0,0);

		for(var j = 0; j < numBalls; j++){
			if(ballArray[j].ball.visible && ballArray[j] != this){
				//Check if the two are colliding
				this.ball.getWorldPosition(posA);
				ballArray[j].ball.getWorldPosition(posB);
				distance = posA.distanceTo(posB);

				if(distance < 2){
					//em colisao!!!!
					var tmp = this.velocity.clone();
					tmp.setLength(2 - distance);
					tmp.multiplyScalar(-1);
					this.ball.position.add(tmp);

					posA.sub(posB)
					velA = posA;
					velA.y = 0;

					velA.normalize();
					velB = velA.clone();
					velB.multiplyScalar(-1);

					this.velocity = velA.clone();
					ballArray[j].velocity = velB.clone();

					totalMomentum = this.momentum + ballArray[j].momentum;

					ballArray[j].momentum = totalMomentum/2;
					this.momentum = totalMomentum/2;
				}
			}
		}
	}
}
