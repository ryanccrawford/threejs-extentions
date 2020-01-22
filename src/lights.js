import * as THREE from 'three';

class TowerLights extends THREE.Group {

    

    constructor(){
        super()
        this.name = "Lights"
        const ambientLight = new THREE.AmbientLight(0x606060);
        this.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.add(directionalLight);
    }


}

export default TowerLights;