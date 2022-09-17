

async function getWeather(geocoordinates) {

    let url = '/getweather/' + geocoordinates + '';
    try {
        const res = await fetch(url);
        const res2 = await res.json();
        return res2;

    } catch (error) {
        console.log(error);
    }
}


 async function getCity() {
    var input =  document.getElementById("myForm");
    var city = 'paris';
    console.log(input);


    if (input) {
        if(input.elements[0].value !=''){
           city = input.elements[0].value;
            console.log(city);
        return city;    
        }
    }
    console.log(city);
    return city;
};


async function getCoordinates(city) {
    let url = '/latlon/' + city + '';

    try {
        let res = await fetch(url);
        let res2 = await res.json();
        let latlon = res2[0].lat + 's' + res2[0].lon;
        return latlon;
    } catch (error) {
        console.log(error);
    }
}



async function setWeather(result) {

    const card0 = 'card0';
    const card1 = 'card1';
    var element = document.getElementsByClassName(card0)[0];
    //setting in child elements of card
    element.getElementsByClassName("title-home")[0].innerHTML = result.name;
    element.getElementsByClassName("tmp")[0].innerHTML = (result.main.temp - 273.15).toFixed(2);
    element.getElementsByClassName("gen")[0].innerHTML = result.weather[0].description;
    element.getElementsByClassName("sunrise")[0].innerHTML = new Date(result.sys.sunrise).toLocaleTimeString("en-UK");
    element.getElementsByClassName("sunset")[0].innerHTML = new Date(result.sys.sunset).toLocaleTimeString("en-UK");
    element.getElementsByClassName("weather-icon")[0].src = 'http://openweathermap.org/img/wn/' + result.weather[0].icon + '.png'.toString();
    //setting in child elements of card
    var element_details = document.getElementsByClassName(card1)[0];
    element_details.getElementsByClassName("humidity")[0].innerHTML = result.main.humidity;
    element_details.getElementsByClassName("pressure")[0].innerHTML = result.main.pressure;
    // element_details.getElementsByClassName("sea_level")[0].innerHTML = result.main.sea_level;
    // element_details.getElementsByClassName("deg")[0].innerHTML = result.wind.deg;
    // element_details.getElementsByClassName("gust")[0].innerHTML = result.wind.gust;
    element_details.getElementsByClassName("speed")[0].innerHTML = result.wind.speed;
    element_details.getElementsByClassName("temp-high")[0].innerHTML = (result.main.temp_max - 273.15).toFixed(2);
    element_details.getElementsByClassName("temp-low")[0].innerHTML = (result.main.temp_min - 273.15).toFixed(2);
    element_details.getElementsByClassName("feels-like")[0].innerHTML = (result.main.feels_like - 273.15).toFixed(2);
}

async function getMoreinfo(location) {
    let url = '/more-info/'+location+'';

    try {
        let res = await fetch(url);
        let res2 = await res.json();
        console.log(res2);
        return res2;
    } catch (error) {
        console.log(error);
    }
}


function displayMoreinfo(){

     getCity().then(function(result) {
        getCoordinates(result).then(function(result) {
      
            getWeather(result).then(function(result) {
         
           getMoreinfo(result.sys.country).then(function(result) {
            //result[0]['flags']['png']
            //result[0]['capital'][0]
            // result[0]['car']['side']
            // result[0]['coatOfArms']['png']
            //    result[0]['continents'][0]
            //    result[0]['maps']['googleMaps']
            //    result[0]['maps']['openStreetMaps']
            //    result[0]['name']['common']
            //    result[0]['unMember']

                    console.log(result[0]);

 var element = document.getElementsByClassName('weather')[0];
    //setting in child elements of card
    element.getElementsByClassName("more-info-data")[0].innerHTML = result[0]['flags']['png'];



                });

            });

        });

     });

}
 
function displayWeather() {
     getCity().then(function(result) {
        getCoordinates(result).then(function(result) {
            getWeather(result).then(function(result) {
                setWeather(result).then(function(result) {
                    
                });

            });

        });

     });
}

displayWeather();
//displayMoreinfo();












