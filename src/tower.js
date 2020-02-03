import Mpn25g from "./mpn25g.js";
import Mpn25ag5 from "./mpn25ag5.js";
import Mpn25ag4 from "./mpn25ag4.js";
import Mpn25ag3 from "./mpn25ag3.js";
import MpnSb25g5 from "./mpnsb25g5.js";
import Mpn25gssb from "./mpn25gssb.js";
import MpnSbh25g from "./mpnsbh25g.js";
import * as THREE from "three";
import Pad from "./pad.js";

class Tower25G {
    renderCanRun = false;
    towerModel;
    towerHeight;
    towerParts = {}
    currentBasePartname = "SB25G5";
    currentTopPartName = "25AG3";
    currentSectionPartName = "25G";
    towerTopCapMountHeight;
    useSectionAsBase = false;
    sectionsHeight = 0.00;
    object3DTower;
    padHeight = 8;
    constructor() {
        this.object3DTower = new THREE.Group();
        this.towerModel = "25G"
        this.name = this.towerModel + " Tower";

        const base25GSSB = "25GSSB";
        const baseSB25G5 = "SB25G5";
        const baseSBH25G = "SBH25G";

        const section25G = "25G"
        this.towerParts.towerSection = [{
            name: section25G,
            part: new Mpn25g()
        }]
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

        this.towerHeight = 10;
        this.reset();
    }
    reset = () => {
        this.object3DTower = new THREE.Group()
        this.setTowerBase(this.currentBasePartname);
        this.setTowerTopCap(this.currentTopPartName);
        this.towerParts.towerSections = new THREE.Group();
        this.towerParts.towerSections.name = "Sections"
    }
    get3DTowerObject = () => {

        return this.object3DTower.clone()
    }
    getPart = (name, clone = true) => {

        for (let index in this.towerParts.towerBases) {
            if (this.towerParts.towerBases[parseInt(index)].name === name) {
                if (clone) {
                    return this.towerParts.towerBases[parseInt(index)].part.clone();
                } else {
                    return this.towerParts.towerBases[parseInt(index)].part
                }

            }
        }

        for (let indexTop in this.towerParts.towerTopCaps) {

            if (this.towerParts.towerTopCaps[parseInt(indexTop)].name === name) {
                if (clone) {
                    return this.towerParts.towerTopCaps[parseInt(indexTop)].part.clone();
                } else {
                    return this.towerParts.towerTopCaps[parseInt(indexTop)].part
                }
            }
        }

        for (let indexSection in this.towerParts.towerSection) {
            if (
                this.towerParts.towerSection[parseInt(indexSection)].name === name
            ) {
                if (clone) {
                    return this.towerParts.towerSection[
                        parseInt(indexSection)
                    ].part.clone();
                } else {
                    return this.towerParts.towerSection[parseInt(indexSection)].part;
                }
            }
        }

        throw "Error, could not find part named " + name;
    }
    createTower = () => {

        this.object3DTower = new THREE.Group()

        let baseHeight = this.towerParts.towerBase.getHeight();

        let sectionOffSet = 0;

        if (this.towerParts.towerBase.children.length > 0) {
            if (this.towerParts.towerBase.name.includes("SS")) {
                this.towerParts.towerBase.position.setY(6.5)
                this.towerParts.towerBase.position.setX(-3)
                this.towerParts.towerBase.position.setZ(4 - 0.25);
            } else if (this.towerParts.towerBase.name.includes("SBH")) {
                this.towerParts.towerBase.position.setX(-0.75)
                this.towerParts.towerBase.position.setY(-baseHeight + 16.250);
                sectionOffSet += 10.25 - 4;
            } else {
                this.towerParts.towerBase.position.setY(-baseHeight + 12);
            }

            this.object3DTower.add(this.towerParts.towerBase)
        }
        sectionOffSet += this.towerParts.towerSections.position.y;
        if (this.towerParts.towerSections.children.length > 0) {
            sectionOffSet += this.towerParts.towerSections.position.y;
            this.towerParts.towerSections.position.setY(sectionOffSet);
            this.object3DTower.add(this.towerParts.towerSections);
        }
        if (this.towerParts.towerTopCap.children.length > 0) {
            if (this.towerParts.towerSections.children.length === 0) {
                this.towerParts.towerTopCap.position.setY(
                    this.towerTopCapMountHeight + this.sectionsHeight + sectionOffSet
                );
            } else {
                this.towerParts.towerTopCap.position.setY(
                    (this.towerTopCapMountHeight + sectionOffSet)
                );
            }

            this.object3DTower.add(this.towerParts.towerTopCap);
        }


    }
    setTowerBase = (mpn) => {
        this.towerParts.towerBase = this.getPart(mpn);
        this.currentBasePartname = mpn
    }
    setTowerTopCap = (mpn) => {
        this.towerParts.towerTopCap = this.getPart(mpn)
        this.currentTopPartName = mpn
    }
    setTowerHeight = (height) => {
        this.towerHeight = parseInt(height);
        this.towerParts.towerSections = new THREE.Group();
        this.useSectionAsBase = false;


        this.sectionsHeight = 0.0

        let numberOfSections = parseInt((this.towerHeight / 10) - 1);
        if ((this.towerHeight.toString()[1] === "5")) {
            this.useSectionAsBase = true;



        }

        let nextMountHeight = this.padHeight;
        if (this.useSectionAsBase) {
            nextMountHeight = -5
        }


        for (let i = 0; i < numberOfSections; i++) {
            const newSection = this.getPart("25G")
            newSection.position.setY(nextMountHeight);
            let addHeight = newSection.getHeight() - 1.75;
            console.log("section height");
            console.log(addHeight);
            nextMountHeight += (addHeight - 1.75);
            console.log("next section height");
            console.log(nextMountHeight);

            this.towerParts.towerSections.add(newSection);
        }
        this.towerTopCapMountHeight = nextMountHeight;
    }

}

export default Tower25G;