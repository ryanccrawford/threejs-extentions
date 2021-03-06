import * as THREE from "three";
import {
    PartBase,
    PartOptions
} from "./partbase.js";
import Materials from "./materials";

class MpnSbh25g extends PartBase {

    constructor(options) {
        let opt = new PartOptions();
        if (typeof options === 'undefined') {

            opt.readyCallback = null;
        } else {
            opt = options
        }
        opt.importFile = 'assets/3dmodels/SBH25G.fbx'
        if (!opt.material) {
            opt.material = new Materials().ShinnyChrome;
        }
        opt.name = "SBH25G"

        super(opt);
        this.position.setX(-0.75);

    }



}

export default MpnSbh25g;