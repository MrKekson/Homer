/* Homer Api Server */


var colors = require('colors');
var exec = require('child_process').exec;
var express   = require('express');
var fs = require('fs');
var getIP = require('ipware')().get_ip;
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var http      = require('http');

var app       = express();

//sustain sustainOnTime minutes from suatainCycleTime time, if heating.sustain i strue


var heating = { gpio: '29', value: 0, name : 'futes01', sustain: false };

var configFilePath = 'settings.json'

/* Heating controlls  */

var settings = ({});
var tempsensor = { temp : 404, humidity : 404 };

/*------- startup settings -------*/

var StartUp = function(){

  var default_settings = {  target : 24, 
                            tolerance : 0.2, 
                            minimum : 18, 
                            active : false, 
                            port : 4242, 
                            sustain : { 
                              sustainOnTime: 5 , sustainCycleTime: 30 }, 
                            cycleTime : 10000 };
 
  console.log('Hi.');

  fs.stat(configFilePath ,function(err, stat){


  var _Testoverride = false;
    if (err || _Testoverride ) {
      settings = default_settings;
      console.log( 'ConfigFileError: working with default_settings' );
      fs.writeFile( configFilePath, JSON.stringify(default_settings), { flags: 'w' }, function (err) {
        if (err) throw err;
        console.log( 'ConfigFileError: Writing' + configFilePath );
        FinishStartup();
      })
    }else{
      console.log('Reading config.');
      fs.readFile(configFilePath, handleSettingFile);
    }   
  })
}

function ConfigSave(){ 
  fs.writeFile( configFilePath, JSON.stringify( settings ), { flags: 'w' }, function (err) {
    if (err) throw err;
    console.log( 'Writing Config.' );
  });
};

function FinishStartup(){ 

  exec("gpio mode "+heating.gpio+" out");
  console.log('GPIO '+ heating.gpio +' ('+ heating.name +')'+ ' mode out' );
  //exec("gpio write "+heating.gpio+" 0"); 


  //Startup miatt kell, de nem biztos h jo, igy nem lehet loadlni ezzel configot
  app.listen(settings.port);
  console.log('App Server is listening on port ' + settings.port);

  heatCore.update();

 };

function handleSettingFile(err, data) {
  if (err) throw err
  if ( settings = JSON.parse(data) ){ 
    console.log('Settings found.');
    console.log( settings );
    FinishStartup();
  } else{
    console.log('Settings: FAIL');
  }
}

StartUp();


/*  google docs api send   */
/*
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

function authorize(credentials, callback) {

  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function listFiles(auth) {
  var service = google.drive('v2');
  service.files.list({
    auth: auth,
    maxResults: 10,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.items;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
      console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('%s (%s)', file.title, file.id);
      }
    }
  });
}*/

/*
authorize( JSON.parse( {"web":
                        {"client_id":"702710621056-pfr790nfptb23i56e3ndbg4nf8j9pb3j.apps.googleusercontent.com",
                        "project_id":"axial-acrobat-115107","auth_uri":"https://accounts.google.com/o/oauth2/auth",
                        "token_uri":"https://accounts.google.com/o/oauth2/token",
                        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
                        "client_secret":"EoXlaPL7PgWBfjZxiT63HnIN"}} ), 
                      listFiles);*/








/*  futes vezerles */

var heatCore = ({});

heatCore.sustainStatus = { cycleCount : 0,  newCycle: true, cycle : { start: '', end: '', sustainStart : '' }};

heatCore.update = function(){
  heatCore.updateSustain();
  heatCore.controllHeat(); 
}

heatCore.controllHeat = function(){
  var d = new Date();
  var thresholdlov = settings.target - settings.tolerance;
  var thresholdhigh = settings.target + settings.tolerance / 2;

  console.log(  'Active:' + settings.active , 'Sustain:'+ heating.sustain , 
                'T-' + new Date(  this.sustainStatus.cycle.sustainStart - d ).getMinutes()  , 
                ' Heat Status: ' + heating.value );
  console.log(  'temp:' + tempsensor.temp, 'Treshold:'+ thresholdlov +'-'+thresholdhigh );
 
 // console.log('A:'+ settings.active +' temp:' + tempsensor.temp +' target:'+ settings.target +' Treshold:'+ thresholdlov +'-'+thresholdhigh+' Tol:'+ settings.tolerance );
  if ( settings.active ){
    //console.log('h1');
    if ( tempsensor.temp < thresholdlov || heating.sustain ){
      heatCore.setHeat(true);
      //console.log('h11 be');
    }else{
      //console.log('h10');
      if( tempsensor.temp > thresholdhigh ){
        heatCore.setHeat(false);
        //console.log('h101 ki');
      }
    }
  }else{
    heatCore.setHeat(false);
    //console.log('h0 ki');
  }
}

heatCore.updateSustain = function (){
  var d = new Date();

  //console.log();
  //console.log ( 'Start:' + this.sustainStatus.cycle.start ,  ' End:' + this.sustainStatus.cycle.end, ' sustainStart:' + this.sustainStatus.cycle.sustainStart   );

  if ( this.sustainStatus.newCycle ){

    this.sustainStatus.cycle.start = d;
    this.sustainStatus.cycle.end = new Date( d.valueOf() + settings.sustain.sustainCycleTime * 60 * 1000 ); 
    this.sustainStatus.cycle.sustainStart = new Date(  d.valueOf() + ( settings.sustain.sustainCycleTime - settings.sustain.sustainOnTime ) * 60 * 1000 );
    this.sustainStatus.newCycle = false;
    heating.sustain = false;

  } else{

    if ( this.sustainStatus.cycle.sustainStart < d  ){

      if ( this.sustainStatus.cycle.end < d  ){
         this.sustainStatus.newCycle = true;
         heating.sustain = false;

      }
      //console.log ( 'sustain srart < date' );
      //console.log ( this.sustainStatus.cycle.sustainStart );
      heating.sustain = true;

    } else {

      //console.log ( 'sustain srart > date' );
      //console.log ( this.sustainStatus.cycle.sustainStart );
      heating.sustain = false;

    }
  }
}

heatCore.setHeat = function (val) {
  var _testing = false; //TODO: ganaj test override
  
  if (val === true )  {
    
    if ( heating.value == true ){
      console.log("+++++++++++++futes: be");
    }    
    heating.value = true; 
    if (!_testing) {
        exec("gpio write "+ heating.gpio+" 1" ); 
    }
    return true; };
  if (val === false)  { 
     if ( heating.value == true ){
      console.log("-------------futes: ki");
     }
    heating.value = false;  
    if (!_testing) {
        exec("gpio write "+ heating.gpio+" 0" ); 
    }
    return true; 
    };
  return false;
};


//TODO: setintervalt valtozositani 
//main cycle
setInterval( function (  ) { 
  heatCore.update();
 //setSustain();
}, 10000 );

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory
app.use(express.static(__dirname));


app.get('/settemp/:temp', function( req, res ){
  var d = new Date();

  console.log(d + '  ' + getIP(req).clientIp +' settemp:' + req.params.temp );
  if ( !isNaN( req.params.temp )){ 
    settings.target = parseFloat( req.params.temp ); 
  }
  ConfigSave();

  res.status(200).send( '{ K :"' + settings.target + '" }');
})

app.get('/setheating/:state/', function (req, res){
  var ok = false;
  var d = new Date();

  console.log(d + '  ' + getIP(req).clientIp +' setfutes:' +req.params.state );

  if (req.params.state == 'on'){ settings.active = true; ok = true}
  if (req.params.state == 'off'){ settings.active = false ; ok = true}

  if (ok){
    ConfigSave();
    res.status(200).send('ok:' + settings.active );
  }else{
    res.status(500).send('Gtfo' + req.params.id);
  }
})


app.get('/getfutes', function ( req, res ){
  res.status(200).send('{ "futes": '+ settings.active +', "'+ heating.name + '" : ' + heating.value +' }');
})

app.get('/setsensor/:t/:h', function (req, res) {
  var d = new Date();
  console.log( d +' sensordata: ' + req.params.t  +'C '+ req.params.h +'% pf' +  parseFloat( req.params.t ));
  tempsensor.temp = parseFloat(req.params.t);
  tempsensor.humidity = parseFloat(req.params.h);

  heatCore.controllHeat();

  res.status(200).send('ok');
}); 

app.get('/getsettings', function (req, res) {
  var d = new Date();
  console.log(d + '  ' + getIP(req).clientIp +' settings_request' );
  res.status(200).send( settings );
});

app.get('/getsensordata', function (req, res) {
  var d = new Date();
  console.log(d + '  ' + getIP(req).clientIp +'  sensordata_request' );
  res.status(200).send(tempsensor);
});

app.get('*', function (req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
}); 


process.on('SIGINT', function() {
  var i;

  console.log("\nDoh!");

  process.exit();
});


// ------------------------------------------------------------------------
// Start Express App Server
//

