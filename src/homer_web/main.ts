//import {bootstrap} from "@angular/platform-browser"
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import "./polyfills";
import {AppModule} from "./app.module";

const platform = platformBrowserDynamic();
platform.bootstrapModule( AppModule );

console.log("main called")


