/*  Author(s): Samuel Rendon Rodriguez
    Date of creation: 24/8/2023 9:41
    Date of last modification: 24/8/2023 ?:??
*/

//Variables
var scene = null,
    camera = null, 
    renderer = null,
    SPEED = 0.01,
    cube = null,
    controls = null
var cameraPosition;
var light;
var clock = new THREE.Clock();
var skybox;

var music, 
ambiance,
sharksfx,
turtlesfx,
monkeysfx;
var mute_bool = false;
var skybox_bool = false;

function createThreejs(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, //Field of view
                                         window.innerWidth / window.innerHeight, //Aspect ratio 16:9
                                         0.1, //Near
                                         1000 ); //Far

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById("app")});
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    //controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls = new THREE.FirstPersonControls(camera, renderer.domElement);
    controls.constrainVertical = true;
    controls.verticalMax = Math.PI / 3.5;
    controls.verticalMin = Math.PI / 1.3;
    cameraPosition = new THREE.Vector3(0,10,25);
    camera.position.copy(cameraPosition);

    //Callers
    //CreateGeometry();
    createLights("AmbientLight");
    loadModels();
    addSkybox();    

    //loadOBJMTL("../models/OBJ_MTL/", "knight.mtl", "knight.obj");
    //createPlayerCollision();
    //loadGLTF();
    //createCollectible();
    initSound3D();
    animate();
    testLight();
}

function testLight(){
    light = new THREE.DirectionalLight( 0x6488ea );
    light.name = "directionallight";
    //const helper = new THREE.DirectionalLightHelper( light, 5 );
    light.position.y = 50
    scene.add(light);
    //scene.add( helper );
}

function loadModels(){
    loadOBJMTL("src/models/Zoo/", "Zoo.mtl", "Zoo.obj", 10);
    loadOBJMTL("src/models/Water/", "Water.mtl", "Water.obj", 10, true);
    loadOBJMTL("src/models/Tiburon/", "tiburon.mtl", "tiburon.obj", 5, false, "Tiburon","../src/sound/soundtrack.mp3");
    loadOBJMTL("src/models/Tortu/", "tortu.mtl", "tortu.obj", 3, false, "Tortu");
    loadOBJMTL("src/models/Mono/", "mono.mtl", "mono.obj", 1, false, "Mono");
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addSkybox(){
    var loader = new THREE.TextureLoader();
    loader.load("src/img/nightbox.jpeg", function ( texture ) {
        var geometry = new THREE.SphereGeometry( 250, 20, 20 );
        var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, side : THREE.DoubleSide} );
        skybox = new THREE.Mesh( geometry, material );
        scene.add( skybox );
} );
}
function toggleSkybox(){
    var selected_skybox;
    var new_material;
    if(!skybox_bool){
        skybox_bool = true;
        selected_skybox = "src/img/skybox.jpg"
    }
    else{
        skybox_bool = false;
        selected_skybox = "src/img/nightbox.jpeg"
    }
    skybox.material.map = THREE.ImageUtils.loadTexture(selected_skybox);
}

function loadOBJMTL(path, nameMTL, nameOBJ, scale_multiplier = 1.0, waterMaterial = false, uniqueName = null, sound_file = null){
    //Load MTL (Textura)
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(path);
    mtlLoader.setPath(path);
    mtlLoader.load(nameMTL, function(material){
        material.preload();
        //Load OBJ (Mesh)
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path);
        objLoader.setMaterials(material);
        objLoader.load(nameOBJ, function(OBJ) {
            //Water material
            OBJ.traverse(function(child){
                if (waterMaterial == true){
                    if (child instanceof THREE.Mesh){
                        child.material.transparent = true;
                        child.material.opacity = 0.5;
                    }
                }
            });

            //Unique name setter
            if(uniqueName != null){
                OBJ.name = uniqueName;
            }
          
            //Setters de scale y posicion
            OBJ.scale.x = scale_multiplier;
            OBJ.scale.y = scale_multiplier;
            OBJ.scale.z = scale_multiplier;
            scene.add(OBJ);
    })
});
}

function createLights(typeLights){
    //PointLight, SpotLight, AmbientLight
    switch(typeLights){
        case "PointLight":
            light = new THREE.PointLight( 0xff0000, 1, 100 );
            light.position.set( 50, 50, 50 );
            scene.add( light );
            break;
        case "AmbientLight":
            light = new THREE.AmbientLight( 0xffffff, 0.1 ); // soft white light
            scene.add( light );
            break;
        case "SpotLight":
            light = new THREE.SpotLight( 0xffffff );
            light.position.set( 0, 8000, 0 );
            light.castShadow = true;
            scene.add( light );
            break;
    }

}

function toggleMute(){
    music.togglemute(); //Ejectuta la funcion toggleMute() en la libreria Sound
    var mute_sprite = document.getElementById("mute_icon"); 
    if(!mute_bool){ //No muteado
        mute_bool = true;
        mute_sprite.src = "src/img/icons/unmute2.png" //Muted sprite
    } 
    else{ //Muteado
        mute_bool = false;
        mute_sprite.src = "src/img/icons/unmute1.png" //Muted sprite
    }
}

//Funcion para iniciar la musica y los efectos de sonido
function initSound3D() { 
    music = new Sound(["src/sound/soundtrack.mp3"], 50, scene, {
        position: {x:0, y:0, z:0},
    });
    ambiance = new Sound(["src/sound/ambiance.mp3"], 50, scene, {
        position: {x:0, y:0, z:0},
    });
    sharksfx = new Sound(["src/sound/shark_sfx.mp3"], 60, scene, {
        position: {x:0, y:0, z:0}
    });
    turtlesfx = new Sound(["src/sound/water_sound.mp3"], 100, scene, {
        position: {x:0, y:0, z:0}
    });
    monkeysfx = new Sound(["src/sound/monkey_sfx.mp3"], 30, scene, {
        position: {x:0, y:0, z:0}
    });
}

//Funcion de proceso fisica, se ejecuta cada frame disponible
function animate() {
	requestAnimationFrame( animate );
    renderer.render( scene, camera );

    //skybox.rotation.y += 0.001;
    //Bloque de loop para los SFX
    sharksfx.play();
    turtlesfx.play();
    monkeysfx.play();
    music.play();
    ambiance.play();
    //Bloque de update (sonido espacial) para los SFX
    sharksfx.update(camera);
    turtlesfx.update(camera);
    monkeysfx.update(camera);


    controls.update(1.0);

    //Cada animal posee su propia animacion
    if(scene.getObjectByName("Tiburon")){
        sharkAnimation();
    }
    if(scene.getObjectByName("Tortu")){
        turtleAnimation();
    }
    if(scene.getObjectByName("Mono")){
        monkeyAnimation();
    }

    //Codigo para la luz rotatoria
    if(scene.getObjectByName("directionallight")){ //Solamente se ejecuta cuando la luz ya este cargada en escena
        var speed = 0.5; 
        var radius = 63;
        var delta = clock.getDelta();
        scene.getObjectByName("directionallight").position.x = (Math.cos(clock.elapsedTime * -speed) * radius);
        scene.getObjectByName("directionallight").position.z = (Math.sin(clock.elapsedTime * -speed) * radius);
    }
   }

////////////////////////////////////////////////////////////////////////////
////////////////////SECCION DE ANIMACION DE LOS ANIMALES////////////////////
////////////////////////////////////////////////////////////////////////////
//Cada funcion de animacion se ejecuta cada frame
//Al final de cada bloque, hara una de las dos cosas:
//1. Asignara su respectivo bloque de texto
//2. Ajustara las posiciones de los efectos de sonido espaciales
function sharkAnimation(){
    var tiburon = scene.getObjectByName("Tiburon");
    var speed = 0.15; 
    var radius = 67;
    var delta = clock.getDelta();
    tiburon.position.y = 10
    tiburon.position.x = (Math.cos(clock.elapsedTime * speed) * radius);
    tiburon.position.z = (Math.sin(clock.elapsedTime * speed) * radius) ;
    tiburon.rotation.y += 0.01
    textBox(tiburon, "tiburon-text", 35);
    sharksfx.position = tiburon.position;
}

function turtleAnimation(){
    var tortuga = scene.getObjectByName("Tortu");
    var speed = 0.05; 
    var radius = 67;
    var delta = clock.getDelta();
    tortuga.position.y = 10
    tortuga.position.x = (Math.cos(clock.elapsedTime * -speed) * radius);
    tortuga.position.z = (Math.sin(clock.elapsedTime * -speed) * radius);
    textBox(tortuga, "tortu-text");
    turtlesfx.position = tortuga.position;
}

function monkeyAnimation(){
    var mono = scene.getObjectByName("Mono");
    mono.position.y = 26;
    mono.position.x = 10;
    mono.lookAt(camera.position);
    textBox(mono, "mono-text", 10)
    monkeysfx.position = mono.position;
}

//La funcion textBox recibe tres parametros
//1. La instancia del modelo al que se le asignara el bloque de texto
//2. La id del bloque de texto, encontrada en index.html
//3. Parametro opcional, la distancia customizada (tiburon y mono)
function textBox(model_instance, text_box_id, distance = 20){
    const boxPosition = new THREE.Vector3();
    boxPosition.setFromMatrixPosition(model_instance.matrixWorld);
    boxPosition.project(camera);
    var widthHalf = document.getElementById('app').width/2;  
    var heightHalf = document.getElementById('app').height/2;
    var rect = document.getElementById('app').getBoundingClientRect();
    boxPosition.x = rect.left + (boxPosition.x * widthHalf) + widthHalf ;
    boxPosition.y = rect.top -(boxPosition.y * heightHalf) + heightHalf ; 
    document.getElementById(text_box_id).style.top = `${boxPosition.y}px`;
    document.getElementById(text_box_id).style.left = `${boxPosition.x}px`;
    if(model_instance.position.distanceTo(camera.position) <= distance){
        document.getElementById(text_box_id).style.visibility = `visible`;
        camera.lookAt(model_instance.position);
    }
    else{
        document.getElementById(text_box_id).style.visibility = `hidden`;
    }
}

