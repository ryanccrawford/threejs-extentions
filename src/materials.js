import * as THREE from "three";

class Materials {
		eMap
		ShinnyChrome
		DullChrome
		RollOver
		ConcreteMap

		constructor() {
			
		
		this.eMap = new THREE.CubeTextureLoader().setPath("assets/3dmodels/images/cmap/").load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"])
		this.eMap.mapping = THREE.CubeRefractionMapping;
		this.SandGravel = new THREE.TextureLoader().setPath("assets/images/textures/").load('sand.jpg')
		this.ConcreteMap = new THREE.TextureLoader().setPath("assets/images/textures/").load('block-2.jpg')
		this.ShinnyChrome = new THREE.MeshLambertMaterial({
				color: 0xcccccc,
				envMap: this.eMap,
				reflectivity: 0.5,
				refractionRatio: 0.75,
				shininess: 10,
				roughness: 30,

			})
		this.DullChrome = new THREE.MeshLambertMaterial({
			color: 0xcccccc,
			envMap: this.eMap,
			reflectivity: 0.3,
			refractionRatio: 0.78,
			metalness: 78,
		})
		this.RollOver = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			opacity: 0.5,
			transparent: true
		})
		this.Concrete = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			map: this.ConcreteMap,
			reflectivity: 0.0,
			refractionRatio: 0.0,
		})
		this.SandGravel = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			map: this.SandGravel,
			reflectivity: 0.0,
			refractionRatio: 0.0,
		})
	}
}

export default Materials;