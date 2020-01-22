import * as THREE from 'three';


class TowerCamera extends THREE.PerspectiveCamera {

    constructor(width, height){
        super(25,
            width / height,
            1,
            10000);

        this.position.set(0, 100, 600);
        this.lookAt(0, 0, 0);
    }


}

export default TowerCamera;