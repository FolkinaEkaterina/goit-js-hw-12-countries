import debounce from 'lodash.debounce';
import '../sass/main.scss';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import API from './fetchCountries';
import getRefs from './get-refs';
import countriesList from '../templates/countries-list.hbs';
import countryCard from '../templates/country-card.hbs';

const refs = getRefs();

refs.inputForm.addEventListener('input', debounce(onInputForm, 500));

function onInputForm() {
  let searchQuery = refs.inputForm.value.trim();
  if (!searchQuery) {
    refs.cardContainer.innerHTML = '';
    errorMessage('Error. Remove the space. Enter value');
    return;
  }

  if (!refs.inputForm.value.match(/^[a-zA-Z,() ']*$/)) {
    return errorMessage('Use latinica (a-z)');
  }

  API.fetchCountries(searchQuery).then(searchCountry).catch(onFetchError);
}

function searchCountry(country) {
  let countryList = country.length;

  if (countryList === 1) {
    refs.cardContainer.innerHTML = countryCard(...country);
  } else if (countryList > 2 && countryList <= 10) {
    refs.cardContainer.innerHTML = countriesList(country);
  } else if (countryList > 10) {
    return errorMessage('Too many matches found. Please enter a more specific query!');
  }
}

function onFetchError() {
  alert('Oops, there was an error');
}

function errorMessage(message) {
  return error({
    title: false,
    text: message,
    shadow: true,
    sticker: false,
    delay: 2000,
  });
}
