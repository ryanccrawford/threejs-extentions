import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Mpn25g from "./mpn25g.js";
import Mpn25ag5 from "./mpn25ag5.js";
import MpnSb25g5 from "./mpnsb25g5.js";
//import Mpn25ssb from "./mpn25gssb.js";
import { PartOptions } from "./partbase.js";
import * as THREE from "three";

class Tower25G extends THREE.Group {

    towerModel;
    towerHeight;
    towerTopCap;
    towerBase ;
    towerSections;
    towerType;
    towerAccessories;
    towerSection;
    towerTopCapMountHeight;
    useSectionAsBase = false;

    constructor() {
        super()
        this.towerModel = "25G"
        this.name = this.towerModel + " Tower";
        this.towerTopCap = new THREE.Object3D();
        this.towerTopCap.name = "Top Cap";
        this.towerBase = new THREE.Object3D();
        this.towerBase.name = "Base"
        this.towerSections = new THREE.Group();
        this.towerSections.name = "Sections"
        this.towerAccessories = new THREE.Group()
        this.towerAccessories.name = "Accessories"
        const options = new PartOptions();
        options.readyCallback = this.onSectionLoaded.bind(this)
        this.towerSection = new Mpn25g(options);
    }
    onSectionLoaded = (part) => {
        console.log(part)
    }
    onTopCapLoaded = (part) => {
         console.log(part)
    }
    onBaseLoaded = (part) => {
        console.log(part)

    }
    changeHeight = (height) => {
        this.useSectionAsBase = false;
        this.towerHeight = height;
        let numberOfSections = parseInt((this.towerHeight / 10) - 1);
        if ((this.towerHeight.toString()[1] === 5)) {
            this.useSectionAsBase = true;
            this.towerBase = null;
        }

        if (this.towerSections.length === numberOfSections) {
            this.towerBuild()
            return;
        }
        const newGroup = new THREE.Group();
        newGroup.name = "Sections";
        let nextMountHeight = 0;
        let addHeight = this.towerSection.dimLength;
        for (let i = 0; i < numberOfSections; i++) {
                const newSection = this.towerSection.clone();
                newSection.position.setY(nextMountHeight);
                nextMountHeight += addHeight;
                newGroup.add(newSection)
        }
        this.towerTopCapMountHeight = nextMountHeight;
        this.towerSections = newGroup;
        
    }

    changeBase = (base) => {
        
        if(!this.useSectionAsBasel){
            this.towerBase = base;
        }else if(this.useSectionAsBase){
            this.towerBase = null;
        }
        
    }

    changeTopCap = (topCap) => {
        this.towerTopCap = topCap
       
    }

    towerBuild = () => {

        this.children.length = 0;
        if(this.towerSections.length > 0){
            this.add(this.towerSections)
        }
        if(this.towerTopCap.length > 0){
            this.towerTopCap.position.setY(this.towerTopCapMountHeight)
            this.add(this.towerTopCap)
        }
        
        if(this.towerBase.length > 0){
            let baseHeight = this.towerBase.dimHeight
            let baseMountHeight = 0 - baseHeight;
            this.towerBase.position.setY(baseMountHeight)
            this.add(this.towerBase)
        }
      
    

    }


}

export default Tower25G;