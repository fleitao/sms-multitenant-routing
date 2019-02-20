# multitenant-sms-routing
Application that routes short-messages through different carriers depending on key aspects as destination number

Author: 
Filipe Leitão (contact@fleitao.org)

# Description:
This is a Multitenant SMS Routing Service that allows anyone to route a short-message to a certain carrier based
on pre-configured criteria, e.g. destination number/country. This service tries to simplify short-message distribution
when required interconnections with several SMPP links, i.e. one link per different termination carrier. With this service
you can terminate your short-messages using different carriers with only one single rest-api.

# Usage:
1) Send short-message with following POST URL: 
   https://<<your_api_url>>/sendsms/send?from=123456789&to=9876543210&body=message
2) The application will check destination country by the prefix (e.g. 44-UK, 351-PT or 49-DE);
3) According to the destination retrieves the corresponding Restcomm Account details for that specific carrier;
4) Sends the message using Restcomm SMS API - which will use SMPP interconnection link for termination;

# Service Architecture:
The service is split into three components: 
- Restcomm Accounts / one Restcomm account or sub-account per interconnected carrier (you need the accountsid 
  and token for each)
- sendsms.js / Node.JS middleware that keeps the routing logic and glues front-end, restcomm and JSON file;
- carriers.json / JSON file with all the carriers and AccountSID/Token for each; 

Please note that to execute this application you'll need a Restcomm account and one SMPP interconnection per carrier.
You can get a free Restcomm account using the following link: https://cloud.restcomm.com/#/signup
In Restcomm you'll find instructions to interconnect your account with your carrier through SMPP:
https://www.restcomm.com/docs/Restcomm-CSP/1.0/byoc.html#_setting_up_your_carrier_for_sms_traffic
