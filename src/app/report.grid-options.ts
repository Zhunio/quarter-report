import { GridOptions, GridReadyEvent } from "ag-grid-community";
import { currencyGetter }              from "./value-getters";

export function reportGridOptions(quarter): GridOptions {
  return {
    onGridReady(event: GridReadyEvent) {
      event.api.sizeColumnsToFit();
    },

    columnDefs: [
      { headerName: 'Data', field: 'data' },
      ...Object.keys(quarter).map(month => ({
        headerName: month, field: month, valueGetter: currencyGetter
      })),
      { headerName: 'Total', field: 'total', valueGetter: currencyGetter }
    ]
  }

}
