class Cannon{
	constructor(x, y, z, radius){

		this.cannon = new THREE.Object3D();
		this.wireframe = true;
		this.center = new THREE.Group();
		this.shootpoint = new THREE.Group();
		this.material = new THREE.MeshBasicMaterial();
		this.cannonMesh = null;
		this.angle = 0;

		this.build(x, y, z, radius);
	}


	build(x, y, z, radius){'use strict';
  
		this.addCylinder(x, y, z, radius, radius *1.5, 12, 10, 1);
	}


	addCylinder(x, y, z, radiusTop, radiusBottom, height, rsegments, hsegments){
  	'use strict';

  		var geometry, mesh;
  		geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, rsegments, hsegments);
  		this.material = this.getMaterial("green")
  		this.cannonMesh = new THREE.Mesh(geometry, this.material);

  		this.center.position.set(x,y,z);
  		this.center.add(this.cannonMesh);
			this.cannonMesh.add(this.shootpoint);
			this.shootpoint.position.set(0,6,0);
  		this.cannonMesh.rotateZ(Math.PI/2);
  		this.cannonMesh.position.set(0,0,0);

  		this.cannon.add(this.center);
  	}

  	getCannon(){
    	return this.cannon;
  	}

		getCenter(){
    	return this.center;
  	}

  	shootingAngle(angle){'use strict';
  		this.center.rotateY(angle);
			this.angle += angle;
  	}

  	getMaterial(color){ 'use strict';
    	if(color == "red"){
      		return new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: this.wireframe});
    	}
    	else if(color == "green"){
      		return new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: this.wireframe });
    	}
  	}

  	changeColor(color){
  		if(color == "green"){
  			this.material.color.setHex(0Xff0000);
  		}else if(color == "red"){
  			this.material.color.setHex(0X00ff00);
  		}
  	}

}
