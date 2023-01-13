import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const onCountryFormInput = event => {
  const searchedQuery = searchInput.value.trim();

  if (!searchedQuery) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

   fetchCountries(searchedQuery).then(data => {
    
    if (data.length > 10) {
      countryInfo.innerHTML = '';
    countryList.innerHTML = '';
      Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (data.length >= 2 && data.length <= 10) {
      createCountryList(data);
      countryInfo.innerHTML = '';
    } else if (data.length === 1) {
      createCountryCard(data[0]);
      countryList.innerHTML = '';
    }
  })
  .catch(err => {
    switch (err.message) {
      case '404': {
        Notify.failure("Oops, there is no country with that name");
        break;
      }
    }
  })
};  

function createCountryList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li class="country-list-item">
      <img src="${flags.svg}" alt="flag" height="15px">
      <p>${name}</p>
    </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function createCountryCard(data) {

  const markup = `
      <div class="country-list-item">
      <img src="${data.flags.svg}" alt="flag" height="15px">
      <h1>${data.name}</h1>
      </div>
      <ul class="country-list">
      <li><p class="country-list-text"><b>Capital</b>: ${data.capital}</p></li>
      <li><p class="country-list-text"><b>Population</b>: ${data.population}</p></li>
      <li><p class="country-list-text"><b>Languages</b>: ${Object.values(data.languages)
        .map(el => el.name)
        .join(', ')}</p></li> 
    </ul>`;
  countryInfo.innerHTML = markup;
}

searchInput.addEventListener(
  'input',
  debounce(onCountryFormInput, DEBOUNCE_DELAY)
);
