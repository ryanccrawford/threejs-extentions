import _ from "lodash";
import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import "bootstrap";
import printMe from "./print.js";
import components from "./container.js";
import thebuilder from "./threedbuilder.js";


function component() {
    const Components = new components();
    const btn = document.createElement("button");
    btn.innerHTML = "More Info";
    btn.onclick = printMe;
    const containerElement = Components.fluidContainer();
    const jumbo = Components.jumbotron();
    const text = Components.display4('3 Star - 3D Tower Builder');
    jumbo.appendChild(text);
    jumbo.appendChild(btn);


    containerElement.appendChild(jumbo);

    return containerElement;
}
const fluidBottomContainer = new components().fluidContainer();
const renderArea = new components().div();
const layoutRow = new components().row();
const layoutPartsListLeftSide = new components().col(2);
const layoutViewAreaRightSide = new components().col(10);
const newMouseDisplay = new components().mousePosition(0, 0, 0, "mouse");
layoutPartsListLeftSide.appendChild(newMouseDisplay);
renderArea.setAttribute("id", "renderarea");
renderArea.style.textAlign = "center";
layoutViewAreaRightSide.appendChild(renderArea);
layoutRow.appendChild(layoutPartsListLeftSide);
layoutRow.appendChild(layoutViewAreaRightSide);
document.body.appendChild(component());
fluidBottomContainer.appendChild(layoutRow);
document.body.appendChild(fluidBottomContainer);
const theWidth = renderarea.clientWidth - 20;
const theHeight = window.screen.availHeight - (0.30 * window.screen.availHeight);
const Thebuilder = new thebuilder(theHeight, theWidth, "renderarea");
Thebuilder.attach();