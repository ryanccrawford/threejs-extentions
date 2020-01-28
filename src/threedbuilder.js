import * as THREE from 'three';
import TowerCamera from './camera.js'
import TowerLights from './lights.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { PartOptions, OrbitConfig } from "./partbase.js";
import Mpn25g from "./mpn25g.js";
import { RolloverPart } from "./rolloverpart.js";
import components from "./components.js";
import Materials from "./materials.js";
import { Floor, FloorOptions } from "./floor.js";
import Tower25 from "./tower.js"
import Mpn25ag5 from './mpn25ag5.js';
import MpnSb25g5 from './mpnsb25g5.js';
import Tower25G from './tower.js';
import Pad from './pad.js';

class Thebuilder {
    scene;
    isPaused = false;
    floorRef;
    camera;
    lights;
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
    sectionPart;
    topCapPart;
    chrome;
    controls;
    draggingControls;
    isTowerLoaded = false;
    currentTowerID;
    timesRemoved = 0;
    lastIntersecpted;
    lastIntersecptedMaterial;
    line;
    towerReady = false;
    constructor() {
        this.components = new components();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.chrome = new Materials().ShinnyChrome;
    }
    baseIsLoaded = part => {};
    topIsLoaded = part => {};
    sectionIsLoaded = part => {};
    setHeight = height => {
        this.height = height;
    };
    setWidth = width => {
        this.width = width;
    };
    setRenderElementId = elementId => {
        this.appendToElement = elementId;
    };
    start = () => {
        this.createCamera();
    };

    createCamera = () => {
        this.camera = new TowerCamera(this.width, this.height);
        this.eventCameraReady();
    };
    eventCameraReady = () => {
        this.createScene();
    };
    createScene = () => {
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color(0xf0f0f0);
        this.eventSceneReady();
    };
    eventSceneReady = () => {
        this.createLights();
    };
    createFloor = () => {
        const options = new FloorOptions();
        options.name = "Floor";
        options.gridDivisions = 80;
        options.gridLength = 1000;
        options.gridWidth = 1000;
        options.gridColor = "#003300";
        options.readyCallback = this.onFloorReady.bind(this);
        options.hasGrid = true;
        options.sceneRef = this.scene;
        this.floorRef = new Floor(options);
    };
    onFloorReady = floor => {
        this.floor = floor;
        this.scene.add(this.floor);
        this.objects.push(this.floor);
    };
    createLights = () => {
        this.lights = new TowerLights();
        this.scene.add(this.lights);
        this.eventLightsReady();
    };
    eventLightsReady = () => {
        this.createFloor();
    };
    createRenderer = () => {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.onRendererReady();
    };
    insertTower = tower => {
        this.tower = tower;

        this.isTowerLoaded = true;
    };
    onRendererReady = () => {
        document
            .getElementById(this.appendToElement)
            .appendChild(this.renderer.domElement);
        var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        var geometry = new THREE.Geometry();
        this.line = new THREE.Line(geometry, material);
        this.line.material = material;
        this.scene.add(this.line);
        this.addEventListeners();
        this.createControls();
        //this.createDragingControls();
        this.clock = new THREE.Clock();
    };
    createControls = () => {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.panSpeed = 0.5;
        this.controls.rotateSpeed = 0.5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.6;
        this.controls.minPolarAngle = -1.4795;
        this.controls.maxPolarAngle = 1.4795;
    };
    createDragingControls = () => {
        this.draggingControls = new DragControls(
            this.scene.children,
            this.camera,
            this.renderer.domElement
        );
    };
    attach = documentRef => {
        this.documentRef = documentRef;
        this.createRenderer();

        const opt1 = new PartOptions();
        opt1.material = this.chrome;
        // opt1.readyCallback = this.baseIsLoaded.bind(this)
        this.basePart = new MpnSb25g5(opt1);
        const opt2 = new PartOptions();
        // opt2.readyCallback = this.topIsLoaded.bind(this)
        opt2.material = this.chrome;
        this.topCapPart = new Mpn25ag5(opt2);
        const opt3 = new PartOptions();
        // opt3.readyCallback = this.sectionIsLoaded.bind(this)
        opt3.material = this.chrome;
        this.sectionPart = new Mpn25g(opt3);
        //this.documentRef.body.style.backgroundColor = "red";
        const opt4 = new PartOptions();
        opt4.material = new Materials().Concrete;
        opt4.secondMaterial = {
            material: new Materials().SandGravel,
            what: "Drainage Bed"
        };
        const pad = new Pad(opt4);

        this.scene.add(pad);
        this.render();
    };

    addEventListeners = () => {
        this.renderer.domElement.addEventListener(
            "mousemove",
            this.onDocumentMouseMove
        );

        this.renderer.domElement.addEventListener(
            "mousedown",
            this.onDocumentMouseDown
        );

        window.addEventListener("resize", this.onResize);
    };

    animate = () => {
            
                this.render();
            
        
            this.update();
           
        requestAnimationFrame(this.animate);
    };

    updateMousePosition = () => {
        if (!this.isPaused) {
            if (this.controls) {
                const newMouseDisplay = this.components.mousePosition(
                    this.mouse.x,
                    this.controls.getPolarAngle(),
                    0,
                    "mouse"
                );
                this.components.replaceElement("mouse", newMouseDisplay);
            }
        }
    };

    render = () => {
        if(this.towerReady){
            this.renderer.render(this.scene, this.camera);
        }
    };

    update = () => {
        //this.updateMousePosition();

        // if (this.scene.children[4]) {
        //     if (this.scene.children[4].children[0]) {
        //         document.getElementById("currentData").textContent =
        //             "Current y:" + this.scene.children[4].children[0].position.y;
        //         document.getElementById("currentData2").textContent =
        //             "Current x:" + this.scene.children[4].children[0].position.x;
        //         document.getElementById("currentData3").textContent =
        //             "Current z:" + this.scene.children[4].children[0].position.z;
        //     }
        // }
    };

    onResize = event => {
        event.preventDefault();
        const canvas = document.getElementsByTagName("canvas")[0];
        const div = document.getElementById("renderarea");
        this.width = div.clientWidth;
        this.camera.aspect = this.width / this.height;
        canvas.width = this.width;
        this.renderer.setSize(this.width, this.height);
        this.camera.updateProjectionMatrix();
    };

    onDocumentMouseMove = event => {
        event.preventDefault();

        const x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1.53;
        const y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1.003;
        this.mouse.set(x, y);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        if (!this.isPaused) {
            let intersects = this.raycaster.intersectObjects(
                this.scene.children
            );
            if (intersects.length > 0) {
                const intercept = intersects[0];
                const pointA = this.camera.position;

                let direction = new THREE.Vector3();
                this.camera.getWorldDirection(direction);
                direction.normalize();

                let pointB = intercept.point;

                let distance = pointA.distanceTo(intercept.point);
                pointB.addVectors(
                    pointA,
                    direction.multiplyScalar(distance)
                );

                this.line.geometry.vertices.push(pointA);
                this.line.geometry.vertices.push(pointB);
            }
        }
    };


    onDocumentMouseDown = event => {
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            if (intersect.object != this.lastIntersecpted) {
                if (this.lastIntersecpted) {
                    console.log(this.lastIntersecpted);
                    this.lastIntersecpted.material.color.setHex(
                        this.lastIntersecpted.currentHex
                    );
                    this.lastIntersecpted = intersect.object;
                    this.lastIntersecpted.currentHex = this.lastIntersecpted.material.color.getHex();
                    this.lastIntersecpted.material.color.setHex("#023300");
                }
            }
        } else {
            if (this.lastIntersecpted) {
                this.lastIntersecpted.material.color.setHex(
                    this.lastIntersecpted.currentHex
                );
                this.lastIntersecpted = null;
            }
        }
    };
    createTower = (baseType = "SB25G5", topCapType = "25AG3", numberOfSections = 1) => {
      

        for (var key in this.tower.towerParts.towerBases) {
            if(key.name === baseType){
                this.tower.towerParts.towerBase = key.part.clone();
            }
        }
        for (var key in  this.tower.towerParts.towerTopCaps) {
            if(key.name === topCapType){
                this.tower.towerParts.towerTopCap = key.part.clone();
            }
        }
        
        let baseHeight = this.tower.towerParts.towerBase.getHeight() - 12;

        if (this.tower.towerParts.towerSections.children.length > 0) {

            this.tower.add(this.tower.towerParts.towerSections)
        }
        if (this.tower.towerParts.towerTopCap.children.length > 0) {
            if (this.tower.towerParts.towerSections.children.length === 0) {
                this.tower.towerParts.towerTopCap.position.setY(this.tower.sectionsHeight)
            } else {
                this.tower.sectionsHeight = this.tower.towerTopCapMountHeight;
                this.tower.towerParts.towerTopCap.position.setY(this.tower.sectionsHeight)
            }
            this.tower.towerParts.towerTopCap.position.setX(0.24)
            this.tower.towerParts.towerTopCap.position.setZ(0.367)
            this.tower.towerParts.towerTopCap.position.setY(this.tower.towerParts.towerTopCap.position.y - 2.122)
            this.tower.add(this.tower.towerParts.towerTopCap)
        }

        if (this.tower.towerParts.towerBase.children.length > 0) {
            this.tower.towerParts.towerBase.position.setY(-(baseHeight))
            this.tower.add(this.tower.towerParts.towerBase)
        }
       
            // this.translate(0,0,0);
            // this.position.copy(new THREE.Vector3(0, 0, 0.0));
            // const box = new THREE.Box3().setFromObject( this );
            //   box.getCenter( this.parentRef.getObjectByName("Pad") ); // this re-sets the obj position
        

    }
    setTowerHeight = (height) => {
        this.tower.reset();

        this.tower.useSectionAsBase = false;
        this.tower.towerHeight = parseInt(height);
        this.tower.sectionsHeight = 0.0
        
        let numberOfSections = parseInt((this.tower.towerHeight / 10) - 1);
        if ((this.tower.towerHeight.toString()[1] === 5)) {
            this.tower.useSectionAsBase = true;
         
            this.tower.towerParts.towerBase = new THREE.Object3D();

        }

        

        // const newGroup = new THREE.Group();
        // newGroup.position.setX(-2.62)
        // newGroup.position.setY(0.64)
        // newGroup.position.setZ(17.99)

        // newGroup.name = "Sections";
        let nextMountHeight = -6;
        if (this.tower.useSectionAsBase) {
            nextMountHeight = -5
        }

        //this.towerParts.towerSections.children.splice(0)
        let addHeight = this.tower.towerParts.towerSection.getHeight() - 2.25;
     
        
        for (let i = 0; i < numberOfSections; i++) {
            const newSection = this.tower.towerParts.towerSection.clone();
            newSection.position.setY(nextMountHeight);
            nextMountHeight += (addHeight);

            this.tower.towerParts.towerSections.add(newSection);
        }
        this.tower.towerTopCapMountHeight = nextMountHeight;

     

    }

}
export default Thebuilder;