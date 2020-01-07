import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PartOptions } from "./partbase.js";
import { TowerSection } from "./towersection.js";
import { RolloverPart } from "./rolloverpart.js";
import components from "./container.js";

class thebuilder {
    scene;
    camera;
    controls;
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
        this.height = height;
        this.width = width;
        this.appendToElement = appendToElement;
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width / this.height,
            1,
            10000
        );
        this.camera.position.set(500, 800, 800);
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
        this.renderer.setSize(this.width, this.height);
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
        window.addEventListener(
            "resize",
            this.onResize
        )
        this.renderer.domElement.addEventListener(
            "mousedown",
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
        console.log(rollOverOptions);
        rollOverOptions.readyCallback = this.onRolloverLoad.bind(this);
        this.rollOverObject = new RolloverPart(rollOverOptions);
        this.rollOverObject.getPart();
        // Prepare Orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.maxDistance = 5000;

        const eMap = new THREE.CubeTextureLoader()
            .setPath("assets/3dmodels/images/cmap/")
            .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
        eMap.mapping = THREE.CubeRefractionMapping;
        this.chromeMaterial = new THREE.MeshPhongMaterial({
            color: 0xc5c5c5,
            envMap: eMap,
            refractionRatio: 0.8,
            reflectivity: 0.3
        });

        // Prepare clock
        this.clock = new THREE.Clock();

        this.animate();
    };
    animate = () => {
        requestAnimationFrame(this.animate);
        this.update();
        this.render();
    };

    mouseHasMoved = () => {

    }
    updateMousePosition = (x, y) => {

        const newMouseDisplay = this.components.mousePosition(x, y, 0, "mouse");
        this.components.replaceElement("mouse", newMouseDisplay);
    };

    render = () => {
        this.renderer.render(this.scene, this.camera);
    };

    update = () => {
        const delta = this.clock.getDelta();
        this.controls.update(delta);
    };

    onResize = (event) => {
        event.preventDefault();
        const canvas = document.getElementsByTagName(
            "canvas"
        )[0];
        const div = document.getElementById("renderarea");
        canvas.height =
            window.screen.availHeight - (0.3 * window.screen.availHeight);
        canvas.width = div.clientWidth - 20;
        this.camera.aspect = canvas.width / canvas.height;
        this.width = canvas.width;
        this.height = canvas.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.width, canvas.height);
    };

    onDocumentMouseEnter = event => {
        this.isMouseOver = true;
    };
    onDocumentMouseOut = event => {
        this.isMouseOver = false;
    };
    onDocumentMouseMove = event => {
        event.preventDefault();
        this.prevMousePosition = this.mouse;
        this.mouse.set(
            (event.clientX / this.width) * 2 - 1, -(event.clientY / this.height) * 2 + 1
        );
        this.updateMousePosition(this.mouse.x, this.mouse.y);
        if (!this.rollOverLoaded) {
            return;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            this.rollOverMesh
                .position()
                .copy(intersect.point)
                .add(intersect.face.normal);
            this.rollOverMesh
                .position()
                .divideScalar(50)
                .floor()
                .multiplyScalar(50)
                .addScalar(25);

        }
    };

    onRolloverLoad = rollover => {
        this.rollOverMesh = rollover;

        const gridDividers = 1000 / this.rollOverMesh.getSize().z;
        console.log(gridDividers);
        this.gridHelper = new THREE.GridHelper(
            1000,
            gridDividers,
            new THREE.Color(0xffffff),
            new THREE.Color(0xc0c0c0)
        );
        this.scene.add(this.gridHelper);
        let geometry = new THREE.PlaneBufferGeometry(1000, 1000);
        geometry.rotateX(-Math.PI / 2);

        this.plane = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                visible: false
            })
        );
        this.scene.add(this.plane);

        this.objects.push(this.plane);

        this.scene.add(this.rollOverMesh.partMesh);
        this.rollOverLoaded = true;
    };

    onVoxelLoad = voxel => {
        console.log("inside onVoxelLoad");
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
                voxel
                    .position()
                    .copy(intersect.point)
                    .add(intersect.face.normal);

                const size = voxel.getSize();
                voxel
                    .position()
                    .divideScalar(50)
                    .floor()
                    .multiplyScalar(50)
                    .addScalar(25);
                this.scene.add(voxel.partMesh);
                this.objects.push(voxel.partMesh);
            }
        }
    };

    onDocumentMouseDown = event => {
        event.preventDefault();
        this.prevMousePosition = this.mouse
        this.updateMousePosition(this.mouse.x, this.mouse.y);
        this.mouse.set(
            (event.clientX / this.width) * 2 - 1, -(event.clientY / this.height) * 2 + 1
        );
        if (!this.rollOverLoaded) {
            return;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            let newOptions = new PartOptions();
            newOptions.material = this.chromeMaterial;
            newOptions.name = "25G 10' Section";
            newOptions.readyCallback = this.onVoxelLoad.bind(this);
            let newPart = new TowerSection(newOptions);
            newPart.getPart();
        }
    };
}

export default thebuilder;