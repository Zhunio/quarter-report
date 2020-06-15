import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ExcelService } from "./excel.service";
import { excelGridOptions } from "./excel.grid-options";
import { reportGridOptions } from "./report.grid-options";
import { AgGridAngular } from "ag-grid-angular";
import * as printJS from 'print-js';
import { getCurrency, getDate } from "./value-getters";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { FormControl } from "@angular/forms";

declare var currency;

export const MY_FORMATS = {
  display: {
    dateInput: 'YYYY',
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AppComponent {

  @ViewChildren('monthGrids') monthGrids: QueryList<AgGridAngular>;

  @ViewChild('report') report: AgGridAngular;
  @ViewChild('noPrint') noPrint: ElementRef<HTMLDivElement>;
  @ViewChild('print') print: ElementRef<HTMLDivElement>;

  quarter$;
  monthGridOptions = excelGridOptions

  printMonthRows;
  printReportRows;

  date = new FormControl(moment());

  quarters: any[] = [
    { value: '1', viewValue: '1st Quarter' },
    { value: '2', viewValue: '2nd Quarter' },
    { value: '3', viewValue: '3rd Quarter' },
    { value: '4', viewValue: '4th Quarter' },
  ];
  quarter;

  constructor(private excel: ExcelService) {
  }

  onChosenYear(normalizedYear, datepicker) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.onQuarterSelect();
    datepicker.close();
  }

  onQuarterSelect() {
    if (this.quarter) {
      this.quarter$ = this.excel.getQuarter(this.date.value.year(), this.quarter)
    }
  }

  onPrint() {
    this.printMonthRows = [];
    this.printReportRows = [];

    const push = (grid: AgGridAngular, array) => {
      grid.api.forEachNode(n => array.push(Object.assign({}, n.data)))
    }

    this.monthGrids.forEach(g => push(g, this.printMonthRows));
    push(this.report, this.printReportRows);

    this.printMonthRows.forEach(row => {
      row.date = getDate(row.date);
      row.amount = getCurrency(row.amount).format();
      row.price = getCurrency(row.price).format();
      row.tax = getCurrency(row.tax).format();
    });

    this.printReportRows.forEach(row => {
      Object.keys(row)
        .filter(c => c !== 'data')
        .forEach(c => row[c] = getCurrency(row[c]).format())
    });

    onbeforeprint = _ => {
      this.noPrint.nativeElement.style.opacity = '0';

      this.print.nativeElement.style.opacity = '1';
      this.print.nativeElement.style.height = '100%';
    }

    const backToNormal = () => {
      this.noPrint.nativeElement.style.opacity = '1';

      this.print.nativeElement.style.opacity = '0';
      this.print.nativeElement.style.height = '0';
    }

    setTimeout(_ => {
      backToNormal()
      printJS('print', 'html');
    }, 500)
  }


  months(quarter) {
    return Object.keys(quarter);
  }

  rowDataMonth(quarter, month) {
    return quarter[month];
  }

  onCellValueChanged(quarter) {
    this.report.api.setRowData(this.getReportRowData(quarter));
  }

  reportGridOptions(quarter) {
    return reportGridOptions(quarter);
  }

  getReportRowData(quarter) {
    const taxable = {};
    const nonTaxable = {};
    const netTaxable = {};

    const rowData = [
      taxable,
      nonTaxable,
      netTaxable
    ]

    Object.keys(quarter).forEach(month => {
      taxable[month] = this.taxableAccumulator(quarter, month)
      nonTaxable[month] = this.nonTaxableAccumulator(quarter, month);
      netTaxable[month] = taxable[month] - nonTaxable[month];
    });

    rowData.forEach(row => row['total'] = this.totalAccumulator(row));

    rowData[0]['data'] = 'Taxable Sales';
    rowData[1]['data'] = 'Non Taxable Sales';
    rowData[2]['data'] = 'Net Taxable Sales';

    return rowData
  }

  taxableAccumulator(quarter, month) {
    return quarter[month]
      .map(m => m.price)
      .reduce((a, v) => currency(a).add(v).value, 0)
  }

  nonTaxableAccumulator(quarter, month) {
    return quarter[month]
      .filter(m => m.taxExempt)
      .map(m => m.price)
      .reduce((a, v) => currency(a).add(v).value, 0)
  }

  totalAccumulator(row) {
    return Object.values(row).reduce((a, v) => currency(a).add(v).value, 0);
  }
}
