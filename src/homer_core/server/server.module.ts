import * as express from "express";

declare var _DEBUG: boolean;

export class WebServer{ 
    /**
     * @param port - port to listen on
     */
    _express_srv = express();
    private port = 8008;

    constructor( port?: number) {
        
        console.log("WTF");

        port ? this.port = port : null;
       // _DEBUG ? console.log("DEBUG") : console.log("NOT DEBUG");
    }

    public run() {
        this._express_srv.listen( this.port );
    }
}


