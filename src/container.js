class components {

    fluidContainer = options => {
        let container = document.createElement("div");
        container.className = "container-fluid";
        return container;
    }
    jumbotron = options => {
        if (options && options.length > 0) {

        }
        let jumbotron = document.createElement("div");
        jumbotron.className = "jumbotron";
        return jumbotron;
    }

    display4 = (text, options = null) => {
        let display = document.createElement("h1");
        display.className = "display-4";
        display.innerText = text;
        return display;
    }

    canvas = (height, width, id, color = null) => {
        const canvas = document.createElement("canvas");
        canvas.style.width = width;
        canvas.style.height = height;
        if (color) {
            canvas.style.backgroundColor = color;
        }
        canvas.setAttribute("id", id);
        return canvas;
    }

    row = () => {
        const row = document.createElement("div");
        row.className = "row";
        return row;
    }

    col = (gridUnits) => {
        const col = this.div("col")
        col.className = col.className + "-" + gridUnits;
        return col;
    }

    div = (className) => {
        const div = document.createElement("div")
        if (className) {
            div.className = className;
        }
        return div;
    }
    mousePosition = (x, y, z, id = null) => {
        const div = document.createElement("div");

        const xbadge = document.createElement("div");
        xbadge.className = "badge badge-primary";
        xbadge.innerText = "X: " + (!x ? 0 : x.toFixed(4));
        const ybadge = document.createElement("div");
        ybadge.className = "badge badge-primary";
        ybadge.innerText = "Y: " + (!y ? 0 : y.toFixed(4));

        div.appendChild(xbadge)
        div.appendChild(ybadge)
        const card = this.card(div.innerHTML, "Mouse Position");
        if (id) {
            card.setAttribute("id", id);
        }
        return card;
    }

    card = (bodyHtml = null, titleText = null, imageSrc = null) => {
        const card = document.createElement("div");
        card.className = "card";
        if (imageSrc) {
            const image = this.cardImageTop(imageSrc);
            card.appendChild(image);
        }
        const body = this.cardBody(bodyHtml, titleText);
        card.appendChild(body);
        return card;
    }

    cardTitle = (text) => {
        const title = document.createElement("h4");
        title.className = "card-title";
        title.innerText = text;
        return title;
    }

    cardBody = (bodyContent = "", titleText = null) => {
        const body = document.createElement("div");
        body.className = "card-body";
        if (titleText) {
            const title = this.cardTitle(titleText);
            body.appendChild(title);
        }
        const p = document.createElement("p");
        p.innerHTML = bodyContent;
        body.appendChild(p);
        return body;
    }

    cardImageTop = (src) => {
        const image = document.createElement("img");
        image.className = "card-image-top";
        image.setAttribute("src", src);
        return image;
    }

    replaceElement = (elementIdToReplace, element) => {
        const elementBeingReplace = document.getElementById(elementIdToReplace);
        const newElement = element;
        elementBeingReplace.parentNode.replaceChild(newElement, elementBeingReplace);
    }

};

export default components;