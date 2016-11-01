import * as express from "express";
import * as path from "path";



export class WebServer{ 
    /**
     * @param port - port to listen on
     */
    private _server = express();
    private port = 8008;

    constructor( port?: number) {
        port ? this.port = port : null;
       // _DEBUG ? console.log("DEBUG") : console.log("NOT DEBUG");
    }

    public addController( name: string , funct: any ){  
        
    }

    public run() {
       
        console.log("Starting Express server ....");

        var dir = __dirname + "\\client";

        var dir2 = express.static(dir);

        this._server.use(dir2);

        console.log(dir2);

        this._server.get('/t', function ( req, res ){
            res.status(200).send('{ "megy": "true" }');
        })

        this._server.get('/tt', function ( req, res ){
            res.status(200).send(dir2);
        })

        this._server.listen( this.port );
        console.log("   listening on " + this.port );

    }
}


