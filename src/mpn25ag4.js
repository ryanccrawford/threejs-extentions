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
		

		opt.name = "25AG4"
	
		super(opt);
	}



}

export default Mpn25ag4;