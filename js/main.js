function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

window.onload = function() {
  var accessToken = getParameterByName('access_token');
  console.log('Access token from URL:', accessToken);
  if (accessToken) {
      sessionStorage.setItem('access_token', accessToken);
  }

  var getKKButton = document.getElementById("Get_KK");
  getKKButton.addEventListener("click", handleRequest);
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

var steps_sub = 0; // Initialize steps_sub
var Balance = 0; // Initialize Balance

function handleRequest() {
  var access_token = sessionStorage.getItem("access_token");
  console.log('Access token from session storage:', access_token);
  if (!access_token) {
    console.log("You need to authenticate first");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status === 200) {
      var response = JSON.parse(this.responseText);
      var steps = 0;
      if (response.bucket && response.bucket.length > 0) {
        var dataset = response.bucket[0].dataset[0];
        if (dataset.point && dataset.point.length > 0) {
          steps = dataset.point[0].value[0].intVal;
        }
      }
      console.log('Current step count:', steps);

      // Divide steps by 100 and round to one decimal place
      var pom_var = Math.round((steps / 100) * 10) / 10;

      // Subtract steps_sub from pom_var and add to Balance
      Balance += pom_var - steps_sub;

      // Save pom_var to steps_sub for next time
      steps_sub = pom_var;

      console.log('Balance:', Balance);
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

  var now = new Date();
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var timestamp = startOfDay / 1;

  var data = JSON.stringify({
    aggregateBy: [{
      dataTypeName: "com.google.step_count.delta",
      dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
    }],
    bucketByTime: { durationMillis: now - timestamp },
    startTimeMillis: timestamp,
    endTimeMillis: now.getTime(),
  });

  xhr.send(data);
}

// Reset steps_sub to 0 every day after midnight
setInterval(function() {
  var now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    steps_sub = 0;
  }
}, 60000); // Check every minute

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
