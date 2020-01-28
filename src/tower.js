import Mpn25g from "./mpn25g.js";
import Mpn25ag5 from "./mpn25ag5.js";
import Mpn25ag4 from "./mpn25ag4.js";
import Mpn25ag3 from "./mpn25ag3.js";
import MpnSb25g5 from "./mpnsb25g5.js";
import Mpn25gssb from "./mpn25gssb.js";
import MpnSbh25g from "./mpnsbh25g.js";
import * as THREE from "three";

class Tower25G {
    renderCanRun = false;
    towerModel;
    towerHeight;
    towerParts = {}
    towerTopCapMountHeight;
    useSectionAsBase = false;
    sectionsHeight = 0.00;
    object3DTower;

    constructor() {
        this.object3DTower = new THREE.Group();
        this.towerModel = "25G"
        this.name = this.towerModel + " Tower";
        this.towerParts.towerSection = new Mpn25g();
        const base25GSSB = "25GSSB";
        const baseSB25G5 = "SB25G5";
        const baseSBH25G = "SBH25G";


        this.towerParts.towerBases = [{
                name: baseSBH25G,
                part: new MpnSbh25g()
            },
            {
                name: base25GSSB,
                part: new Mpn25gssb()
            },
            {
                name: baseSB25G5,
                part: new MpnSb25g5()
            }
        ];

        const top25AG = "25AG";
        const top25AG1 = "25AG1";
        const top25AG2 = "25AG2";
        const top25AG3 = "25AG3";
        const top25AG4 = "25AG4";
        const top25AG5 = "25AG5";
        this.towerParts.towerTopCaps = [

            {
                name: top25AG3,
                part: new Mpn25ag3()
            },
            {
                name: top25AG4,
                part: new Mpn25ag4()
            },
            {
                name: top25AG5,
                part: new Mpn25ag5()
            }
        ]
        
       this.reset();
    }
    reset = () => {
        this.setTowerBase("SB25G5");
        this.setTowerTopCap("25AG3");
        this.towerParts.towerSections = new THREE.Group();
        this.towerParts.towerSections.name = "Sections"
        this.towerParts.towerTopCap = new THREE.Object3D();
    }
    get3DTowerObject = () => {

        return this.object3DTower.clone()
    }
    getPart = (name, clone = true) => {

        for (let index in this.towerParts.towerBases) {
            if(this.towerParts.towerBases[parseInt(index)].name === name){
               if(clone){
                    return this.towerParts.towerBases[parseInt(index)].part.clone();
               }else{
                    return this.towerParts.towerBases[parseInt(index)].part
               }
                
            }
        }

        for (let indexTop in this.towerParts.towerTopCaps) {

            if(this.towerParts.towerTopCaps[parseInt(indexTop)].name === name){
                if(clone){
                    return this.towerParts.towerTopCaps[parseInt(indexTop)].part.clone();
                   }else{
                    return this.towerParts.towerTopCaps[parseInt(indexTop)].part
                   }
            }
        }

        throw "Error, could not find part named " + name;
    }
    createTower = () => {
      
        this.object3DTower = new THRRE.Group()
        
        let baseHeight = this.towerParts.towerBase.getHeight() - 12;

        if (this.towerParts.towerSections.children.length > 0) {

            this.object3DTower.add(this.towerParts.towerSections)
        }
        if (this.towerParts.towerTopCap.children.length > 0) {
            if (this.towerParts.towerSections.children.length === 0) {
                this.towerParts.towerTopCap.position.setY(this.sectionsHeight)
            } else {
                this.sectionsHeight = this.towerTopCapMountHeight;
                this.towerParts.towerTopCap.position.setY(this.sectionsHeight)
            }
            this.towerParts.towerTopCap.position.setX(0.24)
            this.towerParts.towerTopCap.position.setZ(0.367)
            this.towerParts.towerTopCap.position.setY(this.towerParts.towerTopCap.position.y - 2.122)
            this.object3DTower.add(this.towerParts.towerTopCap)
        }

        if (this.towerParts.towerBase.children.length > 0) {
            this.towerParts.towerBase.position.setY(-(baseHeight))
            this.object3DTower.add(this.towerParts.towerBase)
        }


    }
    setTowerBase = (mpn) => {
        this.towerParts.towerBase = this.getPart(mpn);
    }
    setTowerTopCap = (mpn) => {
        this.towerParts.towerTopCap = this.getPart(mpn)
    }
    setTowerHeight = (height) => {
        this.reset();
        this.towerParts.towerSections = new THREE.Group;
        this.useSectionAsBase = false;
       
        this.towerHeight = parseInt(height);
        this.sectionsHeight = 0.0
        
        let numberOfSections = parseInt((this.towerHeight / 10) - 1);
        if ((this.towerHeight.toString()[1] === "5")) {
            this.useSectionAsBase = true;
         
            this.towerParts.towerBase = new THREE.Object3D();

        }

        let nextMountHeight = -6;
        if (this.useSectionAsBase) {
            nextMountHeight = -5
        }

        let addHeight = this.towerParts.towerSection.getHeight() - 2.25;
    
        for (let i = 0; i < numberOfSections; i++) {
            const newSection = this.towerParts.towerSection.clone();
            newSection.position.setY(nextMountHeight);
            nextMountHeight += (addHeight);

            this.towerParts.towerSections.add(newSection);
        }
        this.towerTopCapMountHeight = nextMountHeight;
    }

}

export default Tower25G;