import * as THREE from "three";
import {PartBase, PartOptions} from "./partbase.js";
import Materials from "./materials.js";

class Mpn25g extends PartBase {

	constructor(options) {
		if (typeof options === 'undefined') {
			let options = new PartOptions();
			options.readyCallback = null;
		}
		options.importFile = 'assets/3dmodels/25G.fbx'
		const mat = new Materials();

		options.name = "25G"
		options.material = mat.ShinnyChrome
		super(options);
	}



}

export default Mpn25g;