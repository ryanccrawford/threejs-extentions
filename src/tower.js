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
    parentRef;
    sectionsHeight = 0.00;

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
        this.towerTopCap = this.parentRef.topCapPart.staticClone();
        this.towerTopCap.name = "Top Cap";
        this.towerBase = this.parentRef.basePart.staticClone()
        this.towerBase.name = "Base"
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
        switch (event.target.id){
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
        this.adjustSectionsGroupPos(event.target.id, axis, this.parentRef.scene.getObjectByName("Pad"))

    }

    adjustSectionsGroupPos = (elementId, axis, objectToMove) => {


        console.log(elementId)
        const element = document.getElementById(elementId);
        console.log(element)
        let currentInputValue = parseFloat(element.value);
        let varName = axis;
        //const sceneChilderen = objectToMove //this.parentRef.scene.children[5]
        console.log(objectToMove)
        if(objectToMove){
           
            switch(axis){
                case "y":
                    objectToMove.position.y = currentInputValue;
                    document.getElementById('currentData').textContent = ("Current y:" +  objectToMove.position.y)
                    break;
                    case "x":
                        objectToMove.position.x = currentInputValue;
                        document.getElementById('currentData2').textContent = ("Current x:" +  objectToMove.position.x)
                        break;
                        case "z":
                            objectToMove.position.z = currentInputValue;
                            document.getElementById('currentData3').textContent = ("Current z:" +  objectToMove.position.z)
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
        let nextMountHeight = 0;
        if(this.useSectionAsBase){
            nextMountHeight = -5
        }
       
        let addHeight = section.getHeight();
        for (let i = 0; i < numberOfSections; i++) {
            const newSection = section.staticClone();
            newSection.position.setY(nextMountHeight);
            nextMountHeight += (addHeight - 2.25);
            newGroup.add(newSection)
        }
        this.towerTopCapMountHeight = nextMountHeight;
        this.towerSections = newGroup;
        
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
      
        let baseHeight = this.towerBase.getHeight();
  
        if (this.towerSections.children.length > 0) {
           
            this.add(this.towerSections)
        }
        if (this.towerTopCap.children.length > 0) {
            if(this.towerSections.children.length === 0){
                this.towerTopCap.position.setY( this.sectionsHeight )
            }else{
                this.sectionsHeight =   this.towerTopCapMountHeight;
                this.towerTopCap.position.setY( this.sectionsHeight )
            }
            this.towerTopCap.position.setX( 0.24 )
            this.towerTopCap.position.setZ( 0.367 )
            this.towerTopCap.position.setY(  this.towerTopCap.position.y - 2.122 )
            this.add(this.towerTopCap)
        }

        if (this.towerBase.children.length > 0) {
            this.towerBase.position.setY(-(baseHeight - 4))
            this.add(this.towerBase)
        }
        
       

    }


}

export default Tower25G;