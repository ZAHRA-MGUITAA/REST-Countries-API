const api_url = "https://restcountries.com/v3.1/all";


function getData() {
  axios({
    method: "get",
    url: api_url,
    timeout: 5000,
  })
    .then((res) => displayCountries(res))
    .catch((err) => console.error(err));
}

function searchData(name) {
  let countries = document.querySelectorAll(".country .country-name");
  Array.from(countries).filter((item) =>
    item.innerHTML.toLocaleLowerCase().includes(name.value.toLocaleLowerCase())
      ? (item.parentNode.parentNode.style.display = "flex")
      : (item.parentNode.parentNode.style.display = "none")
  );
}
axios
  .get(api_url + "/limit", {
    ValidateStatus: function (status) {
      return status < 500;
    },
  })
  .then((res) => console.log(res))
  .catch((err) => {
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      //request was made but no response
      console.error(err.request);
    }
  });


function displayCountries(res) {
  let countries = document.querySelector(".countries");
  res.data.forEach((element) => {
    let elementhtml = `<a class="country" href="single-country.html?${element.name.common}">
          <img src="${element.flags.png}" alt="">
          <div class="country-infos">
          <h6 class="country-name"> ${element.name.common}</h6>
          <div class="population">
              <p>population: </p>
              <p> ${element.population}</p>
          </div>
          <div class="region">
              <p>region: </p>
              <p>${element.region}</p>
          </div> <div class="capital">
              <p>capital: </p>
              <p> ${element.capital}</p>
          </div>
          </div>
      </a>`;
    countries.insertAdjacentHTML("beforeEnd", elementhtml);

  });
}
getData();
document.querySelector(".search input").addEventListener("keyup", () => {
  searchData(document.querySelector(".search input"));
});

axios({
  method: "get",
  url: "https://restcountries.com/v3.1/all?fields=region",
}).then((res) => addFilter(res));

function addFilter(res) {
  let filter = document.querySelector("#filterByRegion");
  let region = [];
  Array.from(res.data).map((element) => {
    if (!region.includes(element.region)) {
      let opt = document.createElement("option");
      opt.value = element.region;
      opt.text = element.region;
      filter.appendChild(opt);
      region.push(element.region);
    }
  });
}


function filterByRegion() {
  let filter = document.querySelector("#filterByRegion");
  let selectedoption = filter.options[filter.selectedIndex];
  Array.from(
    document.querySelectorAll(".country .country-infos .region p:nth-child(2)")
  ).filter(
    (
      region
    ) =>
      region.innerHTML.toLocaleLowerCase() ==
      selectedoption.innerHTML.toLocaleLowerCase()
        ? (region.parentNode.parentNode.parentNode.style.display = "flex")
        : (region.parentNode.parentNode.parentNode.style.display = "none")
  );
}

document
  .querySelector("#filterByRegion")
  .addEventListener("change", filterByRegion);



function getCountryInfo(){
  console.log(window.location.search.replace('?',''));
  let countryname = window.location.search.replace('?','');
    axios({
    method : "get",
    url : `https://restcountries.com/v3.1/name/${countryname}`
  }).then(res => displayCountryInfo(res)).catch(err => console.error(err));


}

function displayCountryInfo(res){
console.log(res.data[0]);
let image = document.createElement('img');
image.src = res.data[0].flags.png;
document.querySelector('.flag').appendChild(image);
document.querySelector('.name').innerHTML = res.data[0].name.common;
document.querySelector('#nativename>span').innerHTML = res.data[0].name.common;
document.querySelector('#population>span').innerHTML = res.data[0].population;
document.querySelector('#population>span').innerHTML = res.data[0].population;
document.querySelector('#region>span').innerHTML = res.data[0].region;
document.querySelector('#subregion>span').innerHTML = res.data[0].subregion;
document.querySelector('#capital>span').innerHTML = res.data[0].capital;
document.querySelector('#domain>span').innerHTML = res.data[0].tld;
document.querySelector('#currencies>span').innerHTML = Object.values(res.data[0].currencies)[0].name;
document.querySelector('#Language>span').innerHTML = Object.values(res.data[0].languages).splice(',');

Object.values(res.data[0].borders).forEach(element=>{
  axios({
    method : "get",
    url: `https://restcountries.com/v3.1/alpha/${element}`
  }).then(res => {
    let p = document.createElement('p');
    p.innerHTML = res.data[0].name.common;
    document.querySelector('.borders-countries').appendChild(p);
  });

})
}

function goBack(){
  window.history.back();
}