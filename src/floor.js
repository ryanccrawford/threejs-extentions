import * as THREE from "three";
import { PartBase, PartOptions } from "./partbase.js"

class Floor extends PartBase {

    gridLength;
    gridWidth;
    hasGrid;
    gridColor;
    gridDivisions;
    grid;


    constructor(options) {
        options.name = "Floor"

        super(options)
        this.hasGrid = options.hasGrid || true;
        if (options.hasGrid) {
            this.gridDivisions = options.gridDivisions || 20;
            this.gridColor = options.gridColor || "#222222";
            this.gridLength = options.gridLength || 1000;
            this.gridWidth = options.gridWidth || 1000;
        }
        this.sceneRef = options.sceneRef;
        this.createFloor();
    }

    createFloor = () => {
        // if (this.hasGrid) {
        //     const gridHelper = new THREE.GridHelper((this.gridLength + this.gridWidth) / 2, this.gridDivisions, this.gridColor, this.gridColor);
        //     this.add(gridHelper)
        //     this.sceneRef.add(gridHelper);
        // }
        const geometry = new THREE.PlaneBufferGeometry(this.gridLength, this.gridWidth);
        geometry.rotateX(-Math.PI / 2);
        const floor = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                color: this.gridColor,
                //visible: false,
                transparent: true,
                opacity: 0.5
            })
        );

        this.importComplete(floor)
    };

}

class FloorOptions extends PartOptions {

    gridLength;
    gridWidth;
    hasGrid;
    gridColor;
    gridDivisions;
    sceneRef;
}

export { Floor, FloorOptions };