import * as THREE from "three";
import PartBase from "./partbase.js"
class TowerSection extends PartBase {



	constructor(options) {
		options.importFile = 'assets/3dmodels/25g.fxb'
		eMap = new THREE.CubeTextureLoader().setPath("assets/3dmodels/images/cmap/").load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
		chromeMaterial = new THREE.MeshLambertMaterial({
			color: 0xfeb74c,
			envMap: eMap,
			reflectivity: 0.7
		});

		options.name = "25G 10' Section"
		options.material = chromeMaterial
		super(options);
	}

	

}

export default TowerSection;