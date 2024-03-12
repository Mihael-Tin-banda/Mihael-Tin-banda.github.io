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
            body: 'grant_type=authorization_code&code=' + code + '&redirect_uri=http://localhost:8553'
        })
        .then(response => response.json())
        .then(data => {
            var access_token = data.access_token;
            var refresh_token = data.refresh_token;

            fetch('https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then(response => response.json())
            .then(data => {
                var steps = data['activities-steps'][0].value;
                var newCoins = steps / 100;
                var currentCoins = parseFloat(document.getElementById('coinDisplay').innerText.split(": ")[1]);
                var totalCoins = currentCoins + newCoins;
                document.getElementById('coinDisplay').innerText = "Coins: " + totalCoins;
            })
            .catch(error => console.error('Error:', error));
        });
    } else {
        window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23RT5X&scope=activity&redirect_uri=http://localhost:8553&state=2w6v1l1h502m0o4d006t242s095y6w2g`;
    }
};