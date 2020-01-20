import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { PartOptions, OrbitConfig } from "./partbase.js";
import Mpn25g from "./mpn25g.js";
import { RolloverPart } from "./rolloverpart.js";
import components from "./components.js";
import Materials from "./materials.js";
import { Floor, FloorOptions } from "./floor.js";
import Tower25 from "./tower.js"
import Mpn25ag5 from './mpn25ag5.js';
import MpnSb25g5 from './mpnsb25g5.js';

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
    tower;
    basePart;
    sectionPart
    topCapPart
    chrome;
    controls;
    isTowerLoaded = false;


    constructor() {
        this.components = new components();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.chrome = new Materials().ShinnyChrome;

    }
    baseIsLoaded = (part) => {

    }
    topIsLoaded = (part) => {

    }
    sectionIsLoaded = (part) => {

    }
    setHeight = (height) => {
        this.height = height;
    }
    setWidth = (width) => {
        this.width = width;
    }
    setRenderElementId = (elementId) => {
        this.appendToElement = elementId;
    }
    start = () => {
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
        options.gridDivisions = 80
        options.gridLength = 1000;
        options.gridWidth = 1000;
        options.gridColor = "#003300"
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
    insertTower = (tower) => {
        if (this.tower === undefined) {
            this.tower = tower;
        }

        this.tower.setParent(this)
        this.isTowerLoaded = true;
    }
    onRendererReady = () => {
        document
            .getElementById(this.appendToElement)
            .appendChild(this.renderer.domElement);
        this.addEventListeners();
        this.createControls();



        this.clock = new THREE.Clock();


    }
    createControls = () => {

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.panSpeed = 0.5;
        this.controls.rotateSpeed = 0.5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.6;
        this.controls.minPolarAngle = -1.4795;
        this.controls.maxPolarAngle = 1.4795;

    }
    attach = (documentRef) => {

        this.documentRef = documentRef;
        this.createRenderer();


        const opt1 = new PartOptions();
        opt1.material = this.chrome;
        // opt1.readyCallback = this.baseIsLoaded.bind(this)
        this.basePart = new MpnSb25g5(opt1)
        const opt2 = new PartOptions();
        // opt2.readyCallback = this.topIsLoaded.bind(this)
        opt2.material = this.chrome;
        this.topCapPart = new Mpn25ag5(opt2)
        const opt3 = new PartOptions();
        // opt3.readyCallback = this.sectionIsLoaded.bind(this)
        opt3.material = this.chrome;
        this.sectionPart = new Mpn25g(opt3)
            //this.documentRef.body.style.backgroundColor = "red";
        this.animate();
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

    updateInfo = (textArray = [], id) => {
        const textDisplay = this.components.partPosition(textArray, id);
        if (!document.getElementById(id)) {
            const sidebar = document.getElementById("toolBars");
            sidebar.appendChild(textDisplay)
        } else {
            this.components.replaceElement(id, textDisplay);
        }
    }
    updateMousePosition = () => {
        const newMouseDisplay = this.components.mousePosition(
            this.mouse.x,
            this.controls.getPolarAngle(),
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
        if (this.isTowerLoaded) {
            const binder = this
            this.tower.children.forEach(function(child) {
                let posx = child.position.x;
                let posy = child.position.y;
                let posz = child.position.z;
                let name = child.name;
                let id = name.replace(" ", "");
                binder.updateInfo(["Name: " + name, "x: " + posx + " y: " + posy + "z: " + posz], name);
            })

        }

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

    changeTowerHeight = (height) => {
        //   let ob = this.scene.getObjectsByName(this.tower.name)
        //   this.scene.remove(ob)
        console.log(this.topCapPart)
        const top = this.topCapPart //.clone();

        const base = this.basePart //.clone();
        this.tower.changeBase(base);
        this.tower.changeTopCap(top);
        this.tower.changeHeight(parseInt(height));
        this.tower.towerBuild();
        const bonder = this
        this.tower.children.forEach(function(child) {
            if (child.type === "Group") {
                const bind = bonder;
                child.traverse(function(child) {
                    if (child.name.toLowerCase() === "section") {
                        if (typeof child.createBoundingBox === "function") {
                            const bb3 = child.createBoundingBox();
                            bind.scene.add(bb3);
                        }

                    }
                })
            } else {
                if (typeof child.createBoundingBox === "function") {
                    const bb = child.createBoundingBox();
                    bonder.scene.add(bb);
                }
            }

        })

        this.scene.add(this.tower)

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