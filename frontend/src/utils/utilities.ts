import type { UrlParams } from 'src/settings/types';

function getOrderToken(): string | null {
  return sessionStorage.getItem('orderToken');
}

function getUrlParams(): UrlParams {
  const urlParams = new URLSearchParams(window.location.search);
  const params: UrlParams = {};
  const countryParam = urlParams.get('country');

  if (countryParam !== null) {
    params.country = countryParam;
  }

  return params;
}

export { getOrderToken, getUrlParams };
