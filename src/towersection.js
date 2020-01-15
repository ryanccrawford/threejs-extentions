import * as THREE from "three";
import { PartBase } from "./partbase.js";
class TowerSection extends PartBase {
    constructor(options) {

        options.importFile = "assets/3dmodels/25g.fbx";
        const eMap = new THREE.CubeTextureLoader()
            .setPath("assets/3dmodels/images/cmap/")
            .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
        eMap.mapping = THREE.CubeRefractionMapping;
        options.material = new THREE.MeshPhongMaterial({
            color: 0xc5c5c5,
            envMap: eMap,
            refractionRatio: 0.5,
            reflectivity: 0.5
        });
        super(options);

        console.log("inside TowerSection");
        console.log(options);
    }
}

export { TowerSection };