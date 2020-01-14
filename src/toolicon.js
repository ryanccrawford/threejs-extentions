import * as THREE from "three";
import components from "./components.js";

class ToolIcon {
    elementId;
    order;
    iconMesh;
    iconImage;
    iconHoverImage;
    components;
    element = null;
    text;
    name;
    active;

    constructor( buttonId, image, hoverImage, text, name, onClick, order = 0, mesh = null, active = false){
        this.components = new components()
        this.elementId = buttonId;
        this.onClick = onClick;
        this.text = text;
        this.name = name;
        this.order = order;
        this.active = active;
    }

    getElement = () => {
        if(this.element === null){
           this.element = this.buildElement();
        }
        console.log(this.element);
        return this.element;
    }

    buildElement = () => {
        
        const label = document.createElement("label");
        const input = document.createElement("input");
        label.classList = "btn btn-primary" ;
        input.setAttribute("type", "radio");
        input.name = this.name;
        input.id = this.elementId;
        label.textContent = this.text;
        if(this.active){
            input.checked = true;
            label.classList += " active";
        }else{
            input.checked = false;
        }
        label.appendChild(input);
        return label;
    }

}

export default ToolIcon;