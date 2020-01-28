import * as THREE from "three";
import { PartBase, PartOptions } from "./partbase.js";
import Materials from "./materials";

class Mpn25ag3 extends PartBase {
    constructor(options) {
        let opt = new PartOptions();
        if (typeof options === "undefined") {
           
            opt.readyCallback = null;
        }else {
            opt = options;
        }
        opt.importFile = "assets/3dmodels/25AG3.fbx";

        opt.name = "25AG3";
        super(opt);
    }
}

export default Mpn25ag3;