import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PartOptions } from "./partbase.js";
import { TowerSection } from "./towersection.js";
import { RolloverPart } from "./rolloverpart.js";
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

    constructor(height = 500, width = 800, appendToElement = "") {
        this.height = height;
        this.width = width;
        this.appendToElement = appendToElement;
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width / this.height,
            1,
            10000
        );
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(0, 0, 0);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.gridHelper = new THREE.GridHelper(1000, 20);
        this.scene.add(this.gridHelper);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

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

        // lights

        let ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        let directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
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

        this.renderer.domElement.addEventListener(
            "mousedown",
            this.onDocumentMouseDown,
            false
        );
        let rollOverOptions = new PartOptions();
        //  name;
        //  material;
        //  importFile;
        //  readyCallback;
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
        this.chromeMaterial = new THREE.MeshLambertMaterial({
            color: 0xfeb74c,
            envMap: eMap,
            reflectivity: 0.7
        });

        console.log(this.rollOverObject);
        // Prepare clock
        this.clock = new THREE.Clock();

        this.animate();
    };
    animate = () => {
        requestAnimationFrame(this.animate);
        this.render();
        this.update();
    };

    render = () => {
        this.renderer.render(this.scene, this.camera);
    };
    update = () => {
        let delta = this.clock.getDelta();

        this.controls.update(delta);
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
            (event.clientX / this.width) * 1 - 1, -(event.clientY / this.height) * 1 + 1
        );
        if (!this.rollOverLoaded) {
            return;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            console.log(this.rollOverMesh);
            const box = new THREE.Box3().setFromObject(this.rollOverMesh);
            console.log(box.min, box.max, box.getSize(new THREE.Vector3()));
            const size = box.getSize(new THREE.Vector3());
            this.rollOverMesh.position
                .copy(intersect.point)
                .add(intersect.face.normal);
            this.rollOverMesh.position
                .divideScalar(size.y)
                .floor()
                .multiplyScalar(size.x)
                .addScalar(size.y / 2);
        }
    };

    onRolloverLoad = rollover => {
        console.log(rollover);
        this.rollOverMesh = rollover;
        this.scene.add(this.rollOverMesh);
        this.rollOverLoaded = true;

    };

    onVoxelLoad = voxel => {
        console.log(voxel)
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.objects);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            if (this.isShiftDown) {
                if (intersect.object !== plane) {
                    this.scene.remove(intersect.object);

                    this.objects.splice(this.objects.indexOf(intersect.object), 1);
                }

                // create cube
            } else {
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                const box = new THREE.Box3().setFromObject(voxel);
                const size = box.getSize(new THREE.Vector3());
                voxel.position
                    .divideScalar(size.y)
                    .floor()
                    .multiplyScalar(size.x)
                    .addScalar(size.y / 2);
                this.scene.add(voxel);

                this.objects.push(voxel);
            }
        }
    };

    onDocumentMouseDown = event => {
        event.preventDefault();

        this.mouse.set(
            (event.clientX / this.width) * 1 - 1, -(event.clientY / this.height) * 1 + 1
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
            newOptions.materialType = "MeshLambertMaterial";
            let newPart = new TowerSection(newOptions);
            newPart.getPart();
        }
    };
}

export default thebuilder;