import _ from "lodash";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import "bootstrap";
import Axios from "axios"
import APIData from "./databaseinterface.js";
import printMe from "./print.js";
import components from "./components.js";
import thebuilder from "./threedbuilder.js";
import ToolIcon from "./toolicon.js";
import ToolBar from "./toolbar.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Mpn25g from "./mpn25g.js";
import Mpn25ag5 from "./mpn25ag5.js";
import MpnSb25g5 from "./mpnsb25g5.js"
import {PartOptions} from "./partbase.js";
class tower {

    model = "";
    height = 0;
    numberOfSections = 0;
    parts = [];
    topCap = null;
    base = null;
    type = "";
    asseccories = [];
    loader = null;
    sectionObj = null;
    topCapObj = null;
    baseObj = null;
    sectionClass = "";
    topCapClass ="";
    baseClass = "";

    constructor() {
        this.loader = new FBXLoader();

    }

    setModel = (model) => {
        let classesToLoad = [];
        switch (model) {
            case "25G":
                this.sectionClass = "Mpn25g" 
                
                this.sectionObj = new Mpn25g(new PartOptions());
                this.baseClass = "MpnSb25g5"
                this.baseObj = new MpnSb25g5(new PartOptions());
                this.topCapClass = "Mpn25ag5"
                this.topObj = new Mpn25ag5(new PartOptions());
                break;
        }


    }

  

    setHeight = (height) => {
        this.height = height;
        this.numberOfSections = parseInt((this.height / 10) - 1); 

    }

}

function pageContainer(){
    const Components = new components();
    return  Components.fluidContainer();
}
function topContainer() {
    const Components = new components();
    return Components.fluidContainer();
}
function titleBar(){
    const Components = new components();
    const jumbo = Components.jumbotron();
    const text = Components.display4('3 Star - 3D Tower Builder');
    jumbo.appendChild(text);
    return jumbo;
}
 function bottomContainer(){
    const Components = new components();
    return Components.fluidContainer();
 }
 function renderArea(){
    const renderArea = new components().div();
    renderArea.setAttribute("id", "renderarea");
    renderArea.style.textAlign = "center";
    return renderArea
 }
function buildMain(sideBarItems, renderArea){

    const layoutRow = new components().row();
    const layoutPartsListLeftSide = new components().col(2);
    sideBarItems.forEach((item) => {
        layoutPartsListLeftSide.appendChild(item);
    })


    const layoutViewAreaRightSide = new components().col(10);
    layoutViewAreaRightSide.appendChild(renderArea);

    layoutRow.appendChild(layoutPartsListLeftSide);
    layoutRow.appendChild(layoutViewAreaRightSide);

    return layoutRow;
}
function makeRadioButton(id,name,text,image,imagehover,onclick, checked = false, active = false){
    const toolicon = new ToolIcon(id,null,null,text,name,onclick,0,null, active);
    console.log(toolicon)
    const el = toolicon.getElement();
    //el.checked = checked
    return el;
}

function makeToolBar(buttonIcons){
    const toolbar = new ToolBar(buttonIcons);
    return toolbar.getElement();
}

function makeSelectBox(id, name, label, onSelectionEvent){
    const Components = new components();
    return Components.selectBox(id, name, label, onSelectionEvent) 
}

const thisTower = new tower();
const onStart = event => {
    event.preventDefault();
    const itemSelected = event.target.selectedOptions[event.target.selectedIndex];
    console.log(itemSelected.textContent);
    thisTower.setModel(itemSelected.textContent);

}
const onToolButtonClick = (event) => {
    event.preventDefault();
    const buttonClicked = event.target;
    console.log(buttonClicked.name);
}
const towerSelect = makeTowerSelect()
var seiresSelectBox, seiresOptions = [];
const database = new APIData();

function makeTowerSelect(){
    const Components = new components();
    const card = Components.card("", "Tower Selection", null)
    return card;
} 

const doneCreatingOptions = () => {
    towerSelect.getElementsByClassName("card-body")[0].appendChild(seiresSelectBox)
}
const onDataRetured = data => {
    //seiresOptions = data
    console.log(data)
     seiresOptions.push({name: "25G", id: 1, isSelected: false})
     let label = "Select Tower Seires"
    seiresSelectBox = makeSelectBox("seires", "seires", label, onStart);
    seiresOptions.push({name: label, id: 0, isSelected: true});
    for(let i = 0; i< seiresOptions.length; i++){
        const opt = document.createElement("option");
        const textNode = document.createTextNode(seiresOptions[i].name)
        opt.appendChild(textNode);
        opt.value = seiresOptions[i].id.toString()
        opt.selected = seiresOptions[i].isSelected;
        seiresSelectBox.appendChild(opt);
    }
    doneCreatingOptions();
   
}



database.getData("getSeiresOptions", onDataRetured, onDataRetured);

const rotateButton = makeRadioButton("rotate","rotate", "Rotate", '','', onToolButtonClick, true, true);
const panButton = makeRadioButton("pan","pan", "Pan", '','', onToolButtonClick, true, true);
const selectButton = makeRadioButton("select","select", "Select", '','', onToolButtonClick, true, true);
const icons = [rotateButton,panButton,selectButton];
const bar = makeToolBar(icons);

 const pageBody = pageContainer();
 const top = topContainer();
 const bottom = bottomContainer();
 const title = titleBar();
 top.appendChild(title);
 
 const newMouseDisplay = new components().mousePosition(0, 0, 0, "mouse");
 let sideItems = [newMouseDisplay,bar,towerSelect];
    const main = buildMain(sideItems, renderArea())

bottom.appendChild(main)
pageBody.appendChild(top);
pageBody.appendChild(bottom)

document.body.appendChild(pageBody);

const theWidth = renderarea.lientWidth - 20;
const theHeight = window.screen.availHeight - (0.30 * window.screen.availHeight);
const Thebuilder = new thebuilder(theHeight, theWidth, "renderarea");
Thebuilder.attach();

