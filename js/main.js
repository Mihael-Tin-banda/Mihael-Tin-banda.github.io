unction getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.onload = function() {
  var accessToken = getParameterByName('access_token');
  if (accessToken) {
      // Save the access token somewhere (e.g., in session storage)
      sessionStorage.setItem('access_token', accessToken);
  }
};

var config = {
  web: {
    client_id:
      "786268764964-07k8euka1hg47u2amgl6fe5u4fko9j81.apps.googleusercontent.com",
    project_id: "pristine-ally-417110",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "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",
    redirect_uris: ["https://mihael-tin-banda.github.io"],
    javascript_origins: ["https://mihael-tin-banda.github.io"],
  },
};

var clientId = config.web.client_id;
var redirectUri = config.web.redirect_uris[0];
var scope = "https://www.googleapis.com/auth/fitness.activity.read";
var authUrl =
  config.web.auth_uri +
  "?client_id=" +
  clientId +
  "&redirect_uri=" +
  redirectUri +
  "&scope=" +
  scope +
  "&response_type=token";

var authenticateButton = document.getElementById("Authenticate");
authenticateButton.addEventListener("click", function () {
  window.location.href = authUrl;
});

var getKKButton = document.getElementById("Get_KK");
getKKButton.addEventListener("click", handleRequest);

function handleRequest() {
  var access_token = sessionStorage.getItem("access_token");
  if (!access_token) {
    console.log("You need to authenticate first");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status === 200) {
      var response = JSON.parse(this.responseText);
      // Handle the response
      // ...
    } else if (this.status === 401) {
      refreshToken();
    } else {
      console.log(
        "Failed to fetch the step count data",
        this.status,
        this.responseText
      );
    }
  };

  xhr.onerror = function () {
    console.log("Network error");
  };

  xhr.open(
    "POST",
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate"
  );
  xhr.setRequestHeader("Authorization", "Bearer " + access_token);
  xhr.setRequestHeader("Content-Type", "application/json");

  var data = JSON.stringify({
    aggregateBy: [
      {
        dataTypeName: "com.google.step_count.delta",
        dataSourceId:
          "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
      },
    ],
    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: (Date.now() - 86400000) * 1000,
    endTimeMillis: Date.now() * 1000,
  });

  xhr.send(data);
}

function refreshToken() {
  var refresh_token = sessionStorage.getItem("refresh_token");
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status === 200) {
      var response = JSON.parse(this.responseText);
      sessionStorage.setItem("access_token", response.access_token);
    } else {
      console.log("Failed to refresh token", this.status, this.responseText);
      var error = JSON.parse(this.responseText);
      if (error.error && error.error.message) {
        console.log("Error message: ", error.error.message);
      }
    }
  };

  xhr.open("POST", config.web.token_uri);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  var data =
    "refresh_token=" +
    refresh_token +
    "&client_id=" +
    clientId +
    "&client_secret=" +
    config.web.client_secret +
    "&grant_type=refresh_token";

  xhr.send(data);
}
