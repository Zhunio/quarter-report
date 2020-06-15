import { Component }                from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { getPrice, getTax }         from "./value-getters";

@Component({
  selector: "checkbox-cell",
  template: `
    <mat-checkbox [ngModel]="checked" (ngModelChange)="onChange($event)"></mat-checkbox>
  `,
  styles: [
      `
      ::ng-deep .mat-checkbox-layout {
        /* horizontally align the checkbox */
        width: 100%;
        display: inline-block !important;
        text-align: center;
        margin-top: -4px; /* to offset the cells internal padding - could be done in cells CSS instead*/
      }
    `
  ]
})
export class MatCheckbox implements ICellRendererAngularComp {

  checked;
  params;

  agInit(params) {
    this.params = params;
    this.checked = params.value;
  }

  onChange(checked) {
    this.checked = checked;
    this.params.setValue(checked);

    const data = this.params.data;

    data['price'] = getPrice(data['amount'], data['taxExempt'])
    data['tax'] = getTax(data['price'], data['taxExempt'])
  }

  refresh(params) {
    return false;
  }
}
