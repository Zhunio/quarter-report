import { currencyGetter, dateGetter, priceGetter, taxGetter } from "src/app/value-getters";
import { MatCheckbox }                                        from "src/app/mat.checkbox";
import { GridOptions, GridReadyEvent }                        from "ag-grid-community";

export const excelGridOptions: GridOptions = {

  onGridReady(event: GridReadyEvent) {
    event.api.sizeColumnsToFit();
  },

  columnDefs: [
    // { headerName: 'Type', field: 'type' },
    { headerName: 'Date', field: 'date', valueGetter: dateGetter },
    // { headerName: 'Number', field: 'number' },
    { headerName: 'Name', field: 'name' },
    // { headerName: 'Payment Method', field: 'paymentMethod' },

    { headerName: 'Amount', field: 'amount', valueGetter: currencyGetter },
    { headerName: 'Price', field: 'price', valueGetter: priceGetter },
    { headerName: 'Tax', field: 'tax', valueGetter: taxGetter },
    { headerName: 'Tax Exempt', field: 'taxExempt', cellRenderer: 'checkboxRenderer' },
  ],

  frameworkComponents: {
    checkboxRenderer: MatCheckbox,
  }
}
