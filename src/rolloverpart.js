import * as THREE from "three";
import { PartBase } from "./partbase.js";

class RolloverPart extends PartBase {

    constructor(options) {
        console.log("inside RolloverPart");
        console.log(options);
        super(options);


    }



}

export { RolloverPart };