import * as THREE from "three";
import components from "./components.js";

class ToolBar {
    elementId;
    location;
    toolIcons;
    element = null;
    components;

    constructor(iconButtons = []){
        this.components = new components();
        this.toolIcons = iconButtons;
    }

    getElement = () => {
        if(this.element === null){
            this.element = this.buildToolBar()
        }
        return this.element;
    }

    buildToolBar = () => {
        const toolBar = this.components.buttonToggleGroup(this.toolIcons,"primary")
        return toolBar;
    }
}

export default ToolBar;