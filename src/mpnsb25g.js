import * as THREE from "three";
import { PartBase } from "./partbase.js";
import Materials from "./materials";

class MpnSb25g extends PartBase {

	constructor(options) {
		if (typeof options === 'undefined') {
			let options = new PartOptions();
			options.readyCallback = null;
		}
		options.importFile = 'assets/3dmodels/SB25G.fbx'
		chromeMaterial = new Materials().ShinnyChrome;

		options.name = "SB25G"
		options.material = chromeMaterial
		super(options);
	}



}

export default MpnSb25g;