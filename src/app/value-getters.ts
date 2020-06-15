import { ValueGetterParams } from 'ag-grid-community';
import * as moment           from 'moment';

declare var currency;

export function dateGetter(params: ValueGetterParams) {
  return getDate(getCellValue(params));
}

export function getDate(value) {
  return value
    ? moment(value).format('MMM DD, YYYY')
    : value;
}

export function currencyGetter(params: ValueGetterParams) {
  return getCurrency(getCellValue(params)).format();
}

export function priceGetter(params: ValueGetterParams) {
  const taxExempt = params.getValue('taxExempt');
  const amount = params.getValue('amount');

  return getCurrency(getPrice(amount, taxExempt)).format();
}

export function taxGetter(params: ValueGetterParams) {
  const taxExempt = params.getValue('taxExempt');
  const price = params.getValue('price');

  return getCurrency(getTax(price, taxExempt)).format();
}

function getCellValue(params: ValueGetterParams) {
  const colID = params.column.getColId();
  const value = params.data[colID];

  return value;
}

export function getCurrency(amount) {
  return currency(amount, { formatWithSymbol: true });
}

export function getPrice(amount, taxExempt) {
  return taxExempt
    ? getCurrency(amount).value
    : getCurrency(amount).divide(1 + .08125).value;
}

export function getTax(price, taxExempt) {
  return taxExempt
    ? getCurrency(0).value
    : getCurrency(price).multiply(.08125).value;
}
