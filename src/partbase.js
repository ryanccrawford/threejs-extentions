import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

class PartBase {
    static meshInMemory;
    name = "";
    importFile = "";
    partMesh;
    loader;
    material;
    materialType;
    height;
    width;
    size;
    isImportComplete = false;
    readyCallback;

    constructor(options = new PartOptions()) {
        this.name = options.name;
        this.material = options.material;
        this.importFile = options.importFile;
        this.readyCallback = options.readyCallback;
        this.materialType = options.materialType;
        this.loader = new FBXLoader();
    }

    getPart = () => {
        if (this.importFile) {
            console.log("Importing Part: Function getPart() was called");
            this.fileImporter();
        }
    }

    importComplete = part => {

        this.partMesh = part;
        this.height = this.getHeight();
        this.width = this.getWidth();
        this.length = this.getLength();
        this.isImportComplete = true;
        this.readyCallback(part);
    }

    position = () => {
        if (this.isImportComplete) {
            return this.partMesh.position;
        }
    }
    fileImporter = () => {
        const binder = this;
        if (!self.meshInMemory) {

            this.loader.load(this.importFile, function(object) {
                //object.rotateX(THREE.Math.degToRad(-90));
                object.traverse(function(child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material = binder.material;
                    }
                });
                self.meshInMemory = object;
                binder.importComplete(object);
            });
        } else {
            const mesh = this.clone();
            mesh.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = binder.material;
                }
            });

            binder.importComplete(mesh)
        }
    }

    getHeight = () => {
        console.log("height: ");
        const height = this.getSize().y;
        console.log(height);
        return height;
    }

    getWidth = () => {
        console.log("width: ");
        const width = this.getSize().x;
        console.log(width);
        return width;
    }

    getLength = () => {
        console.log("length: ");
        const length = this.getSize().z;
        console.log(length);
        return length;
    }

    getSize = () => {
        if (!this.size) {
            this.size = new THREE.Vector3();
        }
        const box = new THREE.Box3().setFromObject(this.partMesh);
        return box.getSize(this.size);
    };

    clone = () => {
        return self.meshInMemory.clone(true);
    }
}

class PartOptions {
    name;
    material;
    importFile;
    readyCallback;
    materialType;
}

export {
    PartBase,
    PartOptions
};