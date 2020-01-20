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
    towerBase;
    towerSections;
    towerType;
    towerAccessories;
    towerSection;
    towerTopCapMountHeight;
    useSectionAsBase = false;
    parentRef

    constructor() {
        super()
        this.towerModel = "25G"
        this.name = this.towerModel + " Tower";
        this.towerSections = new THREE.Group();
        this.towerSections.name = "Sections"
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
    setParent = (parent) => {
        console.log(parent)
        this.parentRef = parent
        this.towerTopCap = this.parentRef.topCapPart
        this.towerTopCap.name = "Top Cap";
        this.towerBase = this.parentRef.basePart
        this.towerBase.name = "Base"
        this.towerSection = this.parentRef.sectionPart;

    }
    addOrbitcontrols = (config = new OrbitConfig()) => {


    }
    changeHeight = (height) => {
        this.useSectionAsBase = false;
        this.towerHeight = parseInt(height);
        console.log(this.towerHeight)
        let numberOfSections = parseInt((this.towerHeight / 10) - 1);
        if ((this.towerHeight.toString()[1] === 5)) {
            this.useSectionAsBase = true;
            this.towerBase = null;
        }
        console.log(this.towerSections)
        if (typeof this.towerSections !== 'undefined' && this.towerSections.children.length === numberOfSections) {
            this.towerBuild()
            return;
        }
        const newGroup = new THREE.Group();
        newGroup.name = "Sections";
        let nextMountHeight = 0;
        let addHeight = 120;
        console.log(this)
        for (let i = 0; i < numberOfSections; i++) {
            const newSection = this.towerSection.staticClone();
            newSection.position.setY(nextMountHeight);
            nextMountHeight += addHeight;
            newGroup.add(newSection)
        }
        this.towerTopCapMountHeight = nextMountHeight;
        this.towerSections = newGroup;


        console.log(this.towerSections)
    }

    changeBase = (base) => {

        if (!this.useSectionAsBase) {
            this.towerBase = base;

        } else if (this.useSectionAsBase) {
            this.towerBase = null;
        }

    }

    changeTopCap = (topCap) => {
        this.towerTopCap = topCap;


    }

    towerBuild = () => {

        //this.children.length = 0;
        if (this.towerSections.children.length > 0) {
            this.add(this.towerSections)
        }
        if (this.towerTopCap.children.length > 0) {
            this.towerTopCap.position.setY(this.towerTopCapMountHeight)
            this.add(this.towerTopCap)
        }

        if (this.towerBase.children.length > 0) {
            let baseHeight = this.towerBase.dimHeight
            let baseMountHeight = 0 - baseHeight;
            this.towerBase.position.setY(baseMountHeight)
            this.add(this.towerBase)
        }

        //this.parentRef.scene.add(this)

    }


}

export default Tower25G;