import * as THREE from 'three';
import TowerCamera from './camera.js'
import TowerLights from './lights.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { PartOptions } from "./partbase.js";
import components from "./components.js";
import Materials from "./materials.js";
import { Floor, FloorOptions } from "./floor.js";
import Tower25G from "./tower.js"

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
    towerPad;
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
    selectedBase = "SB25G5";
    selectedTopCap = "25AG3";
    selectedPart;
    towerHeight = 10;
    currentTowerUUID;
    validHeights = [10, 20, 30, 35, 40];
    autoRotate = true;

    constructor() {
        this.selectedPart = new THREE.Object3D();
        this.components = new components();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.chrome = new Materials().ShinnyChrome;
        const i1 = document.getElementById("test");
        const i2 = document.getElementById("test2");
        const i3 = document.getElementById("test3");
        i1.addEventListener("input", this.onChangePosition);

        i2.addEventListener("input", this.onChangePosition);

        i3.addEventListener("input", this.onChangePosition);
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
        this.floor.visible = false;
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
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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
        this.towerPad = new Pad(opt4);
        this.towerPad.visible = false;
        this.scene.add(this.towerPad);
        this.makeFoundationOptions();
        document.getElementById("mouse").style.display = "none"
        this.animate();
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
    onChangePosition = event => {
        const inputId = event.target.id;
        console.log(event);
        const inputValue = parseFloat(event.target.value);
        console.log(inputValue);
        if (window.builderSelectedItem) {
            switch (inputId) {
                case "test":
                    window.builderSelectedItem.position.setX(inputValue);
                    break;
                case "test2":
                    window.builderSelectedItem.position.setY(inputValue);
                    break;
                case "test3":
                    window.builderSelectedItem.position.setZ(inputValue);
                    break;
            }
        }
    };
    animate = () => {
        this.animationFrameId = requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
        this.update();
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

    update = () => {
        this.updateMousePosition();
        this.controls.autoRotate = this.autoRotate;

        this.controls.update();
        if (this.scene.children[4]) {
            if (window.builderSelectedItem) {
                document.getElementById("test").textContent =
                    "Current y:" + window.builderSelectedItem.position.y;
                document.getElementById("test2").textContent =
                    "Current x:" + window.builderSelectedItem.position.x;
                document.getElementById("test3").textContent =
                    "Current z:" + window.builderSelectedItem.position.z;
            }
        }
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
        const x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        const y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
        this.mouse.set(x, y);
    };

    onDocumentMouseDown = event => {
        event.preventDefault();
        console.log(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObject(
            this.currentTowerUUID,
            true
        );
        console.log(intersects);
        if (intersects.length > 0) {
            const intersect = intersects[0];

            this.selectObject(intersect.object, 0xff0000);
            const info = document.createElement("p");
            info.id = "selected3D";
            info.innerText = intersect.object.name + " - " + intersect.object.type;
            if (!document.getElementById("selected3D")) {
                document.getElementById("toolBars").appendChild(info);
            } else {
                const replaceThis = document.getElementById("selected3D");
                replaceThis.parentNode.replaceChild(info, replaceThis);
            }
        }
    };
    selectObject = (part, emissiveColor) => {
        window.builderSelectedItem = part;
        this.scene.traverse(child => {
            if (child.isMesh) {
                if (child.material.emissive.getHex() === emissiveColor) {
                    child.material.emissive.setHex(0x000000);
                }
            }
        });
        part.traverse(child => {
            if (child.isMesh) {
                child.material.emissive.setHex(emissiveColor);
            }
        });
    };

    onHeightSelect = event => {
        console.log(event);

        let dispalyValueLabelId = event.id + "_display";
        const labelDisplay = document.getElementById(dispalyValueLabelId);
        const itemSelected = parseInt(event.value);
        cancelAnimationFrame(this.animationFrameId);
        this.towerHeight = parseInt(itemSelected);
        console.log("Tower Hight Selected");

        console.log(itemSelected);
        if (!this.validHeights.includes(itemSelected)) {
            return false;
        }
        labelDisplay.innerText = "Current: " + itemSelected + "' Feet";
        this.updateTower();

        if (!document.getElementById("base")) {
            const baseOptions = this.getBaseOptions();
            const baseSelect = this.bindOptions(baseOptions, this.makeBaseSelect());
            const TopCapOptions = this.getTopCapOptions();
            const TopCapSelect = this.bindOptions(
                TopCapOptions,
                this.makeTopCapSelect()
            );
            const newBasePartsBox = this.makePartSelectionBox("Base Options");
            newBasePartsBox.querySelector(".card-body").appendChild(baseSelect);
            const newTopCapPartsBox = this.makePartSelectionBox("Top Cap Options");
            newTopCapPartsBox.querySelector(".card-body").appendChild(TopCapSelect);

            document.getElementById("toolBars").appendChild(newBasePartsBox);
            document.getElementById("toolBars").appendChild(newTopCapPartsBox);
        }
    };
    updateTower = () => {
        if (this.currentTowerUUID) {
            this.scene.remove(this.currentTowerUUID);
            //this.currentTowerUUID.dispose()
        }
        this.tower.reset();

        this.tower.setTowerBase(this.selectedBase);
        this.tower.setTowerTopCap(this.selectedTopCap);
        console.log(this.towerHeight);
        this.tower.setTowerHeight(this.towerHeight);
        this.tower.createTower();

        this.currentTowerUUID = this.tower.get3DTowerObject();
        this.scene.add(this.currentTowerUUID);
        //this.objects.push(this.currentTowerUUID)
        this.camera.fitToObject(this.currentTowerUUID, this.controls);
        this.animate();
    };
    makeSliderBar = (id, name, labelText, min = 10, max = 100, snapTo = 10, list, onChangeEventSent) => {

        const range = this.components.c("input")
        const label = this.components.c("label")
        const lableValue = this.components.c("div")
        const div = this.components.c("div")
        div.className = "form-group"
        label.innerText = labelText
        label.for = "labelText"
        range.type = "range"
        range.className = ".custom-range"
        range.id = id
        range.name = name
        range.min = min
        range.max = max
        range.step = snapTo
        range.value = "10";
        lableValue.innerText = "Cuerrent: " + range.value;
        lableValue.id = id + "_display"
        if (list) {
            const ticks = this.components.c("datalist");
            ticks.id = "ticks_" + range.id
            range.setAttribute("list", ticks.id)
            for (let i = 0; i < (list.length); i++) {

                const opt = Components.c("option")
                opt.value = parseInt(list[i]);
                opt.setAttribute("label", list[i]);
                ticks.appendChild(opt)
            }
            div.appendChild(ticks)
        }
        onChangeEventSent.bind(this)
        range.addEventListener("oninput", onChangeEventSent);
        div.appendChild(label)
        div.appendChild(lableValue)
        div.appendChild(range)

        return div;
    }


    makeSelectBox = (id, name, label, onSelectionEvent) => {
        const Components = new components();
        return Components.selectBox(id, name, label, onSelectionEvent);
    };

    makeBaseSelect = () => {
        const baseSelect = this.makeSelectBox(
            "base",
            "base",
            "Select Base (Optional)",
            this.onBaseSelect
        );
        return baseSelect;
    };

    makeTopCapSelect = () => {
        const topCapSelect = this.makeSelectBox(
            "topcap",
            "topcap",
            "Select Top Cap (Optional)",
            this.onTopCapSelect
        );
        return topCapSelect;
    };

    getBaseOptions = () => {
        let dataBases = [{
                name: "SB25G5",
                value: "SB25G5"
            },
            {
                name: "25GSSB",
                value: "25GSSB"
            },
            {
                name: "SBH25G",
                value: "SBH25G"
            }
        ];
        let returnH = [];
        let count = -1;
        for (let i = 0; i < dataBases.length; i++) {
            returnH.push({
                name: dataBases[i].name,
                value: dataBases[i].value,
                id: ++count,
                isSelected: count === 0 ? true : false
            });
        }
        return returnH;
    };

    getTopCapOptions = () => {
        let dataBases = ["25AG3", "25AG4", "25AG5"];
        let returnH = [];
        let count = -1;
        for (let i = 0; i < dataBases.length; i++) {
            returnH.push({
                name: dataBases[i],
                value: dataBases[i],
                isSelected: count === 0 ? true : false
            });
            ++count;
        }
        return returnH;
    };

    makePartSelectionBox = name => {
        const partSelectionBox = this.components.card("", name, null);
        return partSelectionBox;
    };

    onChangeShowFloor = event => {
        this.floor.visible = event.target.checked;
    };

    onChangeShowPad = event => {
        this.towerPad.visible = event.target.checked;
    };

    onChangeAutoRotate = event => {
        this.autoRotate = event.target.checked;
    };
    onChangeGroundTransparency = event => {
        this.floor.material.opacity = parseFloat(event.target.valueAsNumber / 100);
    };

    makeFoundationOptions = () => {
        let floor = {
            id: "showFloor",
            name: "showFloor",
            label: "Show Ground",
            isChecked: false,
            onChangeEvent: this.onChangeShowFloor.bind(this)
        };
        let pad = {
            id: "showPad",
            name: "showPad",
            label: "Show Foundation",
            isChecked: false,
            onChangeEvent: this.onChangeShowPad.bind(this)
        };
        let rotate = {
            id: "autoRotate",
            name: "autoRotate",
            label: "Auto Rotate",
            isChecked: true,
            onChangeEvent: this.onChangeAutoRotate.bind(this)
        };

        const groundOpacitySlider = this.makeSliderBar("groundOpacity", "groundOpacity", "Ground Opacity", 0, 100, 10, null, this.onChangeGroundTransparency)

        let options = [floor, pad, rotate];
        const foundationOptions = this.makePartSelectionBox("Foundation");
        options.forEach(option => {
            const element = this.makeCheckBoxOption(
                option.id,
                option.name,
                option.label,
                option.isChecked,
                option.onChangeEvent
            );

            foundationOptions.appendChild(element);
            // if (option.name = "showFloor") {
            //     foundationOptions.appendChild(groundOpacitySlider)
            // }
        });

        document.getElementById("toolBars").appendChild(foundationOptions);
    };

    makeCheckBoxOption = (id, name, label, isChecked = false, onChangeEvent) => {
        const div = this.components.c("div");
        const input = this.components.c("input");
        const labelElement = this.components.c("label");
        div.className = "form-check";
        input.className = "form-check-input";
        input.type = "checkbox";
        input.checked = isChecked;
        input.id = id;
        input.name = name;
        input.addEventListener("change", onChangeEvent);
        labelElement.className = "form-check-label";
        labelElement.for = id;
        labelElement.innerText = label;
        div.appendChild(input);
        div.appendChild(labelElement);
        return div;
    };

    bindOptions = (options, htmlSelectBox) => {
        for (let i = 0; i < options.length; i++) {
            const opt = document.createElement("option");
            const textNode = document.createTextNode(options[i].name);
            opt.appendChild(textNode);
            opt.value = options[i].value || options[i].id.toString();
            opt.selected = options[i].isSelected;
            htmlSelectBox.appendChild(opt);
        }
        return htmlSelectBox;
    };

    onBaseSelect = event => {
        event.preventDefault();

        const itemSelected = event.target.selectedOptions[0].value;
        if (typeof this.tower !== "undefined") {
            cancelAnimationFrame(this.animationFrameId);
            this.selectedBase = itemSelected;
            this.updateTower();
        }
    };

    onTopCapSelect = event => {
        event.preventDefault();

        const itemSelected = event.target.selectedOptions[0].value;
        if (typeof this.tower !== "undefined") {
            cancelAnimationFrame(this.animationFrameId);
            this.selectedTopCap = itemSelected;
            this.updateTower();
        }
    };
}
export default Thebuilder;