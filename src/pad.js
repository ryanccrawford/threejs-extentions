import * as THREE from "three";
import {
    PartBase,
    PartOptions
} from "./partbase.js";
import Materials from "./materials";



class Pad extends PartBase {

    constructor(options) {


        if (typeof options === 'undefined') {
            let options = new PartOptions();
            options.readyCallback = null;
        }
        options.importFile = 'assets/3dmodels/PAD2.fbx'


        options.name = "Pad"

        super(options);
        // 	this.position.setY(-6.5);

        this.translate(0, 0, 0);
        this.position.copy(new THREE.Vector3(0, 0, 0.0));
        const box = new THREE.Box3().setFromObject(this);
        box.getCenter(this.position); // this re-sets the obj position
        this.position.setX(-17.75)
        this.position.setZ(17.90)
    }




}

export default Pad;