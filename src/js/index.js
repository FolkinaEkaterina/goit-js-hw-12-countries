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
  const searchQuery = refs.inputForm.value;

  if (!refs.inputForm.value) return markupList(0);

  if (!refs.inputForm.value.match(/^[a-zA-Z,() ']*$/)) {
    markupList(0);
    return errorMessage('Use latinica (a-z)');
  }

  API.fetchCountries(searchQuery).then(searchCountry).catch(onFetchError);
}

function searchCountry(country) {
  let countryList = country.length;

  if (countryList === 1) {
    markupList(countryCard(country[0]));
  } else if (countryList > 2 && countryList <= 10) {
    markupList(countriesList(country));
  } else if (countryList > 10) {
    markupList(0);
    return errorMessage('Too many matches found. Please enter a more specific query!');
  }
}

function markupList(markup) {
  if (markup) {
    refs.cardContainer.innerHTML = markup;
  } else {
    return (refs.cardContainer.innerHTML = '');
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
