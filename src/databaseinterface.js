import Axios from "axios"

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
        successfullCallback()
        // let endPoint = this.buildEndPoint(what);
        // Axios.get(endPoint).then(
        //     (data) => successfullCallback(data),
        //     (error) => failCallback(error)
        // )
    }


}

export default APIData;