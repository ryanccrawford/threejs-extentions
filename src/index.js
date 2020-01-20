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
var tower;

const Thebuilder = new thebuilder();

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
    const jumbo = Components.jumbotron();
    const text = Components.display4('3 Star - 3D Tower Builder');
    jumbo.appendChild(text);
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



const showHeightSelection = (box) => {
    towerSelect.getElementsByClassName("card-body")[0].appendChild(box)
}

const getHeightOption = () => {
    //TODO: Check to see which heights are avalible
    let dataHeights = ["10", "20", "30", "40", "50", "60"];
    let returnH = []
    let count = -1;
    for (let i = 0; i < dataHeights.length; i++) {

        returnH.push({ name: dataHeights[i], id: ++count, isSelected: count === 0 ? true : false });
    }
    return returnH
}

const onStart = event => {
    //event.preventDefault();
    const itemSelected = event.target.selectedOptions[event.target.selectedIndex];
    //itemSelected.selected = true;
    console.log(itemSelected.textContent);
    //setModel(itemSelected.textContent);
    const heightOptions = getHeightOption()

    let label = "Select Tower Height"
    heightOptions.push({ id: 0, name: label, isSelected: true })
    const heightSelectBox = makeSelectBox("height", "height", label, onHeightSelect);

    for (let i = 0; i < heightOptions.length; i++) {
        const opt = document.createElement("option");
        const textNode = document.createTextNode(heightOptions[i].name)
        opt.appendChild(textNode);
        opt.value = heightOptions[i].id.toString()
        opt.selected = heightOptions[i].isSelected;
        heightSelectBox.appendChild(opt);
    }


    showHeightSelection(heightSelectBox);

}




const onHeightSelect = event => {
    event.preventDefault();

    const itemSelected = parseInt(event.target.selectedOptions[0].text);
    if (Thebuilder.tower === undefined) {
        Thebuilder.insertTower(tower)
    }

    Thebuilder.changeTowerHeight(itemSelected);
    // Thebuilder.tower.towerBuild();
    Thebuilder.scene.add(tower)

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
    seiresOptions.push({ name: "25G", id: 1, isSelected: false })
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

const rotateButton = makeRadioButton("rotate", "rotate", "Rotate", '', '', onToolButtonClick, true, true);
const panButton = makeRadioButton("pan", "pan", "Pan", '', '', onToolButtonClick, true, true);
const selectButton = makeRadioButton("select", "select", "Select", '', '', onToolButtonClick, true, true);
const icons = [rotateButton, panButton, selectButton];
const bar = makeToolBar(icons);

const pageBody = pageContainer();
const top = topContainer();
const bottom = bottomContainer();
const title = titleBar();
top.appendChild(title);

const newMouseDisplay = new components().mousePosition(0, 0, 0, "mouse");
const newInfoDisplay = new components().partPosition(["1", "2", "3"], "info");
let sideItems = [newMouseDisplay, newInfoDisplay, bar, towerSelect];


const main = buildMain(sideItems, renderArea())

bottom.appendChild(main)
pageBody.appendChild(top);
pageBody.appendChild(bottom)

document.body.appendChild(pageBody);
if (module.hot) {
    module.hot.accept('./threedbuilder.js', function() {
        console.log("Accepting the updated threedbuilder module!");
        printMe();
    });
}
const theWidth = renderarea.clientWidth;
const usedSpace = document.getElementsByClassName('jumbotron')[0].clientHeight + 150;
const theHeight = window.screen.availHeight - usedSpace;
Thebuilder.setHeight(theHeight)
Thebuilder.setWidth(theWidth)
Thebuilder.setRenderElementId("renderarea");
Thebuilder.start()

Thebuilder.attach(document);