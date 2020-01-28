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
    renderCanRun = false;
    towerModel;
    towerHeight;
    towerParts = {}
    towerTopCapMountHeight;
    useSectionAsBase = false;
    sectionsHeight = 0.00;

    constructor() {
        super()
      
        this.towerModel = "25G"
        this.name = this.towerModel + " Tower";
        this.towerParts.towerMaterial = new Materials().ShinnyChrome;
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
        console.log(this)
       this.reset();
    }
    reset = () => {

        this.towerParts.towerBase = this.towerParts.towerBases[0].part
        this.towerParts.towerSections = new THREE.Group();
        this.towerParts.towerSections.name = "Sections"
        this.towerParts.towerSections.add(this.towerParts.towerSection.clone())
        this.towerParts.towerTopCap = this.towerParts.towerTopCaps[2].part
        

    }
  

}

export default Tower25G;