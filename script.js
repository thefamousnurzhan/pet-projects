// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
let apiKey = '42cc6f1bcc090913a88f48a5eff93fb1';
const buttonsDiv = document.getElementById('buttons');
let apiDaysGlob = null; 
let myChart = null; 
const inputDiv = document.getElementById('city-input'); 
const cityNamesDiv = document.getElementById('city-list');

function getWeather(){
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${inputDiv.value}&appid=${apiKey}`)
    .then(
    function(res){ 
        apiData = res.data.list;
        apiDaysGlob = getApiDays(apiData);
        console.log('inside axios', apiDaysGlob)
    }
    );  
}

// Kazakhstan 

function getCities() {
    axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
        country: "Kazakhstan"
    }).then(res => {
        citiesArr = res.data.data
        console.log(citiesArr)
        setCity(citiesArr)
    })
}



function drawChart(apiDays, i, city){
    const labels = [
        ...apiDays[i].time
    ];

    const data = {
    labels: labels,
    datasets: [{
            label: city + ' ' + apiDays[i].day, // названия графика
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [...apiDays[i].temp],
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: false
        }
    };

    return new Chart(
        document.getElementById('myChart'),
        config
    );
}

// buttons 
function addButtons (apiDays, i){
    for(let i = 0; i < apiDays.length; i++){
        buttonsDiv.innerHTML +=
        `
            <button onclick=changeDay('${i}')>${apiDays[i].day}</button>
        `
    }
}

function getApiDays(apiData){
    let apiDays = [];

    for(let i = 0; i < apiData.length;){

        let dayTimeTemp = {
            day: '',
            time: [],
            temp: []
        }

        dayTimeTemp.day = apiData[i].dt_txt.substring(0, 10);

        while(apiData[i].dt_txt.substring(0,10) === dayTimeTemp.day){
            dayTimeTemp.time.push(apiData[i].dt_txt.substring(11));
            dayTimeTemp.temp.push(apiData[i].main.temp - 273.15);
            i++;

            if(i == apiData.length) break;
        }

        apiDays.push(dayTimeTemp);
    }
    if(myChart) myChart.destroy();
    buttonsDiv.innerHTML = '';
    myChart = drawChart(apiDays, 0, inputDiv.value); 
    addButtons(apiDays);
    return apiDays;
}

function changeDay(i){
    myChart.destroy();
    myChart = drawChart(apiDaysGlob, i, inputDiv.value);
}
// option тэг (через джс в индекс хтмл)
function setCity(arr){
    for(let i = 0; i < arr.length; i++){
        cityNamesDiv.innerHTML +=
        `
            <option value="${arr[i]}">
        `
    }
}

getCities();