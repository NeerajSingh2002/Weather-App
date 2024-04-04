
// all the elements
const UserTab=document.querySelector('[data-userWeather]');
const SearchTab=document.querySelector("[data-searchWeather]");

const weatherContainer=document.querySelector(".weather-container");
const grantUsrContainer=document.querySelector(".grant-location-container");
const grantAccessButton=document.querySelector("[data-grantAccess]");

const formContainer=document.querySelector(".form-container");
const searchButton=document.querySelector("[data-weathersearchbtn]");
const searchInput=document.querySelector("[data-searchInput]");
const loadingContainer=document.querySelector(".loading-container");

const userInfoCont=document.querySelector(".user-info-container");
const nameDiv=document.querySelector(".name");
const cityName=document.querySelector("[data-cityName]");
const CountryFlag=document.querySelector("[data-countryIcon]");
const weatherDetail=document.querySelector("[data-weatherDesc]");
const weatherIcon=document.querySelector("[data-weatherIcon]");
const tempratureDet=document.querySelector("[data-temp]");

const parameterContainer=document.querySelector(".parameter-container");

const parameterCard=document.querySelector(".parameter");
const windSpeed=document.querySelector("[data-windSpeed]");
const humidity=document.querySelector("[data-Humidity]");
const clouds=document.querySelector("[data-cloud]");


let currentTab=UserTab;
const ApiKey="b79624febf78057df2c9c9496b28a07a";
currentTab.classList.add("current-tab"); 
getFromSessionStorage(); 
function switchTab(tab){
    if(tab!=currentTab){
        currentTab.classList.remove("current-tab"); 
        // grantUsrContainer.classList.remove("active");
        currentTab=tab;
        console.log(currentTab);
        currentTab.classList.add("current-tab"); 

        // for userInfoCont ---> formContainer
        if(!formContainer.classList.contains("active")){ 
            userInfoCont.classList.remove("active");
        grantUsrContainer.classList.remove("active") ;
        console.log('grantUsrContainer', grantUsrContainer.classList.contains("active"));
        console.log('formContainer', formContainer.classList.contains("active"));
            formContainer.classList.add("active");
            console.log('formContainer', formContainer.classList.contains("active"));

        }
        else{
            // from search tab(formContainer)-> user tab(userInfoCont)
            formContainer.classList.remove("active");
            console.log('formContainer', formContainer.classList.contains("active"));

            userInfoCont.classList.remove("active");
            // formContainer.classList.add("active");
            // grantUsrContainer.classList.remove("active");
            
            getFromSessionStorage();

        }
    }

}

UserTab.addEventListener("click",()=>{
    // by click you go on user tab
    switchTab(UserTab); 
});

SearchTab.addEventListener("click",()=>{
    // by click you go on search tab
    switchTab(SearchTab);
});



// if coordination are already stored 
function getFromSessionStorage(){
     const localCoordinates =sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
    //   if local coordinates are not present 
    grantUsrContainer.classList.add("active");
    console.log('grantUsrContainer', grantUsrContainer.classList.contains("active"));
    }
    else{
        const coordinates= JSON.parse(localCoordinates);
        fetchUserCoordinates(coordinates);
    }
}

async function fetchUserCoordinates(coordinates){
    const {lat,lon}=coordinates;
    grantUsrContainer.classList.remove("active");
    loadingContainer.classList.add('active');

    // api call
    try{
        
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}`);
        const data=await response.json();
        loadingContainer.classList.remove('active');
        
        userInfoCont.classList.add("active");
        renderData(data);
        console.log('api responce data ',data);

    }
        catch(err){
            loadingContainer.classList.remove('active');
            // console.log(Error);
            // let newDiv=document.createElement('div');
            // newDiv.innerHTML=<img src="not-found.png" alt="image is not available" width="20" height="20" loading="lazy"/>;
        }
    

}

function renderData(data){
    cityName.innerText=data?.name;
    let code=data?.sys?.country.toLowerCase();
    CountryFlag.src=`https://flagcdn.com/48x36/${code}.png`;
    weatherDetail.innerText=data?.weather?.[0]?.description;
    let iconcode=data?.weather?.[0]?.icon;
    weatherIcon.src=`http://openweathermap.org/img/w/${iconcode}.png`;
    tempratureDet.innerText=data?.main?.temp+'°C';
    windSpeed.innerText=data?.wind?.speed+'%';
    humidity.innerText=data?.main?.humidity+'%';
    clouds.innerText=data?.clouds?.all+'%';

}




function getGeoLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showCurentLocation);
    }
    else{
        console.log("no geolaction support");
    }
}


function showCurentLocation(position){
    const userCoordinates={
        lon: position.coords.longitude,
    lat: position.coords.latitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserCoordinates(userCoordinates);
    
}  

grantAccessButton.addEventListener('click',(getGeoLocation));

searchButton.addEventListener('click',(e)=>{

    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else{
        fetchCityInfo(cityName);
    }
});
 

async function fetchCityInfo(city){
    loadingContainer.classList.add("active");
    userInfoCont.classList.remove("active");
    grantUsrContainer.classList.remove("active");

    try{
        
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}`);
        const data=await response.json();
        loadingContainer.classList.remove('active');
        userInfoCont.classList.add("active");
        renderData(data);
        console.log('api responce data from search',data);

    }
        catch(err){
            loadingContainer.classList.remove('active');
            console.log(Error);
            // let newDiv=document.createElement('div');
            // newDiv.innerHTML=<img src="not-found.png" alt="image is not available" width="20" height="20" loading="lazy"/>;
        }

    
}