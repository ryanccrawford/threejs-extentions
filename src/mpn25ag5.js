import * as THREE from "three";
import PartBase from "./partbase.js";
import Materials from "./materials";

class Mpn25ag5 extends PartBase {

	constructor(options) {
		options.importFile = 'assets/3dmodels/25AG5.fbx'
		chromeMaterial = Materials.ShinnyChrome;

		options.name = "25AG5"
		options.material = chromeMaterial
		super(options);
	}



}

export default Mpn25ag5;