import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { PartOptions } from "./partbase.js";
import { TowerSection } from "./towersection.js";
import { RolloverPart } from "./rolloverpart.js";
import components from "./components.js";


class thebuilder {
    scene;
    camera;
    controls;
    dragControls;
    renderer;
    lights = [];
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
        this.camera = new THREE.PerspectiveCamera(
           20,
            this.width / 600,
            1,
            10000
        );
        this.camera.position.z = 500;
        this.camera.position.x = 500;
        this.camera.position.y = 500
        this.rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true
        });
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color(0xf0f0f0);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // lights

        const ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, 600);

    }

    attach = () => {
        document
            .getElementById(this.appendToElement)
            .appendChild(this.renderer.domElement);
        
        this.renderer.domElement.addEventListener(
                'keyup keydown', 
                this.keyUpDown
        );

        this.renderer.domElement.addEventListener(
            "mousemove",
            this.onDocumentMouseMove
        );

        window.addEventListener("resize", this.onResize);

        this.renderer.domElement.addEventListener(
            "mousedown",
            this.onDocumentMouseDown
        );

        window.addEventListener("keypress", this.onKey);

        let rollOverOptions = new PartOptions();

        rollOverOptions.material = this.rollOverMaterial;
        rollOverOptions.materialType = "MeshBasicMaterial";
        rollOverOptions.name = " Rollover Part";
        rollOverOptions.importFile = "assets/3dmodels/25g.fbx";
        rollOverOptions.readyCallback = this.onRolloverLoad.bind(this);

        this.rollOverObject = new RolloverPart(rollOverOptions);
        this.rollOverObject.getPart();
        // Prepare Orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.maxDistance = 2000;
        this.controls.enableRotate = false;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableKeys = false;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.2;
        this.dragControls = new DragControls(
            this.objects,
            this.camera,
            this.renderer.domElement
        );
        this.dragControls.addEventListener("dragstart", this.onDragStart);

        this.dragControls.addEventListener("dragend", this.onDragEnd);
        this.dragControls.enabled = false;



        // Prepare clock
        this.clock = new THREE.Clock();
        this.controls.update(this.clock.getDelta());
        this.render();
        this.animate();
    };
    animate = () => {
        requestAnimationFrame(this.animate);
        this.update();
        this.render();
    };
  
    
    updateMousePosition = () => {
        const newMouseDisplay = this.components.mousePosition(this.mouse.x, this.mouse.y, 0, "mouse");
        this.components.replaceElement("mouse", newMouseDisplay);
    };

    render = () => {
        this.renderer.render(this.scene, this.camera);
    };

    update = () => {
        
        this.updateMousePosition();
        if (this.controls.enabled) {
            const delta = this.clock.getDelta();
            this.controls.update(delta);

        }
        this.camera.updateProjectionMatrix();
        //this.dragControls.update();
    };
    keyUpDown = (e) => { 
        this.isShiftDown = e.shiftKey
    }
    onKey = (event) => {
        
        console.log("keyPressed")
        console.log(event.key)
      
        switch (event.key) {
            case "R":
            case "r":
                this.controls.enableRotate = true;
                this.controls.enabled = true;
                break;
            case "S":
            case "s":
                this.dragControls.enabled = true;
                this.controls.enabled = false;
                break;
            case "A":
                //this.insertPart();
                break;
        }
    }

    onDragStart = (event) => {
      
        if (this.controls.enableRotate) {
            return;
        }
        if (event.object.material.emissive === undefined) {
            return;
        }
        event.object.material.emissive.set(0xaaaaaa);
    };
    onDragEnd = (event) => {
      
        if (event.object.material.emissive === undefined) {
            return;
        }
        event.object.material.emissive.set(0x000000);
    };
    onResize = event => {
        event.preventDefault();
        const canvas = document.getElementsByTagName("canvas")[0];
        const div = document.getElementById("renderarea");
        this.width = div.clientWidth - 20;
        this.camera.aspect = this.width / 600;
        canvas.width = this.width;
        this.renderer.setSize(this.width, 600);
        this.camera.updateProjectionMatrix();
    };

    onDocumentMouseMove = event => {
        event.preventDefault();
        const x = ( event.clientX / window.innerWidth ) * 2 - 1;
        const y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.mouse.set(
            x, y
        );
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

        let gridSize = 1000
        const gridDividers = 50;
        this.gridHelper = new THREE.GridHelper(
            gridSize,
            gridDividers,
            new THREE.Color(0xffffff),
            new THREE.Color(0xc0c0c0)
        );
        this.scene.add(this.gridHelper);
        let geometry = new THREE.PlaneBufferGeometry(gridSize, gridSize);
        geometry.rotateX(-Math.PI / 2);

        this.plane = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                visible: false
            })
        );
        this.scene.add(this.plane);

        this.objects.push(this.plane);
        this.scene.add(this.rollOverObject.partMesh);
        this.rollOverLoaded = true;
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
                .divideScalar(1)
                .floor()
                .multiplyScalar(50)
                .addScalar(50);
        }
       
     
    };
    onVoxelLoad = () => {
        const voxel = this.newParts.pop()
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            if (this.isShiftDown) {
                if (intersect.object !== plane) {
                    this.scene.remove(intersect.object);

                    this.objects.splice(this.objects.indexOf(intersect.object), 1);
                }
            } else {

                voxel.position()
                    .copy(intersect.point)
                    .add(intersect.face.normal);


                voxel.position()
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

        const x = ( event.clientX / window.innerWidth ) * 2 - 1;
        const y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.mouse.set(
            x, y
        );
        if (!this.rollOverLoaded) {
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            let newOptions = new PartOptions();
            newOptions.name = "25G 10' Section";
            newOptions.readyCallback = this.onVoxelLoad.bind(this);
            let newPart = new TowerSection(newOptions);
            this.newParts.push(newPart);
            newPart.getPart();
        }

       
    };
}

export default thebuilder;