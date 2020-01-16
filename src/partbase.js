import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

class PartBase extends THREE.Object3D {
    static meshInMemory;
    name = "";
    importFile = "";
    loader;
    material;
    dimHeight;
    dimWidth;
    dimLength;
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
        if(this.importFile.length > 0 && typeof this.readyCallback === 'function'){
            this.getPart();
        }
    }

    getPart = () => {
        if (this.importFile) {
            this.fileImporter();
        }
    }

    importComplete = part => {
        part.name = this.name
        this.children = new [THREE.Object3D];
        this.add(part);
        this.dimHeight = this.getHeight();
        this.dimWidth = this.getWidth();
        this.dimLength = this.getLength();
        this.isImportComplete = true;
        if(typeof this.readyCallback === 'function'){
            this.readyCallback(part);
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

    setMaterial = (material) => {
        const bindermaterial = material
        this.traverse(function(child) {
            if (child.isMesh) {
                child.material = bindermaterial;
            }
        });
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