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
		options.importFile = 'assets/3dmodels/PAD.fbx'


		options.name = "Pad"
		
        super(options);
        this.position.setY(-48);
        this.rotateY(THREE.Math.degToRad(-90));
        this.position.setX(-15)
        this.position.setZ(-30)
        
	}



}

export default Pad;