import * as THREE from "three";
import { PartBase, PartOptions } from "./partbase.js";
import Materials from "./materials";

class Mpn25ag3 extends PartBase {
    constructor(options) {
        if (typeof options === "undefined") {
            let options = new PartOptions();
            options.readyCallback = null;
        }
        options.importFile = "assets/3dmodels/25AG3.fbx";

        options.name = "25AG3";
        super(options);
    }
}

export default Mpn25ag3;