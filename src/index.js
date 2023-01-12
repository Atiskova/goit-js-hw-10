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

  fetchCountries(searchedQuery)
    .then(data => {
      const amount = data.length;

      if (amount > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (amount >= 2 && amount <= 10) {
        createCountryList(data);
      } else if (amount === 1) {
        createCountryCard(data[0]);
      }
    })
    .catch(err => {
      switch (err.message) {
        case '404': {
          Notify.failure('Oops, there is no country with that name');
          break;
        }
      }
    });
};

function createCountryList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li class="country-list-item">
      <img src="${flags.svg}" alt="flag" width="30px">
      <p>${name.official}</p>
    </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function createCountryCard(data) {
  const markup = `<ul>
      <li class="country-list-item">
      <img src="${data.flags.svg}" alt="flag" width="30px">
      <p>${data.name.official}</p>
      </li>
      <li><p class="country-list-text">Capital: ${data.capital}</p></li>
      <li><p class="country-list-text">Population: ${data.population}</p></li>
      <li><p class="country-list-text">Languages: ${Object.values(
        data.languages
      ).join(', ')}</p></li>
    </ul>`;
  countryInfo.innerHTML = markup;
}

searchInput.addEventListener('input', debounce(onCountryFormInput, DEBOUNCE_DELAY));
