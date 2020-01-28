import * as THREE from "three";
import {
	PartBase,
	PartOptions
} from "./partbase.js";
import Materials from "./materials";

class MpnSb25g extends PartBase {

	constructor(options) {
		if (typeof options === 'undefined') {
			let options = new PartOptions();
			options.readyCallback = null;
		}
		options.importFile = 'assets/3dmodels/SB25G.fbx'
		
		if(!opt.material){
			opt.material = new Materials().ShinnyChrome;
		}
		options.name = "SB25G"
		
		super(options);
	}



}

export default MpnSb25g;