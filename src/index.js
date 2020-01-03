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
    const text = Components.display4('Welcome');
    jumbo.appendChild(text);
    jumbo.appendChild(btn);


    containerElement.appendChild(jumbo);

    return containerElement;
}
const renderArea = document.createElement("div");
renderArea.setAttribute("id", "renderarea");
renderArea.style.textAlign = "center";
document.body.appendChild(component()).appendChild(renderArea);

const Thebuilder = new thebuilder(600, 1000, "renderarea");
Thebuilder.attach();