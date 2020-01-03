import * as THREE from "three";
import { PartBase } from "./partbase.js";
class TowerSection extends PartBase {
    constructor(options) {

        options.importFile = "assets/3dmodels/25g.fbx";

        super(options);

        console.log("inside TowerSection");
        console.log(options);
    }
}

export { TowerSection };