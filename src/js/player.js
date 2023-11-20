//Player
var playerMesh = null,
    playerCollider = null,
    input = {left:0, right:0, up:0, down:0},
    rotSpeed = 0.05,
    speed = 0.5;

function createPlayerCollision(){
    const geometry = new THREE.BoxGeometry( 1, 3, 1 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ); 
    playerCollider = new THREE.Mesh( geometry, material ); 
    playerCollider.position.y = 1.5
    scene.add( playerCollider );
}

/*function loadPlayerOBJMTL(path, nameMTL, nameOBJ){
    //Load MTL (Textura)
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(path);
    mtlLoader.setPath(path);
    mtlLoader.load(nameMTL, function(material){
        material.preload();
        //Load OBJ (Mesh)
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path)
        objLoader.setMaterials(material);
        objLoader.load(nameOBJ, function(OBJ) {
            scene.add(OBJ);
            playerMesh = OBJ;
    })
});
}*/

function movementPlayer(){
    if(input.right == 1){
        playerMesh.rotation.y -= rotSpeed;
        playerCollider.rotation.y -= rotSpeed;
    } 
    if(input.left == 1){
        playerMesh.rotation.y += rotSpeed;
        playerCollider.rotation.y += rotSpeed;
    }
    if(input.up == 1){
        playerCollider.position.z -= Math.cos(playerCollider.rotation.y)*speed;
        playerCollider.position.x -= Math.sin(playerCollider.rotation.y)*speed;
        playerMesh.position.z -= Math.cos(playerMesh.rotation.y)*speed;
        playerMesh.position.x -= Math.sin(playerMesh.rotation.y)*speed;
    }
    if(input.down == 1){
        playerCollider.position.z += Math.cos(playerCollider.rotation.y)*speed;
        playerCollider.position.x += Math.sin(playerCollider.rotation.y)*speed;
        playerMesh.position.z += Math.cos(playerMesh.rotation.y)*speed;
        playerMesh.position.x += Math.sin(playerMesh.rotation.y)*speed;
    }
}

document.addEventListener("keydown", (e)=> {
    switch(e.key){
        case "d":
            input.left = 1;
            break;
        case "a":
            input.right = 1;
            break;
        case "w":
            input.up = 1;
            break;
        case "s":
            input.down = 1;
            break;
    }
});

document.addEventListener("keyup", (e)=> {
    switch(e.key){
        case "d":
            input.left = 0;
            break;
        case "a":
            input.right = 0;
            break;
        case "w":
            input.up = 0;
            break;
        case "s":
            input.down = 0;
            break;
    }
});