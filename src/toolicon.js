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

    constructor( buttonId, image, hoverImage, text, name, onClick, order = 0, mesh = null, active = false ){
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
        
        const toggleButton = this.components.button(this.elementId, this.text, this.name, 'radio', "primary", this.onClick);
        toggleButton.setAttribute("active", this.active);
        console.log(toggleButton);
        return toggleButton;
    }

}

export default ToolIcon;