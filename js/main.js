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
            var access_token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1JUNVgiLCJzdWIiOiJCWjRLRkgiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3YWN0IHdwcm8iLCJleHAiOjE3MTAyOTI3NzEsImlhdCI6MTcxMDI2Mzk3MX0.uAgLFZThl2rbJ-UsPRaFYA8SBFU0o5J1LBm-NuULtWI";
            var refresh_token = "e94a3e5bc3535524b7be924724484528286b1262b140ea4875a396dad8a72030";

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
            })
    } else {
        window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23RT5X&scope=profile activity&redirect_uri=https://mihael-tin-banda.github.io&state=2w6v1l1h502m0o4d006t242s095y6w2g`;
    }
});