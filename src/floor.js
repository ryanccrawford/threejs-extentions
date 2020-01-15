import * as THREE from "three";


class Floor {
    geometery;
    material;
    color;
    length;
    width;
    readyCallback;

    constructor(options) {
        this.material = options.material;
        this.readyCallback = options.readyCallback;
        this.color = options.color;
        this.length = options.length;
        this.width = options.width;
    }

    getFloor = () => {


    };

    floorComplete = part => {
        this.height = part.height;
        this.width = part.width;
        this.position = part.position;
        if (!self.meshInMemory) {
            self.meshInMemory = part;
        }
        this.partMesh = part;
        this.isImportComplete = true;
        this.readyCallback(this.partMesh);
    };

    clone = () => {
        return this.geometery.clone(true);
    };
}

class FloorOptions {
    name;
    material;
    importFile;
    readyCallback;
    materialType;
}

export { Floor, FloorOptions };