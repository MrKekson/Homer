
import * as srv from "./server/server.module"

class Core {

    protected Server : srv.WebServer;

    constructor() {

        console.log(" ------ Core Init------ ");

        this.Server = new srv.WebServer();
        this.Server.run();

    };
    
};

var core = new Core();