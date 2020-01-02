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

};

export default components;