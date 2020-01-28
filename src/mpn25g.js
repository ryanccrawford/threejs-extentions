import * as THREE from "three";
import {PartBase, PartOptions} from "./partbase.js";
import Materials from "./materials.js";

class Mpn25g extends PartBase {

	constructor(options) {
		let opt = new PartOptions();
		if (typeof options === 'undefined') {
			
			opt.readyCallback = null;
		} else {
			opt = options;
		}
		if(!opt.material){
			opt.material = new Materials().ShinnyChrome;
		}
		opt.importFile = 'assets/3dmodels/25G.fbx'
	
		opt.name = "25G"
		
		super(opt);
	}



}

export default Mpn25g;