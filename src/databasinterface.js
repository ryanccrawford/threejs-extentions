import Axios from "axios"


class Parts {

    partLoader;

    constructor() {
        this.partLoader = new PartLoader();
    }

    loadParts = () => {



    }


}


class PartLoader extends APIData {

    constructor() {
        super();

    }

    getPartAllParts = () => {
        let endPoint = this.buildEndPoint(parts)
        const Parts = axios.get(this.endPoint)
        return Parts
    }

}


class APIData {

    endPointBase = "/";
    endPointGet = "get/";
    call;

    constructor() {


    }

    buildEndPoint = call => {
        return this.endPointBase + this.endPointGet + call;
    }

    getData = (what, successfullCallback, failCallback) => {
        let endPoint = this.buildEndPoint(what);
        Axios.get(endPoint).then(
            (data) => successfullCallback(data),
            (error) => failCallback(error)
        )
    }


}

export {APIData, PartLoader, Parts}