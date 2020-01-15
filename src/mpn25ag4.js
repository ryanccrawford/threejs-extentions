import * as THREE from "three";
import PartBase from "./partbase.js";
import Materials from "./materials";

class Mpn25ag4 extends PartBase {

	constructor(options) {
		options.importFile = 'assets/3dmodels/25AG4.fbx'
		chromeMaterial = Materials.ShinnyChrome;

		options.name = "25G"
		options.material = chromeMaterial
		super(options);
	}



}

export default Mpn25ag4;