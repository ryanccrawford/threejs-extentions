import * as THREE from 'three';


class TowerCamera extends THREE.PerspectiveCamera {

    constructor(width, height) {
        super(25,
            width / height,
            1,
            1000);

        this.position.set(0, 100, 600);
        this.lookAt(0, 0, 0);
    }

    fitToObject = (object3D, controls) => {

        const box = new THREE.Box3();

        box.expandByObject(object3D);

        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance =
            maxSize / (2 * Math.atan((Math.PI * this.fov) / 360));
        const fitWidthDistance = fitHeightDistance / this.aspect;
        const distance = 1.15 * Math.max(fitHeightDistance, fitWidthDistance);

        const direction = controls.target
            .clone()
            .sub(this.position)
            .normalize()
            .multiplyScalar(distance);

        controls.maxDistance = distance * 10;
        controls.target.copy(center);
        controls.autoRotate = true;
        console.log(controls)
        controls.update();
        this.near = distance / 100;
        this.far = distance * 100;
        this.updateProjectionMatrix();

        this.position.copy(controls.target).sub(direction);
        this.position.setY(this.position.y * 1.2)
    }

}

export default TowerCamera;