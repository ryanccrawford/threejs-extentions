import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Mpn25g from "./mpn25g.js";
import Mpn25ag5 from "./mpn25ag5.js";
import Mpn25ag4 from "./mpn25ag4.js";
import MpnSb25g5 from "./mpnsb25g5.js";
import Mpn25gssb from "./mpn25gssb.js";
import MpnSbh25g from "./mpnsbh25g.js";
import { PartOptions } from "./partbase.js";
import * as THREE from "three";
import Materials from "./materials.js";

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
    parentRef;
    sectionsHeight = 0.00;
    towerBases;
    towerTopCaps;
    towerMaterial;

    constructor() {
        super()
        this.towerModel = "25G"
        this.name = this.towerModel + " Tower";
        this.towerMaterial = new Materials().ShinnyChrome;
        this.towerSections = new THREE.Group();
        this.towerSections.name = "Sections"
        
        const base25GSSB = "25GSSB";
        const baseSB25G5 = "SB25G5";
        const baseSBH25G = "SBH25G";
        
        
        this.towerBases = [
            {
                name: baseSBH25G,
                part: new MpnSbh25g(new PartOptions().material = this.towerMaterial)
            },
            {
                name: base25GSSB,
                part: new Mpn25gssb(new PartOptions().material = this.towerMaterial)
            },
            {
                name: baseSB25G5,
                part: new MpnSb25g5(new PartOptions().material = this.towerMaterial)
            }]
        const top25AG = "25AG";
        const top25AG1 = "25AG1";
        const top25AG2 = "25AG2";
        const top25AG3 = "25AG3";
        const top25AG4 = "25AG4";
        const top25AG5 = "25AG5";
        this.towerTopCaps = [
            // {
            //     name: top25AG,
            //     part: new Mpn25ag(new PartOptions().material = this.towerMaterial)
            // },
            // {
            //     name: top25AG1,
            //     part: new Mpn25ag1(new PartOptions().material = this.towerMaterial)
            // },
            // {
            //     name: top25AG2,
            //     part: new Mpn25ag2(new PartOptions().material = this.towerMaterial)
            // },
            // {
            //     name: top25AG3,
            //     part: new Mpn25ag3(new PartOptions().material = this.towerMaterial)
            // },
            {
                name: top25AG4,
                part: new Mpn25ag4(new PartOptions().material = this.towerMaterial)
            },
            {
                name: top25AG5,
                part: new Mpn25ag5(new PartOptions().material = this.towerMaterial)
            }
        ]
        console.log(this)
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
        this.towerTopCap = this.parentRef.topCapPart.staticClone();
        this.towerTopCap.name = "Top Cap";
        this.changeBase("SB25G5");
        
        this.towerSection = this.parentRef.sectionPart.staticClone();

        document.getElementById('test').onchange = this.onNumberChange;
        document.getElementById('test2').onchange = this.onNumberChange;
        document.getElementById('test3').onchange = this.onNumberChange;

    }
    addOrbitcontrols = (config = new OrbitConfig()) => {


    }
    onNumberChange = (event) => {
        event.preventDefault()
        let axis = "";
        switch (event.target.id) {
            case "test":
                axis = "y";
                break;
            case "test2":
                axis = "x";
                break;
            case "test3":
                axis = "z";
                break;
            default:
                return;
        }
        this.adjustSectionsGroupPos(event.target.id, axis, this.parentRef.scene.getObjectByName("SB25G5"))

    }

    adjustSectionsGroupPos = (elementId, axis, objectToMove) => {


        console.log(elementId)
        const element = document.getElementById(elementId);
        console.log(element)
        let currentInputValue = parseFloat(element.value);
        let varName = axis;
        //const sceneChilderen = objectToMove //this.parentRef.scene.children[5]
        console.log(objectToMove)
        if (objectToMove) {

            switch (axis) {
                case "y":
                    objectToMove.position.y = currentInputValue;
                    document.getElementById('currentData').textContent = ("Current y:" + objectToMove.position.y)
                    break;
                case "x":
                    objectToMove.position.x = currentInputValue;
                    document.getElementById('currentData2').textContent = ("Current x:" + objectToMove.position.x)
                    break;
                case "z":
                    objectToMove.position.z = currentInputValue;
                    document.getElementById('currentData3').textContent = ("Current z:" + objectToMove.position.z)
                    break;

            }


        }




    }
    changeHeight = (height, section) => {
        this.useSectionAsBase = false;
        this.towerHeight = parseInt(height);
        this.sectionsHeight = 0.0
        console.log(this.towerHeight)
        let numberOfSections = parseInt((this.towerHeight / 10) - 1);
        if ((this.towerHeight.toString()[1] === 5)) {
            this.useSectionAsBase = true;
            this.towerBase = null;

        }

        console.log(this.towerSections)

        const newGroup = new THREE.Group();
        newGroup.position.setX(-2.62)
        newGroup.position.setY(0.64)
        newGroup.position.setZ(17.99)

        newGroup.name = "Sections";
        let nextMountHeight = -6;
        if (this.useSectionAsBase) {
            nextMountHeight = -5
        }

        let addHeight = section.getHeight() - 2.25;
        for (let i = 0; i < numberOfSections; i++) {
            const newSection = section.staticClone();
            newSection.position.setY(nextMountHeight);
            nextMountHeight += (addHeight);
            newGroup.add(newSection)
        }
        this.towerTopCapMountHeight = nextMountHeight;
        this.towerSections = newGroup;

    }

    

    changeBase = (base) => {
        if(!base){
            return;
        }
       
        if(typeof this.towerBase !== 'undefined'){
            this.remove(this.towerBase)
        }
        
        this.towerBase = null;
        this.towerBase = this.towerBases.filter((theBase) => {
                        if(theBase.name === base){
                            return theBase.part;
                        }
                    })
        this.towerBase.name = "Base"
        this.add(this.towerBase)
        


        // if (!this.useSectionAsBase) {

        //     this.towerBase = base;

        // } else if (this.useSectionAsBase) {
        //     this.towerBase = null;
        // }

        this.towerBuild();

    }

    changeTopCap = (topCap) => {
        this.towerTopCap = topCap;


    }

    towerBuild = () => {

        let baseHeight = this.towerBase.getHeight() - 12;

        if (this.towerSections.children.length > 0) {

            this.add(this.towerSections)
        }
        if (this.towerTopCap.children.length > 0) {
            if (this.towerSections.children.length === 0) {
                this.towerTopCap.position.setY(this.sectionsHeight)
            } else {
                this.sectionsHeight = this.towerTopCapMountHeight;
                this.towerTopCap.position.setY(this.sectionsHeight)
            }
            this.towerTopCap.position.setX(0.24)
            this.towerTopCap.position.setZ(0.367)
            this.towerTopCap.position.setY(this.towerTopCap.position.y - 2.122)
            this.add(this.towerTopCap)
        }

        if (this.towerBase.children.length > 0) {
            this.towerBase.position.setY(-(baseHeight))
            this.add(this.towerBase)
        }

        // this.translate(0,0,0);
        // this.position.copy(new THREE.Vector3(0, 0, 0.0));
        // const box = new THREE.Box3().setFromObject( this );
        //   box.getCenter( this.parentRef.getObjectByName("Pad") ); // this re-sets the obj position


    }


}

export default Tower25G;