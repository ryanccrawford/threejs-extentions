import * as THREE from "three";
import {
	PartBase,
	PartOptions
} from "./partbase.js";
import Materials from "./materials.js";

class Mpn25ag4 extends PartBase {

	constructor(options) {
			let opt = new PartOptions();
			if (typeof options === 'undefined') {

				opt.readyCallback = null;
			} else {
				opt = options;
			}
		opt.importFile = 'assets/3dmodels/25AG4.fbx'
		if(!opt.material){
			opt.material = new Materials().ShinnyChrome;
		}

		opt.name = "25AG4"
	
		super(opt);
		this.position.setX(-0.149);
        this.position.setZ(0.301);
	}



}

export default Mpn25ag4;