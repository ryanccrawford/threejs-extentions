import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

class PartBase {
    static meshInMemory
    name = "";
    importFile = "";
    partMesh;
    loader;
    material;
    materialType;
    height;
    width;
    position;
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
    };

    importComplete = part => {
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

    fileImporter = () => {
        let binder = this;
        if (!self.meshInMemory) {
            this.loader.load(this.importFile, function(object) {
                object.traverse(function(child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (binder.materialType === "MeshLambertMaterial") {
                            child.MeshLambertMaterial = binder.material;
                        } else {
                            child.MeshBasicMaterial = binder.material;
                        }

                    }
                });

                binder.importComplete(object);
            });
        } else {
            const mesh = this.clone();
            const binder = this;
            mesh.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (binder.materialType === "MeshLambertMaterial") {
                        child.MeshLambertMaterial = binder.material;
                    } else {
                        child.MeshBasicMaterial = binder.material;
                    }
                }
            });
            binder.importComplete(mesh);

        }
    };

    clone = () => {
        return self.meshInMemory.clone(true);
    };
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