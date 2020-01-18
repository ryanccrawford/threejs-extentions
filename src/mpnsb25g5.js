import * as THREE from "three";
import { PartBase }from "./partbase.js";
import Materials from "./materials";

class MpnSb25g5 extends PartBase {

	constructor(options) {
		if (typeof options === 'undefined') {
			let options = new PartOptions();
			options.readyCallback = null;
		}
		options.importFile = 'assets/3dmodels/SB25G5.fbx'
		const chromeMaterial = new Materials().ShinnyChrome;

		options.name = "SB25G5"
		options.material = chromeMaterial
		super(options);
	}



}

export default MpnSb25g5;