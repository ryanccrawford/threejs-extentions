import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

class PartBase {
    static id = -1;
    name;
    importFile;
    originPart;
    loader = null;
    material;


    constructor(options = new PartOptions()) {
        self.id++;
        this.name = options.name;
        this.material = options.material;
        this.importFile = options.importFile;
        this.loader = new FBXLoader();
        if (this.importFile) {
            this.loader(this.importComplete);
        }

    }

    importComplete = (part) => {


    }

    loader = (callback) => {
        if (!this.importFile) {
            return;
        }


        let binder = this;
        this.loader.load(importFile, function(object) {
            const eMap = new THREE.CubeTextureLoader()
                .setPath("assets/3dmodels/images/cmap/")
                .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
            binder.partMaterial = new THREE.MeshLambertMaterial({
                color: 0xfeb74c,
                envMap: eMap,
                reflectivity: 0.7
            });

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
}

class PartOptions {
    name;
    material;
    importFile;
}