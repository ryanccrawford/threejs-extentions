import _ from "lodash";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import "bootstrap";
import Axios from "axios"
import APIData from "./databaseinterface.js";
import components from "./components.js";
import thebuilder from "./threedbuilder.js";
import ToolIcon from "./toolicon.js";
import ToolBar from "./toolbar.js";
import Tower25G from "./tower.js";
import * as THREE from "three";



var tower;
var mode = "development";
window.builderSelectedItem = new THREE.Object3D();
const Thebuilder = new thebuilder();
window.Thebuilder = Thebuilder;

function pageContainer() {
    const Components = new components();
    return Components.fluidContainer();
}

function topContainer() {
    const Components = new components();
    return Components.fluidContainer();
}

function titleBar() {
    const Components = new components();
    const jumbo = Components.appBar();
    // const text = Components.display4('3 Star - 3D Tower Builder');
    // jumbo.appendChild(text);
    // return jumbo;
    return jumbo;
}

function bottomContainer() {
    const Components = new components();
    return Components.fluidContainer();
}

function renderArea() {
    const renderArea = new components().div();
    renderArea.setAttribute("id", "renderarea");
    renderArea.style.textAlign = "center";
    return renderArea
}

function bottomNavStick() {
    /* <footer class="footer mt-auto py-3">
      <div class="container">
        <span class="text-muted">Place sticky footer content here.</span>
      </div>
    </footer> */


    const Components = new components();
    const footer = Components.c("footer");
    const div = Com
    const span = Components.c("span");


}

function buildMain(sideBarItems, renderArea) {
    tower = new Tower25G();
    const layoutRow = new components().row();
    const layoutPartsListLeftSide = new components().col(2);
    layoutPartsListLeftSide.id = "toolBars"
    sideBarItems.forEach((item) => {
        layoutPartsListLeftSide.appendChild(item);
    })


    const layoutViewAreaRightSide = new components().col(10);
    layoutViewAreaRightSide.appendChild(renderArea);

    layoutRow.appendChild(layoutPartsListLeftSide);
    layoutRow.appendChild(layoutViewAreaRightSide);

    return layoutRow;
}

function makeRadioButton(id, name, text, image, imagehover, onclick, checked = false, active = false) {
    const toolicon = new ToolIcon(id, null, null, text, name, onclick, 0, null, active);
    console.log(toolicon)
    const el = toolicon.getElement();
    //el.checked = checked
    return el;
}

function makeToolBar(buttonIcons) {
    const toolbar = new ToolBar(buttonIcons);
    return toolbar.getElement();
}

function makeSelectBox(id, name, label, onSelectionEvent) {
    const Components = new components();
    return Components.selectBox(id, name, label, onSelectionEvent)
}

function makeSliderBar(id, name, labelText, min = 10, max = 100, snapTo = 10, list, onChangeEventSent) {
    const Components = new components();
    const range = Components.c("input")
    const label = Components.c("label")
    const lableValue = Components.c("div")
    const div = Components.c("div")
    div.className = "form-group"
    label.innerText = labelText
    label.for = "labelText"
    range.type = "range"
    range.className = ".custom-range"
    range.id = id
    range.name = name
    range.min = min
    range.max = max
    range.step = snapTo
    lableValue.innerText = "Cuerrent: " + range.value;
    lableValue.id = id + "_display"
    const ticks = Components.c("datalist");
    ticks.id = "ticks_" + range.id
    range.setAttribute("list", ticks.id)
    for (let i = 0; i < (list.length); i++) {

        const opt = Components.c("option")
        opt.value = parseInt(list[i]);
        opt.setAttribute("label", list[i]);
        ticks.appendChild(opt)
    }
    range.setAttribute("oninput", "window.Thebuilder." + onChangeEventSent + "(this)");
    div.appendChild(label)
    range.setAttribute("valueAsNumber", 10);
    div.appendChild(range)
    div.appendChild(ticks)
    div.appendChild(lableValue)

    return div;
}



const showHeightSelection = (box) => {
    const Components = new components();
    const p = Components.c("p")
    p.appendChild(box);
    let html = p.innerHTML

    const card = Components.card(html, "Height")

    document.getElementById("toolBars").appendChild(card)
    document.getElementById("height").oninput(document.getElementById("height"))
}

const getHeightOption = () => {
    let dataHeights = [10, 20, 30, 40];
    return dataHeights
}

const onStart = event => {

    const itemSelected = event.target.selectedOptions[event.target.selectedIndex];

    if (!document.getElementById('height')) {
        const heightOptions = getHeightOption()

        let minHeight = Math.min(...heightOptions)
        let maxHeight = Math.max(...heightOptions)

        let label = "Select Tower Height"

        const heightSelectBox = makeSliderBar("height", "height", label, minHeight, maxHeight, 10, heightOptions, "onHeightSelect")
        
        showHeightSelection(heightSelectBox);

    }
}


const onToolButtonClick = (event) => {
    event.preventDefault();
    const buttonClicked = event.target;
    console.log(buttonClicked.name);
}
const towerSelect = makeTowerSelect()
var seiresSelectBox, seiresOptions = [];
const database = new APIData();

function makeTowerSelect() {
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
    seiresOptions.push({ name: "25G Self-Supporting Tower", id: 1, isSelected: false })
    let label = "Select Tower Seires"
    seiresSelectBox = makeSelectBox("seires", "seires", label, onStart);
    seiresOptions.push({ name: label, id: 0, isSelected: true });
    for (let i = 0; i < seiresOptions.length; i++) {
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

// const rotateButton = makeRadioButton("rotate", "rotate", "Rotate", '', '', onToolButtonClick, true, true);
// const panButton = makeRadioButton("pan", "pan", "Pan", '', '', onToolButtonClick, true, true);
// const selectButton = makeRadioButton("select", "select", "Select", '', '', onToolButtonClick, true, true);
// const icons = [rotateButton, panButton, selectButton];
// const bar = makeToolBar(icons);

const pageBody = pageContainer();
const top = topContainer();
const bottom = bottomContainer();
const title = titleBar();
top.appendChild(title);

const newMouseDisplay = new components().mousePosition(0, 0, 0, "mouse");
newMouseDisplay.style.display = "none";
let sideItems = [newMouseDisplay, towerSelect];


const main = buildMain(sideItems, renderArea())

bottom.appendChild(main)
pageBody.appendChild(top);
pageBody.appendChild(bottom)

document.body.appendChild(pageBody);

const theWidth = renderarea.clientWidth;
const usedSpace = document.getElementById('nav').clientHeight + 150;
const theHeight = window.screen.availHeight - usedSpace;
Thebuilder.setHeight(theHeight)
Thebuilder.setWidth(theWidth)
Thebuilder.setRenderElementId("renderarea");
Thebuilder.start()

Thebuilder.attach(document);