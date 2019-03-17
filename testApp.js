const express = require('express')
const pjson = require('./package.json')

// this is the montoring result
let testOK = true
console.log( 'Starting continuous tests v'+pjson.version )

// ------------------------------------
// Instantiate a Mocha instance.
setInterval( ()=>{ 
  const Mocha = require( 'mocha' )
  let mocha = new Mocha()
  mocha.addFile( __dirname+'/test/firstTest.js' )
    // mocha.loadFiles()
  mocha.run( (failures) => {
    testOK = ( failures == 0 )
    mocha.unloadFiles( )
  })
}, 2*60*1000 )

// ------------------------------------
// set up the "check result" web server 
const HTTP_SERVER_ERROR = 500
let app = express()

app.get( '/test-status',  (req, res) => {
  if ( testOK ) {
    res.send('TESTS OK')
  } else {
    res.status( HTTP_SERVER_ERROR ).send('TESTS FAILED')
  }
})

app.listen( 8080 )