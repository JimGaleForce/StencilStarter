import { msalInstance, getMsalInstance } from '../helpers/msal';

var msalI = null;
var isLocalDebugMode = false;

const theServer = "https://theserver.net/api"; //CHANGE

export function isProdMode(): boolean {
  return !isLocalDebugMode;
}

export async function getUrl(url: string, isJson: boolean = true, mime: any = 'application/json', isSecure: boolean = true) {
  if (url.indexOf("$api$") > -1) {
    var repl = theServer;
    if (isLocalDebugMode) {
      repl = "https://localhost:44346/api";
    }
    url = url.replace("$api$", repl);
  }

  var headers = {};
  if (isJson) {
    headers['Content-Type'] = mime;
  }

  //  try {
  const response = isSecure ? await fetchWithToken(url, {
    method: "GET",
    headers: headers//,
    //credentials: isLocalDebugMode ? 'omit' : 'include'
  }) : await fetch(url, {
    method: "GET",
    headers: headers//,
    //credentials: isLocalDebugMode ? 'omit' : 'include'
  });

  return response.json();
}

export function getMe() {
  if (msalI === null) {
    msalI = getMsalInstance();
  }

  return msalI.account ? msalI.account.userName : "";
}

export async function postUrl(url: string, data: any, isJson: boolean = true, isSecure: boolean = true) {
  if (url.indexOf("$api$") > -1) {
    var repl = theServer;
    if (isLocalDebugMode) {
      repl = "https://localhost:44346/api";
    }
    url = url.replace("$api$", repl);
  }

  var headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  const response =
    isSecure ? await fetchWithToken(url, {
      method: "POST",
      headers: headers,
      body: isJson ? JSON.stringify(data) : data//,
      //credentials: isLocalDebugMode ? 'omit' : 'include'
    }) : await fetch(url, {
      method: "POST",
      headers: headers,
      body: isJson ? JSON.stringify(data) : data//,
      //credentials: isLocalDebugMode ? 'omit' : 'include'
    });

  if (response === null) {
    return null;
  }

  return response.json();
}

export async function fetchWithToken(endpoint, options: any = {}) {
  const token = await getToken();
  const bearer = `Bearer ${token}`;
  if (options.headers) {
    options.headers['Authorization'] = bearer;
  } else {
    options.headers = {
      Authorization: bearer
    }
  }
  if (!options.credentials) {
    // required for CORS as any request with Authorization header is a "non-simple" request
    //options.credentials = 'include';
  }
  return await fetch(endpoint, options);
}

var tokenRequest = {
  scopes: ["https://theserver.net/user_impersonation"]
}

async function getToken() {
  return new Promise((resolve, reject) => {
    // is user logged in?
    if (msalI === null) {
      msalI = getMsalInstance();
    }

    if (msalI.getAccount()) {
      // if so, try acquiring token silently first (works if token cached)
      msalI.acquireTokenSilent(tokenRequest)
        .then(response => {
          resolve(response.accessToken);
        })
        .catch(err => {
          if (err.name == "InteractionRequiredAuthError") {
            // if silent token acquire didn't work, use popup
            return msalI.acquireTokenPopup(tokenRequest)
              .then(response => {
                resolve(response.accessToken);
              })
              .catch(reject)
          } else {
            reject(err);
          }
        });
    } else {
      // user not logged in. log in and try again
      msalI.loginPopup(tokenRequest)
        .then(() => {
          resolve(getToken())
        })
        .catch(err => {
          // login error
          reject(err);
        })
    }
  });
}
export async function getUrlX(url: string, isJson: boolean = true, mime: any = 'application/json') {
  const promise = new Promise<any>((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    if (url.indexOf("$api$") > -1) {
      //var isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
      //var repl = isLocal ? "http://localhost:5628" : ("https://api.improvethe.world");
      //https://localhost:44359/api/lens?forMapName=histogram_bucket_count_map_json&forMapValue=4&groupName=osversion
      var repl = "https://localhost:44346/api";
      var repl = theServer;
      url = url.replace("$api$", repl);
    }

    xhr.open('GET', url);
    if (isJson) {
      xhr.setRequestHeader('Content-Type', mime);
    }
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      }
      else {
        reject(xhr);
      }
    };
    xhr.send();
  });

  return promise;
}

export async function postUrlX(url: string, data: any, isJson: boolean = true) {
  const promise = new Promise<any>((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    if (url.indexOf("$api$") > -1) {
      //var isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
      //var repl = isLocal ? "http://localhost:5628" : ("https://api.improvethe.world");
      var repl = "https://localhost:44346/api";
      var repl = theServer;
      url = url.replace("$api$", repl);
    }

    xhr.open('POST', url);
    if (isJson) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      }
      else {
        reject(xhr);
      }
    };
    xhr.send(isJson ? JSON.stringify(data) : data);
  });

  return promise;
}

export function hasClass(element: Element, className: string) {
  if (!element || !element.classList) {
    return false;
  }
  return element.classList.contains(className);
}

export function toggleClass(element: Element, className: string, addIfTrueRemoveIfFalse: any = null) {

  if (typeof element === 'undefined' || element === null) {
    //log('WARNING: missing element', 'warning,trace', 'utils');
    return;
  }

  var toRemove = (typeof addIfTrueRemoveIfFalse === 'boolean' ? !addIfTrueRemoveIfFalse : hasClass(element, className));
  var toAdd = (typeof addIfTrueRemoveIfFalse === 'boolean' ? addIfTrueRemoveIfFalse : !hasClass(element, className));

  if (toRemove && hasClass(element, className)) {
    element.classList.remove(className);
  } else if (toAdd && !hasClass(element, className)) {
    element.classList.add(className);
  }
}

export function stateToColor(status: string) {
  var color = '';
  if (status === 'Non-Actionable' || status === 'Proposed') {
    color = 'warning';
  } else if (status === 'Reviewed' || status === 'Resolved') {
    color = 'success';
  } else if (status === 'Unreviewed' || status == 'Active') {
    color = 'danger';
  } else if (status === 'Started') {
    color = 'primary';
  } else if (status === 'Completed') {
    color = 'secondary';
  } else {
    color = 'tertiary';
  }

  return color;
}
