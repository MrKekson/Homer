
import * as srv from "./server/server.module"

declare var __DEBUG: boolean;

class Core {

    protected Server : srv.WebServer;

    constructor() {



        console.log(" ------ Core Init------ ");

         console.log("dir: '" + __dirname + "'");

        this.Server = new srv.WebServer();
        this.Server.run();

    };
    
};

var core = new Core();