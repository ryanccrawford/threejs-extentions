import * as THREE from "three";

class Materials {
		eMap
		ShinnyChrome
		DullChrome
		RollOver

		constructor() {
			
		
		this.eMap = new THREE.CubeTextureLoader().setPath("assets/3dmodels/images/cmap/").load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]),
			this.ShinnyChrome = new THREE.MeshPhongMaterial({
				color: 0xcccccc,
				envMap: this.eMap,
				reflectivity: 0.7,
				refractionRatio: 0.98,
				shininess: 50,
			})
		this.DullChrome = new THREE.MeshPhongMaterial({
			color: 0xcccccc,
			envMap: this.eMap,
			reflectivity: 0.3,
			refractionRatio: 0.98,
			shininess: 25,
		})
		this.RollOver = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			opacity: 0.5,
			transparent: true
		})
	}
}

export default Materials;