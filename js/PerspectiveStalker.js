class PerspectiveStalker{
  constructor(x, y, z, object){

    this.x = x; this.y = y; this.z = z;
    this.object = object;
    this.camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.x = x; this.camera.position.y = y; this.camera.position.z = z;
    this.objPos = new THREE.Vector3();

    if(object){
      this.camera.lookAt(this.object.position);
    }
  }

  update(){
    this.object.getWorldPosition(this.objPos);
    this.camera.position.x = this.objPos.x + this.x;
    this.camera.position.y = this.objPos.y + this.y;
    this.camera.position.z = this.objPos.z + this.z;
    this.camera.lookAt(this.objPos);
  }

  changeWhoToSpy(newTarget){
    this.object = newTarget;
  }

  getCamera(){
    return this.camera;
  }

  changePosition(x,y,z){
    this.x = x; this.y = y; this.z = z;
  }
}
