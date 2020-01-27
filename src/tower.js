import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Mpn25g from "./mpn25g.js";
import Mpn25ag5 from "./mpn25ag5.js";
import Mpn25ag4 from "./mpn25ag4.js";
import Mpn25ag3 from "./mpn25ag3.js";
import MpnSb25g5 from "./mpnsb25g5.js";
import Mpn25gssb from "./mpn25gssb.js";
import MpnSbh25g from "./mpnsbh25g.js";
import { PartOptions } from "./partbase.js";
import * as THREE from "three";
import Materials from "./materials.js";


class Tower25G extends THREE.Group {

    towerModel;
    towerHeight;
    towerParts = {
        towerTopCap: null,
        towerBase: null,
        towerSections: null,
        towerType: null,
        towerAccessories: null,
        towerSection: null,
        towerBases: null,
        towerTopCaps: null,
        towerMaterial: null,
    }
    towerTopCapMountHeight;
    useSectionAsBase = false;
    sectionsHeight = 0.00;


    constructor() {
        super()
        this.towerModel = "25G"
        this.name = this.towerModel + " Tower";
        this.towerParts.towerMaterial = new Materials().ShinnyChrome;
        this.towerParts.towerSections = new THREE.Group();
        this.towerParts.towerSections.name = "Sections"
        this.towerParts.towerSection = new Mpn25g(
            (new PartOptions().material = this.towerParts.towerMaterial)
        );
        const base25GSSB = "25GSSB";
        const baseSB25G5 = "SB25G5";
        const baseSBH25G = "SBH25G";


        this.towerParts.towerBases = [{
                name: baseSBH25G,
                part: new MpnSbh25g(
                    (new PartOptions().material = this.towerParts.towerMaterial)
                )
            },
            {
                name: base25GSSB,
                part: new Mpn25gssb(
                    (new PartOptions().material = this.towerParts.towerMaterial)
                )
            },
            {
                name: baseSB25G5,
                part: new MpnSb25g5(
                    (new PartOptions().material = this.towerParts.towerMaterial)
                )
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
                part: new Mpn25ag3(new PartOptions().material = this.towerParts.towerMaterial)
            },
            {
                name: top25AG4,
                part: new Mpn25ag4(new PartOptions().material = this.towerParts.towerMaterial)
            },
            {
                name: top25AG5,
                part: new Mpn25ag5(new PartOptions().material = this.towerParts.towerMaterial)
            }
        ]
        console.log(this)
        this.towerParts.towerBase = this.towerParts.towerBases[2].part
        this.towerParts.towerTopCap = this.towerParts.towerTopCaps[2].part

    }
    setTowerHeight = (height) => {
        this.useSectionAsBase = false;
        this.towerHeight = parseInt(height);
        this.sectionsHeight = 0.0
        console.log(this.towerHeight)
        let numberOfSections = parseInt((this.towerHeight / 10) - 1);
        if ((this.towerHeight.toString()[1] === 5)) {
            this.useSectionAsBase = true;
            this.towerParts.towerBase = null;

        }

        console.log(this.towerParts.towerSections)

        // const newGroup = new THREE.Group();
        // newGroup.position.setX(-2.62)
        // newGroup.position.setY(0.64)
        // newGroup.position.setZ(17.99)

        // newGroup.name = "Sections";
        let nextMountHeight = -6;
        if (this.useSectionAsBase) {
            nextMountHeight = -5
        }

        this.towerParts.towerSections.children.splice(0)
        let addHeight = this.towerParts.towerSection.getHeight() - 2.25;
        for (let i = 0; i < numberOfSections; i++) {
            const newSection = this.towerParts.towerSection.staticClone();
            newSection.position.setY(nextMountHeight);
            nextMountHeight += (addHeight);

            this.towerParts.towerSections.add(newSection);
        }
        this.towerTopCapMountHeight = nextMountHeight;



    }




    createTower = (baseType = "SB25G5", topCapType = "25AG3", numberOfSections = 1) => {



        let baseHeight = this.towerParts.towerBase.getHeight() - 12;

        if (this.towerParts.towerSections.children.length > 0) {

            this.add(this.towerParts.towerSections)
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
            this.add(this.towerParts.towerTopCap)
        }

        if (this.towerParts.towerBase.children.length > 0) {
            this.towerParts.towerBase.position.setY(-(baseHeight))
            this.add(this.towerParts.towerBase)
        }
        return this
            // this.translate(0,0,0);
            // this.position.copy(new THREE.Vector3(0, 0, 0.0));
            // const box = new THREE.Box3().setFromObject( this );
            //   box.getCenter( this.parentRef.getObjectByName("Pad") ); // this re-sets the obj position


    }


}

export default Tower25G;