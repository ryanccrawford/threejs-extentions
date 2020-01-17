import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { PartOptions } from "./partbase.js";
import Mpn25g from "./mpn25g.js";
import { RolloverPart } from "./rolloverpart.js";
import components from "./components.js";
import Materials from "./materials.js";
import { Floor, FloorOptions } from "./floor.js";

class thebuilder {
    scene;
    floorRef;
    camera;
    renderer;
    objects = [];
    raycaster;
    chromeMaterial;
    appendToElement;
    mouse;
    height;
    width;
    components;
    mouseDisplay;
    canvas;
    newParts = [];
    floor;
    documentRef;

    constructor(height = 500, width = 800, appendToElement = "") {
        this.components = new components();
        this.height = height;
        this.width = width;
        this.appendToElement = appendToElement;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
       
        this.createCamera();
    }
    createCamera = () => {
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width / this.height,
            1,
            10000
        );
        this.camera.position.set(0, 100, 600);
        this.camera.lookAt(0, 0, 0);
        this.eventCameraReady();
    }
    eventCameraReady = () => {
        this.createScene()
    }
    createScene = () => {
         this.scene = new THREE.Scene();
         //this.scene.background = new THREE.Color(0xf0f0f0);
        this.eventSceneReady();
    }
    eventSceneReady = () => {
        this.createLights()
    }
    createFloor = () => {
        const options = new FloorOptions();
        options.name = "Floor";
        options.gridDivisions = 20
        options.gridLength = 1000;
        options.gridWidth = 1000;
        options.readyCallback = this.onFloorReady.bind(this)
        options.hasGrid = true;
        options.sceneRef = this.scene;
        this.floorRef = new Floor(options)
    }
    onFloorReady = (floor) => {
        this.floor = floor
        this.scene.add(this.floor);
        this.objects.push(this.floor);
    }
    createLights = () => {
        const ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);
       
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);
        this.eventLightsReady();
    }
    eventLightsReady = () => {
            this.createFloor();
        
            
    }
    createRenderer = () => {
         this.renderer = new THREE.WebGLRenderer({
             antialias: true
         });
         this.renderer.setPixelRatio(window.devicePixelRatio);
         this.renderer.setSize(this.width, this.height);
         this.onRendererReady()
     }
     onRendererReady = () => {
        document
        .getElementById(this.appendToElement)
        .appendChild(this.renderer.domElement);
        this.addEventListeners();
        this.clock = new THREE.Clock();
        this.animate();
     }
    attach = (documentRef) => {

            this.documentRef = documentRef;
            this.createRenderer();
    }

    addEventListeners = () => {

        this.renderer.domElement.addEventListener(
            "mousemove",
            this.onDocumentMouseMove
        )

        this.renderer.domElement.addEventListener(
            "mousedown",
            this.onDocumentMouseDown
        );

        window.addEventListener("resize", this.onResize);

        
    
    }
    
    animate = () => {
        
        this.update();
        this.render();
        this.updateMousePosition();
        requestAnimationFrame(this.animate);
    };

    updateMousePosition = () => {
        const newMouseDisplay = this.components.mousePosition(
            this.mouse.x,
            this.mouse.y,
            0,
            "mouse"
        );
        this.components.replaceElement("mouse", newMouseDisplay);
      
    };

    render = () => {
        this.renderer.render(this.scene, this.camera);
    }

    update = () => {
        this.updateMousePosition();
     }

    onResize = event => {
        event.preventDefault();
        const canvas = document.getElementsByTagName("canvas")[0];
        const div = document.getElementById("renderarea");
        this.width = div.clientWidth;
        this.camera.aspect = this.width / this.height;
        canvas.width = this.width;
        this.renderer.setSize(this.width, this.height);
        this.camera.updateProjectionMatrix();
    }

    onDocumentMouseMove = event => {
        event.preventDefault();
        
        const x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1.53;
        const y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1.003;

        this.mouse.set(x, y);
      
    }

 

    onDocumentMouseDown = event => {
        event.preventDefault();

        
    }
}

export default thebuilder;


// const x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1.53;
//         const y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1.003;

//         this.mouse.set(x, y);
//         if (!this.rollOverLoaded) {
//             return;
//         }

//         this.raycaster.setFromCamera(this.mouse, this.camera);

//         const intersects = this.raycaster.intersectObjects(this.objects);

//         if (intersects.length > 0) {
         
            
//             const intersects = this.raycaster.intersectObjects(this.objects);
          
//                 var intersect = intersects[0];
                
//                 if (this.isShiftDown) {
//                     if (intersect.object !== this.floor) {
//                         this.scene.remove(intersect.object);
    
//                         this.objects.splice(this.objects.indexOf(intersect.object), 1);
//                     }
//                 } else {
                    
//                     const voxel = this.rollOverMesh.staticClone();
//                     voxel.setMaterial(this.chromeMaterial);
                    
//                     voxel
//                         .position
//                         .copy(intersect.point)
//                         .add(intersect.face.normal);
    
//                     voxel
//                         .position
//                         .divideScalar(50)
//                         .floor()
//                         .multiplyScalar(50)
//                         .addScalar(50);
                        
//                     this.scene.add(voxel);
//                     this.objects.push(voxel);
//                    // this.camera.lookAt(voxel.position)
//                 }
            

//         }

// if (!this.rollOverLoaded) {
//     return;
// }
// this.raycaster.setFromCamera(this.mouse, this.camera);

// const intersects = this.raycaster.intersectObjects(this.objects);

// if (intersects.length > 0) {
//     const intersect = intersects[0];
    
//     this.rollOverMesh
//         .position
//         .copy(intersect.point)
//         .add(intersect.face.normal);

//     this.rollOverMesh
//         .position
//         .divideScalar(50)
//         .floor()
//         .multiplyScalar(50)
//         .addScalar(50);
        
// }





// let rollOverOptions = new PartOptions();

//         rollOverOptions.material = this.rollOverMaterial;
       
//         rollOverOptions.name = "Rollover Part";
//         rollOverOptions.importFile = "assets/3dmodels/25G.fbx";
//         rollOverOptions.readyCallback = this.onRolloverLoad.bind(this);

//         this.rollOverObject = new RolloverPart(rollOverOptions);
//         this.rollOverObject.getPart();


// onRolloverLoad = (part) => {
//     if(typeof this.rollOverMesh === 'undefined'){
//         this.rollOverMesh = part;
//     }
//     this.scene.add(this.rollOverMesh);

//     this.rollOverLoaded = true;   
   
// }

// this.renderer.domElement.addEventListener(
//     "mousedown",
//     this.onDocumentMouseDown
// );