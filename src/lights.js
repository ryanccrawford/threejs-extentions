import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

class TowerLights extends THREE.Group {



    constructor() {
        super()
        this.name = "Lights"
        const ambientLight = new THREE.AmbientLight(0xffffff);

        this.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff);

        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.add(directionalLight);
    }


}


class Atmospher {


    sky;
    sunSphere;
    sunLight;
    gui;
    effectController;
    distance = 1000
    constructor() {




        this.sky = new Sky();
        this.sky.scale.setScalar(1500);
        // Add Sun Helper
        this.sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(50, 30, 30),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.sunSphere.position.y = -70000;
        this.sunSphere.visible = false;
        /// GUI
        this.effectController = {
            turbidity: 1.2,
            rayleigh: 2.983,
            mieCoefficient: 0.001,
            mieDirectionalG: 0.982,
            luminance: 1,
            inclination: 0.49, // elevation / inclination
            azimuth: 0.25, // Facing front,
            sun: !true
        };

        this.sunLight = new THREE.DirectionalLight(0xffffff);

        this.gui = new GUI();
        this.gui.add(this.effectController, "turbidity", 1.0, 20.0, 0.1).onChange(this.guiChanged);
        this.gui.add(this.effectController, "rayleigh", 0.0, 4, 0.001).onChange(this.guiChanged);
        this.gui.add(this.effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(this.guiChanged);
        this.gui.add(this.effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(this.guiChanged);
        this.gui.add(this.effectController, "luminance", 0.0, 2).onChange(this.guiChanged);
        this.gui.add(this.effectController, "inclination", 0, 1, 0.0001).onChange(this.guiChanged);
        this.gui.add(this.effectController, "azimuth", 0, 1, 0.0001).onChange(this.guiChanged);
        this.gui.add(this.effectController, "sun").onChange(this.guiChanged);
        this.guiChanged();


    }

    guiChanged = () => {
        let uniforms = this.sky.material.uniforms;
        uniforms["turbidity"].value = this.effectController.turbidity;
        uniforms["rayleigh"].value = this.effectController.rayleigh;
        uniforms["mieCoefficient"].value = this.effectController.mieCoefficient;
        uniforms["mieDirectionalG"].value = this.effectController.mieDirectionalG;
        let bright = this.sunBrightness();
        uniforms["luminance"].value = bright;


        let theta = Math.PI * (bright - 0.5);
        let phi = 2 * Math.PI * (bright - 0.5);

        this.sunSphere.position.x = this.distance * Math.cos(phi);
        this.sunSphere.position.y = this.distance * Math.sin(phi) * Math.sin(theta);
        this.sunSphere.position.z = this.distance * Math.sin(phi) * Math.cos(theta);

        this.sunLight.visible = this.effectController.sun;

        uniforms["sunPosition"].value.copy(this.sunSphere.position);
        this.sunLight.position.set(this.sunSphere.position)

        this.sunLight.intensity = bright / 2;
        this.sunLight.position.normalize();
    }

    sunBrightness = () => {
        let d = new Date();
        let n = d.getHours();
        if (n > 12) n = n - 12;
        return this.map(n, 1, 100, 1, 12)


    }

    map = (s, a1, a2, b1, b2) => {
        return b1 + (a1 - s) * (b2 - b1) / (a2 - a1);
    }

}




export default TowerLights;

export { TowerLights, Atmospher }