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

function makeSelectBox(id, name, label, options, onSelectionEvent){
    const Components = new components();
    const selectBox = Components.selectBox(id, name, label, options, onSelectionEvent)


}

const onStart = event => {
    event.preventDefault();
    const itemSelected = event.target.itemSelected;
    console.log(itemSelected.name);
}
const onToolButtonClick = (event) => {
    event.preventDefault();
    const buttonClicked = event.target;
    console.log(buttonClicked.name);
}

var seiresSelectBox,seiresOptions;

const database = new APIData();

const onDataRetured = data => {
    console.log(data)
    let items = {text: "25G", id: "0"} 
    seiresSelectBox = makeSelectBox("seires", "seires", "Select Tower Seires", items, onStart);
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
 let sideItems = [newMouseDisplay,bar];
    const main = buildMain(sideItems, renderArea())

bottom.appendChild(main)
pageBody.appendChild(top);
pageBody.appendChild(bottom)

document.body.appendChild(pageBody);

const theWidth = renderarea.lientWidth - 20;
const theHeight = window.screen.availHeight - (0.30 * window.screen.availHeight);
const Thebuilder = new thebuilder(theHeight, theWidth, "renderarea");
Thebuilder.attach();