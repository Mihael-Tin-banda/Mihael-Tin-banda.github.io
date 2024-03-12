document.getElementById('authorizeButton').addEventListener('click', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('code');

    if (code) {
        fetch('https://api.fitbit.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`23RT5X` + ':' + `579d36577af143adf1e504fa3ccb47aa`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=authorization_code&code=' + code + '&redirect_uri=https://mihael-tin-banda.github.io'
        })
        .then(response => response.json())
        .then(data => {
            var access_token = data.access_token; // Use the access token from the response
            var refresh_token = data.refresh_token; // Use the refresh token from the response

            fetch('https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then(response => response.json())
            .then(data => {
                var steps = data['activities-steps'][0].value;
                var newCoins = steps / 100;
                var coinDisplayText = document.getElementById('coinDisplay').innerText;
                var currentCoins = 0;
                if (coinDisplayText.includes(": ")) {
                    currentCoins = parseFloat(coinDisplayText.split(": ")[1]);
                }
                var totalCoins = currentCoins + newCoins;
                document.getElementById('coinDisplay').innerText = "Coins: " + totalCoins;
            }) // Closing parenthesis for the fetch function
        }) // Closing parenthesis for the event listener function
    } else {
        window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23RT5X&scope=profile activity&redirect_uri=https://mihael-tin-banda.github.io&state=2w6v1l1h502m0o4d006t242s095y6w2g`;
    }
});