import * as THREE from "three";
import {
	PartBase,
	PartOptions
} from "./partbase.js";
import Materials from "./materials";

class MpnSb25g5 extends PartBase {

	constructor(options) {
		let opt = new PartOptions();
		if (typeof options === 'undefined') {
			
			opt.readyCallback = null;
		} else {
			opt = options
		}
		opt.importFile = 'assets/3dmodels/SB25G5.fbx'
		
		opt.name = "SB25G5"
		
		super(opt);
	}



}

export default MpnSb25g5;