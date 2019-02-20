var express = require('express');
var fs = require("fs");
var request = require('request');


// =============== Restcomm Account Details =============== 

  var rc_server         = "<<your_restcomm_domain>>";
  var rc_restCommBase   = "restcomm";
  var rc_accountBase    = "2012-04-24/Accounts";
  var rc_application    = "SMS/Messages";
  

//console.log("[LOG] DEBUG - Restcomm API Path Loaded: %s",rc_path);

// =============== RESTful API Creation =============== 

var rest = express();


// =============== RESTful POST API SEND MESSAGE =============== 

// POST - Send Message: https://<<your_api_url>>/sendsms/send?from=123456789&to=9876543210&body=message

// RETURNS:
//  - 0: Not Authorised
//  - 1: Message Sent


rest.post('/sendsms/send', function (req, res) {
    

    // get timestamp
    var now = new Date();
    var timestamp = 'utc|' + now.getUTCFullYear() 
                           + '/' + (now.getUTCMonth()+1)
                           + '/' + now.getUTCDate()
                           + '|' + now.getHours()
                           + ':' + now.getMinutes();


   // First get list of carriers.
   fs.readFile( "<<path>>/carriers.json", 'utf8', function (err, data) {
       if (err) {
            return console.error(err.message);
         }
    
        var obj = {
           subscribers: []
        };

        obj = JSON.parse(data); 

        // Read received parameters
        var sms_from = req.query.from;
        var sms_to = req.query.to;
        var sms_body = req.query.body;
    
        var auth = 0;

        // Check destination and fetch carrier
        
        // console.log("[%s] DEBUG - message to be sent is: from [%s], to [%s], body[%s]",timestamp,sms_from,sms_to,sms_body);
        
        if (sms_to.match(/^44/) && obj.hasOwnProperty('uk')){ // for UK
        
                var rc_carrier = obj.uk.carrier
                var rc_accountSid = obj.uk.acctsid;
                var rc_accountToken = obj.uk.accttoken;
                
                auth = 1;
                
        } else if(sms_to.match(/^351/) && obj.hasOwnProperty('portugal')){
            
                var rc_carrier = obj.portugal.carrier
                var rc_accountSid = obj.portugal.acctsid;
                var rc_accountToken = obj.portugal.accttoken;
                
                auth = 1;

                
        } else if(sms_to.match(/^49/) && obj.hasOwnProperty('germany')){
            
                var rc_carrier = obj.germany.carrier
                var rc_accountSid = obj.germany.acctsid;
                var rc_accountToken = obj.germany.accttoken;
                
                auth = 1;

                
        } else {
            console.log("[LOG] DEBUG - destination not authorised: %s",sms_to);
            res.end('0');
        }
        
        
        
        // Authorized: Send SMS with Restcomm API

        if (auth==1){
            
                console.log("[%s] DEBUG - message to be sent is: from [%s], to [%s], body[%s]",timestamp,sms_from,sms_to,sms_body);
                console.log("[%s] DEBUG - carrier [%s], acctsid [%s], accttoken[%s]",timestamp,rc_carrier,rc_accountSid,rc_accountToken);

                
                
                var rc_path =  rc_restCommBase + '/' 
                            + rc_accountBase + '/'  
                            + rc_accountSid + '/' 
                            + rc_application;

                
                var options = {
                    url: 'https://' + rc_server + '/' + rc_path,
                    auth: {
                        username: rc_accountSid,
                        password: rc_accountToken
                    },
                    form: {
                        To: sms_to,
                        From: sms_from,    // I want the origin to be a string
                        Body: sms_body
                    } 
                };
                
                request.post(options,function(err,resp,body){
                    if (err) { return console.log(err); }
                        console.log("[%s] DEBUG - Message Sent - Report Received:",timestamp);
                        console.log(body);
                });                    
                        
                console.log("[%s] DEBUG - Message Sent to: %s",timestamp,sms_to);
                
                res.end('1');
        }

                    
    });
})



// =============== RESTful Server Start =============== 

var server = rest.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("[LOG] SERVER - SMS Broadcast Application listening at http://%s:%s", host, port)

})
