class Fence{
  constructor(x, y, z, wallSize){
    this.fenceBody = new THREE.Object3D;
    this.wireframe = true;
    this.build(x, y, z, wallSize);
  }

  build(x, y, z, wallSize){
    // Build center wall
    this.buildWall(x, y, z, 1, 10, wallSize);

    // Build left wall
    this.buildWall(x + wallSize/2 - 0.5, y, z + wallSize/2 + 0.5, wallSize, 10, 1);

    // Build right wall
    this.buildWall(x + wallSize/2 - 0.5, y, z - wallSize/2 - 0.5, wallSize, 10, 1);
    this.fenceBody.position.set(x + -2 * wallSize / 2, y , z );
  }

  buildWall(x, y, z, geoW, geoH, geoD){
    var mesh, geometry, material;
    geometry = new THREE.CubeGeometry(geoW, geoH, geoD);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: this.wireframe});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    this.fenceBody.add(mesh);
  }

  getFenceBody(){
    return this.fenceBody;
  }
}
