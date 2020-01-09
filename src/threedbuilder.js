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

    constructor(height = 500, width = 800, appendToElement = "") {
        this.components = new components();
        this.height = 600;
        this.width = width;
        this.appendToElement = appendToElement;
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width / 600,
            1,
            10000
        );
        this.camera.position.set(500, 1000, 1000);
        //this.camera.position.x = 500;
        this.camera.lookAt(0, 0, 0);
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color(0xf0f0f0);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.prevMousePosition = new THREE.Vector2();

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

        this.isMouseOver = false;

        this.renderer.domElement.addEventListener(
            "mouseover",
            this.onDocumentMouseEnter
        );

        this.renderer.domElement.addEventListener(
            "mouseout",
            this.onDocumentMouseOut
        );

        this.renderer.domElement.addEventListener(
            "mousemove",
            this.onDocumentMouseMove,
            false
        );

        window.addEventListener("resize", this.onResize);

        this.renderer.domElement.addEventListener(
            "mousedown",
            this.onDocumentMouseDown,
            false
        );

        window.addEventListener("keypress", this.onKey);

        this.renderer.domElement.addEventListener(
            "keypress",
            this.onDocumentMouseDown,
            false
        );


        let rollOverOptions = new PartOptions();

        this.rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true
        });
        rollOverOptions.material = this.rollOverMaterial;
        rollOverOptions.materialType = "MeshBasicMaterial";
        rollOverOptions.name = " Rollover Part";
        rollOverOptions.importFile = "assets/3dmodels/25g.fbx";

        rollOverOptions.readyCallback = this.onRolloverLoad.bind(this);
        this.rollOverObject = new RolloverPart(rollOverOptions);
        this.rollOverObject.getPart();
        // Prepare Orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 0, 0);
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




        // Prepare clock
        this.clock = new THREE.Clock();

        this.animate();
    };
    animate = () => {
        requestAnimationFrame(this.animate);
        this.update();
        this.render();
    };

    mouseHasMoved = () => {};
    updateMousePosition = () => {
        const newMouseDisplay = this.components.mousePosition(this.mouse.x, this.mouse.y, 0, "mouse");
        this.components.replaceElement("mouse", newMouseDisplay);
    };

    render = () => {
        this.renderer.render(this.scene, this.camera);
    };

    update = () => {
        const delta = this.clock.getDelta();
        if (this.controls.enabled) {
            this.controls.update(delta);

        }
        this.camera.updateProjectionMatrix();
        //this.dragControls.update();
    };

    onKey = (event) => {
        event.preventDefault();
        console.log("keyPressed")
        console.log(event.key)
        switch (event.key) {
            case "R":
            case "r":
                //this.dragControls.enabled = false;
                this.controls.enableRotate = true;
                //this.controls.enabled = true;
                break;
            case "S":
            case "s":
                this.dragControls.enabled = !this.dragControls.enabled;
                //this.controls.enableRotate = !this.dragControls.enabled;
                this.controls.enabled = !this.dragControls.enabled;
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

    onDocumentMouseEnter = event => {
        this.isMouseOver = true;
    };
    onDocumentMouseOut = event => {
        this.isMouseOver = false;
    };
    onDocumentMouseMove = event => {
        event.preventDefault();


        this.mouse.set(
            (event.clientX / this.width) * 2 - 1, -(event.clientY / 600) * 2 + 1
        );
        if (!this.rollOverLoaded) {
            return;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            this.rollOverMesh
                .position
                .copy(intersect.point)
                .add(intersect.face.normal);

            this.rollOverMesh
                .position
                .divideScalar()
                .floor()
                .multiplyScalar()
                .addScalar();
        }
        this.updateMousePosition();

    };

    onRolloverLoad = rollover => {

        this.rollOverMesh = rollover;
        let gridSize = 1000
        const gridDividers = 14;
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

        this.scene.add(this.rollOverMesh);
        this.rollOverLoaded = true;
    };

    onVoxelLoad = voxel => {
        console.log("inside Voxel");
        console.log(voxel);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            if (this.isShiftDown) {
                if (intersect.object !== plane) {
                    this.scene.remove(intersect.object);

                    this.objects.splice(this.objects.indexOf(intersect.object), 1);
                }
            } else {

                voxel.position
                    .copy(intersect.point)
                    .add(intersect.face.normal);


                voxel.position
                    .divideScalar()
                    .floor()
                    .multiplyScalar()
                    .addScalar();
                this.scene.add(voxel);
                this.objects.push(voxel);
            }
        }
    };

    onDocumentMouseDown = event => {
        event.preventDefault();


        this.mouse.set(
            (event.clientX / this.width) * 2 - 1, -(event.clientY / 600) * 2 + 1
        );
        if (!this.rollOverLoaded) {
            return;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            let newOptions = new PartOptions();
            newOptions.name = "25G 10' Section";
            newOptions.readyCallback = this.onVoxelLoad.bind(this);
            let newPart = new TowerSection(newOptions);
            newPart.getPart();
        }

        this.updateMousePosition();
    };
}

export default thebuilder;