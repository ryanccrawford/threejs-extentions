import * as THREE from "three";
import { PartBase } from "./partbase.js";
import Materials from "./materials";

class Mpn25gssb extends PartBase {

	constructor(options) {
		if (typeof options === 'undefined') {
			let options = new PartOptions();
			options.readyCallback = null;
		}
		options.importFile = 'assets/3dmodels/25GSSB.fbx'
		chromeMaterial = new Materials().ShinnyChrome;

		options.name = "25GSSB"
		options.material = chromeMaterial
		super(options);
	}



}

export default Mpn25gssb;