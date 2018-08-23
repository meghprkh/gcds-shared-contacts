var gapi = window.gapi
var feedParser = require("./feed-parser")

// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
var apiKey = process.env.REACT_APP_API_KEY;

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
var clientId = process.env.REACT_APP_CLIENT_ID;

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
var scopes = 'https://www.google.com/m8/feeds/contacts/';

window.handleClientLoad = function () {
  // Load the API client and auth2 library
  gapi = window.gapi
  gapi.load('client:auth2', gapiinit);
}

var inited = false, updateSigninStatus = () => false;
function gapiinit() {
  if (!inited) {
    window.setTimeout(gapiinit, 500);
    return
  }

  gapi.client.init({
    apiKey: apiKey,
    clientId: clientId,
    scope: scopes
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}


function initClient(updateSigninStatusE) {
  if (inited) return;

  inited = true;
  updateSigninStatus = updateSigninStatusE
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// Load the API and make an API call.  Display the results on the screen.
function fetchData(cb) {
  gapi.client.request({
    path: `https://www.googleapis.com/m8/feeds/contacts/${process.env.REACT_APP_DOMAIN}/full?max-results=${process.env.REACT_APP_MAX_RESULTS}`
  }).then(function(resp) {
    feedParser(resp.body, cb)
  }).catch(function (err) {
    if (err.status === 403 || err.status === 401) alert("Forbidden! Use Admin account")
    handleSignoutClick();
  });
}

function deleteContact(link, cb) {
  gapi.client.request({
    path: link,
    method: 'DELETE',
  }).then(function(resp) {
    cb(resp)
  });
}

module.exports = {
  initClient,
  handleAuthClick,
  handleSignoutClick,
  fetchData,
  deleteContact
}
