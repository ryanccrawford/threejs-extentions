import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TowerSection from 'towersection.js'

class thebuilder {
    scene;
    camera;
    controls;
    renderer;
    objects = [];
    raycaster;
    rollOverMesh;
    gridHelper;
    partGeo;
    partMaterial;
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

        this.fbxLoader("assets/3dmodels/25g.fbx", this.onRolloverLoad);

        // Prepare Orbit controls
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.target = new THREE.Vector3(0, 0, 0);
        // this.controls.maxDistance = 5000;

        // Prepare clock
        this.clock = new THREE.Clock();

        this.animate();
    };
    addEventListeners = () => {

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
    }

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

   
    onDocumentMouseMove = event => {
        event.preventDefault();
        if (!this.partLoaded || !this.rollOverLoaded) {
            return;
        }
        this.mouse.set(
            (event.clientX / this.width) * 1 - 1, -(event.clientY / this.height) * 1 + 1
        );

        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            var intersect = intersects[0];

            this.rollOverMesh.position
                .copy(intersect.point)
                .add(intersect.face.normal);
            this.rollOverMesh.position
                .divideScalar(this.rollOverMesh.height)
                .floor()
                .multiplyScalar(this.rollOverMesh.width)
                .addScalar(this.rollOverMesh.height / 2);
        }
    };

    fbxLoader = (path, callback) => {
        const loader = new FBXLoader();

        let binder = this;
        loader.load(path, function(object) {
            
            object.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.MeshLambertMaterial = binder.partMaterial;
                }
            });

            callback(object);

        });


    };

    onPartLoad = (part) => {
        this.partLoaded = true;
    }
    onRolloverLoad = (rollover) => {
        this.rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true
        });
        this.rollOverMesh = rollover;
        let binder = this;

        this.rollOverMesh.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.MeshBasicMaterial = binder.rollOverMaterial;
            }
        });

        this.scene.add(this.rollOverMesh);
        this.rollOverLoaded = true;

    }

    onVoxelLoad = (voxel) => {

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
                voxel.position
                    .divideScalar(voxel.width)
                    .floor()
                    .multiplyScalar(voxel.height)
                    .addScalar(voxel.height / 2);
                this.scene.add(voxel);

                this.objects.push(voxel);
            }
        }
    }

    onDocumentMouseDown = event => {
        event.preventDefault();
        if (!this.partLoaded || !this.rollOverLoaded) {
            return;
        }
        this.mouse.set(
            (event.clientX / this.width) * 2 - 1, -(event.clientY / this.height) * 2 + 1
        );

        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            this.fbxLoader("assets/3dmodels/25g.fbx", this.onVoxelLoad);
        }
    };
}

export default thebuilder;