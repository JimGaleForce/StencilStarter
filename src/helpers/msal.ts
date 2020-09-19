import * as Msal from 'msal';

export let msalInstance: Msal.UserAgentApplication;

const CLIENT_ID = ''; //YOUR GUID GOES HERE

export const getMsalInstance = () => {
  console.log('getMsalInstance');
  var msalConfig: Msal.Configuration = {
    auth: {
      // required as this is a single-tenant app in the microsoft tenant
      authority: 'https://login.microsoftonline.com/microsoft.onmicrosoft.com',
      clientId: CLIENT_ID
    }
  };

  msalInstance = new Msal.UserAgentApplication(msalConfig);

  msalInstance.handleRedirectCallback((error, response) => {
    // handle redirect response or error
    console.log('blub', error, response);
  });

  console.log('Msal.UserAgentApplication', msalInstance);

  return msalInstance;
};
