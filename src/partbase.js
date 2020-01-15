import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

class PartBase {
    
    static id = -1;
    
    name = '';
    importFile = '';
    partMesh = null;
    loader = new FBXLoader();
    material = null;
    height = null;
    width = null;
    position = null;
    isImportComplete = false;

    constructor(options = new PartOptions()) {
        self.id++;
        this.name = options.name;
        this.material = options.material;
        this.importFile = options.importFile;
        if (this.importFile) {
            this.fileImporter(this.importComplete);
        }

    }

    importComplete = (part) => {
        this.height = part.height;
        this.width = part.width;
        this.position = part.position;
        this.partMesh = part;
        this.isImportComplete = true;
    }

    fileImporter = (callback) => {
        if (!this.importFile || this.isImportComplete) {
            return;
        }
        let binder = this;
        this.loader.load(this.importFile, function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.MeshLambertMaterial = binder.material;
                }
            });
            
            callback(object);
        });
    };

    clone = () => {
        if (!this.isImportComplete) {
            return;
        }
        return this.partMesh.clone(true);
    }
}

class PartOptions {
    name;
    material;
    importFile;
}

export default PartBase;