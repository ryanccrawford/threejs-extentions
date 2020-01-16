import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Mpn25g from "./mpn25g.js";
import Mpn25ag5 from "./mpn25ag5.js";
import MpnSb25g5 from "./mpnsb25g5.js";
//import Mpn25ssb from "./mpn25gssb.js";
import { PartOptions } from "./partbase.js";
import * as THREE from "three";

class Tower25G  {

    model = "";
    height = 10;
    numberOfSections = 0;
    parts3DGroup = new TowerParts();
    topCapeBase = "AG";
    topCapMPN = "";
    topCap = new THREE.Object3D();
    
    base = new THREE.Object3D();
    baseMPN = ""
    section = new THREE.Object3D();
    type = "";
    asseccories = [];
    sectionClass = "";
    topCapClass = "";
    baseClass = "";

    constructor() {

        this.topCap = new THREE.Object3D();
        this.base = new THREE.Object3D();
        this.section = new THREE.Object3D();
      

    }

    setType = (SeriesNumber = "25") => {
        this.type = SeriesNumber + "G";
        this.topCap = SeriesNumber + this.topCapeBase + this.TopCapNumber;
        this.section = this.type;
        if(this.baseType.length < 1){
            this.baseType = "SB5"
        }
        if(this.baseType === "SB5"){
            this.base = "SB" + this.type + "5"
        }
        if(this.baseType === "SB"){
            this.base = "SB" + this.type
        }
        if(this.baseType === "BPH"){
            this.base = "BPH" + this.type
        }
        if(this.baseType === "SSB"){
            this.base = this.type + "SSB"
        }
        if(this.baseType === "BPC"){
           this.base = "BPC" + this.type
        }
        this.loadBase(this.base);
    } 
    loadBase = (base) => {
        const base3DObj = new MpnSb25g5();


    }
    onPartLoaded = (part, type) => {
        switch(type){
            case "topCap":
                this.topCap.add()
            break;
            case "base":

            break;
            case "section":

            break;
            default:
                break;
        }


    }

    onloadDone = (part) => {
        if (this.height < 10) {
            this.setHeight(10)
        }

    }
    setModel = (model) => {
        this.model = model;
    }

    readyToaddToScene = () => {
        console.log(this)

    }

    setHeight = (height) => {
        this.height = height;
        this.numberOfSections = parseInt((this.height / 10) - 1);
        if (this.sectionObj.isImportComplete) {
            this.parts = [];
            for (let i = 0; i < this.numberOfSections; i++) {
                const newSection = this.sectionObj.clone();
                this.parts.push(newSection);
            }
            const Group = new THREE.Group();
            Group.add(this.parts)
            Group.add(this.baseObj.partMesh)
            Group.add(this.baseObj.partMesh)

            this.readyToaddToScene()
        }
    }

}

class TowerParts extends THREE.Group {



}

export default Tower25G;