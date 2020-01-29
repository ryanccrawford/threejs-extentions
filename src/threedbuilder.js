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
import Tower25G from "./tower.js"
import Mpn25ag5 from './mpn25ag5.js';
import MpnSb25g5 from './mpnsb25g5.js';
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
    animationFrameId;
    selectedBase = "SB25G5"
    selectedTopCap = "25AG3"
    towerHeight = 10;
    currentTowerUUID;
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
   
    onRendererReady = () => {
        document
            .getElementById(this.appendToElement)
            .appendChild(this.renderer.domElement);
        let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        let geometry = new THREE.Geometry();
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
        this.tower = new Tower25G();
        const opt4 = new PartOptions();
        opt4.material = new Materials().Concrete;
        opt4.secondMaterial = {
            material: new Materials().SandGravel,
            what: "Drainage Bed"
        };
        const pad = new Pad(opt4);

        this.scene.add(pad);
        
        this.animate();
    };

    addEventListeners = () => {
        // this.renderer.domElement.addEventListener(
        //     "mousemove",
        //     this.onDocumentMouseMove
        // );

        // this.renderer.domElement.addEventListener(
        //     "mousedown",
        //     this.onDocumentMouseDown
        // );

        window.addEventListener("resize", this.onResize);
    };

    animate = () => {
        this.animationFrameId = requestAnimationFrame( this.animate );    
        this.renderer.render(this.scene, this.camera);
        this.update();
    }

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
    }

    update = () => {
        // this.updateMousePosition();

        // if (this.scene.children[4]) {
        //     if (this.scene.children[4].children[0]) {
        //         document.getElementById("currentData").textContent =
        //             "Current y:" + this.scene.children[4].children[0].position.y;
        //         document.getElementById("currentData2").textContent =
        //             "Current x:" + this.scene.children[4].children[0].position.x;
        //         document.getElementById("currentData3").textContent =
        //             "Current z:" + this.scene.children[4].children[0].position.z;
        //     }
        //}
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

        // const x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1.53;
        // const y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1.003;
        // this.mouse.set(x, y);
        // this.raycaster.setFromCamera(this.mouse, this.camera);
        // if (!this.isPaused) {
        //     let intersects = this.raycaster.intersectObjects(
        //         this.scene.children
        //     );
        //     if (intersects.length > 0) {
        //         const intercept = intersects[0];
        //         const pointA = this.camera.position;

        //         let direction = new THREE.Vector3();
        //         this.camera.getWorldDirection(direction);
        //         direction.normalize();

        //         let pointB = intercept.point;

        //         let distance = pointA.distanceTo(intercept.point);
        //         pointB.addVectors(
        //             pointA,
        //             direction.multiplyScalar(distance)
        //         );

        //         this.line.geometry.vertices.push(pointA);
        //         this.line.geometry.vertices.push(pointB);
        //     }
        // }
    };


    onDocumentMouseDown = event => {
        // const intersects = this.raycaster.intersectObjects(this.scene.children);

        // if (intersects.length > 0) {
        //     const intersect = intersects[0];
        //     if (intersect.object != this.lastIntersecpted) {
        //         if (this.lastIntersecpted) {
        //             console.log(this.lastIntersecpted);
        //             this.lastIntersecpted.material.color.setHex(
        //                 this.lastIntersecpted.currentHex
        //             );
        //             this.lastIntersecpted = intersect.object;
        //             this.lastIntersecpted.currentHex = this.lastIntersecpted.material.color.getHex();
        //             this.lastIntersecpted.material.color.setHex("#023300");
        //         }
        //     }
        // } else {
        //     if (this.lastIntersecpted) {
        //         this.lastIntersecpted.material.color.setHex(
        //             this.lastIntersecpted.currentHex
        //         );
        //         this.lastIntersecpted = null;
        //     }
        // }
    };
   
    onHeightSelect = event => {
        event.preventDefault();
      
        const itemSelected = parseInt(event.target.selectedOptions[0].text);
        cancelAnimationFrame(this.animationFrameId)
        this.towerHeight = parseInt(itemSelected)    
          
        this.updateTower();
       

        if (!document.getElementById('base')) {
            const baseOptions = this.getBaseOptions()
            const baseSelect = this.bindOptions(baseOptions, this.makeBaseSelect());
            const TopCapOptions = this.getTopCapOptions()
            const TopCapSelect = this.bindOptions(TopCapOptions, this.makeTopCapSelect());
            const newBasePartsBox = this.makePartSelectionBox("Base Options")
            newBasePartsBox.querySelector('.card-body').appendChild(baseSelect);
            const newTopCapPartsBox = this.makePartSelectionBox("Top Cap Options")
            newTopCapPartsBox.querySelector('.card-body').appendChild(TopCapSelect)

            document.getElementById('toolBars').appendChild(newBasePartsBox)
            document.getElementById('toolBars').appendChild(newTopCapPartsBox)
        }
      
    
    }
    updateTower = () => {
        if(this.currentTowerUUID){
            this.scene.remove(this.currentTowerUUID)
        }
        this.tower.reset();
       
        this.tower.setTowerBase(this.selectedBase);
        this.tower.setTowerTopCap(this.selectedTopCap);
         this.tower.setTowerHeight(this.towerHeight);
        this.tower.createTower();
        console.log("Right before the tower is added to scene")
        console.log(this.tower)
        this.currentTowerUUID = this.tower.get3DTowerObject();
        this.scene.add(this.currentTowerUUID);
        console.log(this.Scene)
        this.animate();

    }

    makeSelectBox = (id, name, label, onSelectionEvent) => {
        const Components = new components();
        return Components.selectBox(id, name, label, onSelectionEvent)
    }

    makeBaseSelect = () => {

        const baseSelect = this.makeSelectBox('base', 'base', 'Select Base (Optional)', this.onBaseSelect)
        return baseSelect;
    }
    
    makeTopCapSelect = () => {
    
        const topCapSelect = this.makeSelectBox('topcap', 'topcap', 'Select Top Cap (Optional)', this.onTopCapSelect)
        return topCapSelect;
    }

    getBaseOptions = () => {

        let dataBases = [
        {
            name:"Concrete Base Plate 25GSSB",
            value: "25GSSB"
        }, {
            name:"5' Short Base SB25G5", 
            value: "SB25G5"
        },{
            name:"Hinged Short Base SBH25G",
            value:"SBH25G"
        }
        ];
        let returnH = []
        let count = -1;
        for (let i = 0; i < dataBases.length; i++) {
         returnH.push({ name: dataBases[i].name, value: dataBases[i].value, id: ++count, isSelected: count === 0 ? true : false });
        }
        return returnH
    }
    
    getTopCapOptions = () => {

        let dataBases = ["25AG3", "25AG4", "25AG5"];
        let returnH = []
        let count = -1;
        for (let i = 0; i < dataBases.length; i++) {
         returnH.push({ name: dataBases[i], value: dataBases[i] ,isSelected: count === 0 ? true : false });
         ++count;
        }
        return returnH
    }

    makePartSelectionBox = (name) => {
        const partSelectionBox = this.components.card("", name, null)
        return partSelectionBox;
    }
    
    
    bindOptions = (options, htmlSelectBox) => {
    
        for (let i = 0; i < options.length; i++) {
            const opt = document.createElement("option");
            const textNode = document.createTextNode(options[i].name)
            opt.appendChild(textNode);
            opt.value = options[i].value || options[i].id.toString()
            opt.selected = options[i].isSelected;
            htmlSelectBox.appendChild(opt);
        }
        return htmlSelectBox
    }
    
    onBaseSelect = (event) => {
        event.preventDefault();
    
        const itemSelected = event.target.selectedOptions[0].value;
        if (typeof this.tower !== 'undefined') {
            cancelAnimationFrame(this.animationFrameId)
            this.selectedBase = itemSelected
            this.updateTower()
        }
    
    }
    
    onTopCapSelect = (event) => {
        event.preventDefault();
    
        const itemSelected = event.target.selectedOptions[0].value;
        if (typeof this.tower !== 'undefined') {
            cancelAnimationFrame(this.animationFrameId)
            this.selectedTopCap = itemSelected
            this.updateTower()
        }
    
    }
    

}
export default Thebuilder;