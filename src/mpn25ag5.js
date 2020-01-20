import * as THREE from "three";
import {
	PartBase,
	PartOptions
} from "./partbase.js";
import Materials from "./materials.js";

class Mpn25ag5 extends PartBase {

	constructor(options) {
			let opt = new PartOptions();
			if (typeof options === 'undefined') {

				opt.readyCallback = null;
			} else {
				opt = options;
			}
		opt.importFile = 'assets/3dmodels/25AG5.fbx'
		

		opt.name = "25AG5"
	
		super(opt);
	}



}

export default Mpn25ag5;