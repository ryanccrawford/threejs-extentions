import * as THREE from "three";
import { PartBase } from "./partbase.js";
import Materials from "./materials.js";

class Mpn25ag5 extends PartBase {

	constructor(options) {
		if (typeof options === 'undefined') {
			let options = new PartOptions();
			options.readyCallback = null;
		}
		options.importFile = 'assets/3dmodels/25AG5.fbx'
		const chromeMaterial = new Materials().ShinnyChrome;

		options.name = "25AG5"
		options.material = chromeMaterial
		super(options);
	}



}

export default Mpn25ag5;