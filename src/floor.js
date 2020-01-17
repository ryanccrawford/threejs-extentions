import * as THREE from "three";
import { PartBase } from "./partbase.js"

class Floor extends PartBase {

    dimLength = 1000;
    dimWidth = 1000;
    hasGrid = true;
    gridColor = "#ffffff"
    gridDivisions = 10;
    rotateBy = -90;
    grid;


    constructor(options) {
        
        super(options)
        this.hasGrid = options.hasGrid || this.hasGrid;
        this.gridDivisions = options.gridDivisions || this.gridDivisions;
        this.gridColor = options.gridColor;
        this.dimLength = options.length || this.length;
        this.dimWidth = options.width || this.width; 
        this.sceneRef = options.scene;
        if (typeof this.readyCallback === 'function') {
            this.createFloor();
        }
    }

    createFloor = () => {
        if (this.hasGrid) {
            const gridHelper = new THREE.GridHelper((this.dimLength + this.dimWidth) / 2 , this.gridDivisions, this.gridColor);
            this.grid = gridHelper;
        }
            const geometry = new THREE.PlaneBufferGeometry(this.length, this.width);
            geometry.rotateX(-Math.PI / 2);
            const floor = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({
                    visible: false, 
                })
            )
            
        this.importComplete(floor)
    };

}

class FloorOptions {
    name = "Floor";
    length = 1000;
    width = 1000;
    readyCallback;
    hasGrid = true;
    gridColor = "#ffffff"
    gridDivisions = 10;
    rotateBy = -90;
}

export { Floor, FloorOptions };