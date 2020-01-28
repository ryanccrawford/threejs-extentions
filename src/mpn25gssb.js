import * as THREE from "three";
import {
	PartBase,
	PartOptions
} from "./partbase.js";
import Materials from "./materials";

class Mpn25gssb extends PartBase {

	constructor(options) {
			let opt = new PartOptions();
			if (typeof options === 'undefined') {

				opt.readyCallback = null;
			} else {
				opt = options;
			}
		opt.importFile = 'assets/3dmodels/25GSSB.fbx'
		if(!opt.material){
			opt.material = new Materials().ShinnyChrome;
		}

		opt.name = "25GSSB"
	
		super(opt);
	}



}

export default Mpn25gssb;