import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { PartOptions } from "./partbase.js";
import Mpn25g from "./mpn25g.js";
import { RolloverPart } from "./rolloverpart.js";
import components from "./components.js";
import Materials from "./materials.js";

class thebuilder {
    scene;
    camera;
    controls;
    dragControls;
    renderer;
    objects = [];
    raycaster;
    rollOverMesh;
    rollOverObject;
    rollOverMaterial;
    gridHelper;
    partGeo;
    partMaterial;
    chromeMaterial;
    appendToElement;
    mouse;
    height;
    width;
    isShiftDown = false;
    partLoaded = false;
    rollOverLoaded = false;
    components;
    mouseDisplay;
    canvas;
    prevMousePosition;
    newParts = [];

    constructor(height = 500, width = 800, appendToElement = "") {
        this.components = new components();
        this.height = 600;
        this.width = width;
        this.appendToElement = appendToElement;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.rollOverMaterial = new Materials().RollOver;
        this.createCamera();
    }
    createCamera = () => {
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width / this.height,
            1,
            10000
        );
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(0, 0, 0);
        this.eventCameraReady();
    }
    eventCameraReady = () => {
        this.createScene()
    }
    createScene = () => {
         this.scene = new THREE.Scene();
         this.scene.background = new THREE.Color(0xf0f0f0);
        this.eventSceneReady();
    }
    eventSceneReady = () => {
        this.createFloor();
    }
    createFloor = () => {
        
        const gridHelper = new THREE.GridHelper(1000, 20);
        this.scene.add(this.gridHelper);

        const geometry = new THREE.PlaneBufferGeometry(1000, 1000);
        geometry.rotateX(-Math.PI / 2);

        const plane = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                visible: false
            })
        );
        this.scene.add(plane);
        this.objects.push(plane);

        this.eventFloorReady();
    }
    eventFloorReady = () => { 
        this.createLights();
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
        this.createRenderer();
    }
    createRenderer = () => {
         this.renderer = new THREE.WebGLRenderer({
             antialias: true
         });
         this.renderer.setPixelRatio(window.devicePixelRatio);
         this.renderer.setSize(this.width, this.height);

     }
    attach = () => {
        document
            .getElementById(this.appendToElement)
            .appendChild(this.renderer.domElement);
        
        this.addEventListeners();
        this.createRollOver();
       
        this.clock = new THREE.Clock();

        this.animate();
    }

    addEventListeners = () => {

        this.renderer.domElement.addEventListener(
            "mousemove",
            this.onDocumentMouseMove
        )

        window.addEventListener("resize", this.onResize);

        this.renderer.domElement.addEventListener(
            "mousedown",
            this.onDocumentMouseDown
        );
    }

    createRollOver = () => {
        let rollOverOptions = new PartOptions();

        rollOverOptions.material = this.rollOverMaterial;
       
        rollOverOptions.name = "Rollover Part";
        rollOverOptions.importFile = "assets/3dmodels/25G.fbx";
        rollOverOptions.readyCallback = this.onRolloverLoad.bind(this);

        this.rollOverObject = new RolloverPart(rollOverOptions);
        this.rollOverObject.getPart();
    }
    
    animate = () => {
        requestAnimationFrame(this.animate);
        this.update();
        this.render();
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
        this.camera.updateProjectionMatrix();
     }

    onResize = event => {
        event.preventDefault();
        const canvas = document.getElementsByTagName("canvas")[0];
        const div = document.getElementById("renderarea");
        this.width = div.clientWidth;
        this.camera.aspect = this.width / 600;
        canvas.width = this.width;
        this.renderer.setSize(this.width, 600);
        this.camera.updateProjectionMatrix();
    }

    onDocumentMouseMove = event => {
        event.preventDefault();
        const y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1.50;

        this.mouse.set(x, y);
        if (!this.rollOverLoaded) {
            return;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            this.rollOverObject
                .position()
                .copy(intersect.point)
                .add(intersect.face.normal);

            this.rollOverObject
                .position()
                .divideScalar(50)
                .floor()
                .multiplyScalar(50)
                .addScalar(50);
        }
    };

    onRolloverLoad = () => {
        
        this.scene.add(this.rollOverObject.partMesh);
        this.rollOverLoaded = true;   
    }
    onVoxelLoad = () => {

        const voxel = this.newParts.pop();
        const intersects = this.raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            if (this.isShiftDown) {
                if (intersect.object !== plane) {
                    this.scene.remove(intersect.object);

                    this.objects.splice(this.objects.indexOf(intersect.object), 1);
                }
            } else {
                voxel
                    .position()
                    .copy(intersect.point)
                    .add(intersect.face.normal);

                voxel
                    .position()
                    .divideScalar(50)
                    .floor()
                    .multiplyScalar(50)
                    .addScalar(50);
                this.scene.add(voxel.partMesh);
                this.objects.push(voxel.partMesh);
            }
        }
    };

    onDocumentMouseDown = event => {
        event.preventDefault();

        const x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1.50;
        const y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1.50;

        this.mouse.set(x, y);
        if (!this.rollOverLoaded) {
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            let newOptions = new PartOptions();
            newOptions.readyCallback = this.onVoxelLoad.bind(this);
            let newPart = new Mpn25g(newOptions);
            this.newParts.push(newPart);
            newPart.getPart();
        }
    };
}

export default thebuilder;