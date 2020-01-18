import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

class PartBase extends THREE.Object3D {
    static meshInMemory;
    importFile = "";
    loader;
    material;
    dimHeight;
    dimWidth;
    dimLength;
    size;
    isImportComplete = false;
    readyCallback;
    

    constructor(options) {
        super();
        this.name = options.name || "";
        this.material = options.material || null;
        this.importFile = options.importFile || "";
        if (options.readyCallback === null) {
            this.readyCallback = null;
        } else {
            this.readyCallback = options.readyCallback;
        }
        
        if (this.name === "Floor") {
            return;
        }
        this.loader = new FBXLoader();
        this.getPart();
     
    }

    getPart = () => {
        if (this.importFile) {
            this.fileImporter();
        }
    }

    importComplete = part => {
        this.add(part);
        this.dimHeight = this.getHeight();
        this.dimWidth = this.getWidth();
        this.dimLength = this.getLength();
        this.isImportComplete = true;
        if (this.readyCallback === null) {
            return;
        } else {
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
                    child.material = binder.material;
                }
            });

            binder.importComplete(mesh)
        }
    }

    setMaterial = (material) => {
        const bindermaterial = material
        this.children.traverse(function(child) {
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
        const box = new THREE.Box3().setFromObject(this);
        return box.getSize(this.size);
    };

    staticClone = () => {
        return self.meshInMemory.clone(true);
    }
}

class PartOptions {
    name;
    material;
    importFile;
    readyCallback;
}

export {
    PartBase,
    PartOptions
};