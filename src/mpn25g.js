import * as THREE from "three";
import PartBase from "./partbase.js";
import Materials from "./materials";

class Mpn25g extends PartBase {

	constructor(options) {
		options.importFile = 'assets/3dmodels/25G.fbx'
		chromeMaterial = Materials.ShinnyChrome;

		options.name = "25G"
		options.material = chromeMaterial
		super(options);
	}



}

export default Mpn25g;