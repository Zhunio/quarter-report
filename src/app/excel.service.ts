import { Injectable }       from "@angular/core";
import { HttpClient }       from "@angular/common/http";
import { map, switchMap }   from "rxjs/operators";
import * as moment          from "moment";
import { schema }           from "src/app/excel.schema";
import { forkJoin }         from "rxjs";
import { getPrice, getTax } from "./value-getters";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private http: HttpClient) {
  }

  getExcelFile(year, quarter) {
    return this.http.get(`assets/reports/${ year }/quarter/${ quarter }/report.xlsx`, { responseType: 'blob' });
  }

  readExcelFile(year, quarter) {
    return this.getExcelFile(year, quarter).pipe(
      switchMap<File, any>(file =>
        // @ts-ignore
        readXlsxFile(file, { schema })
      ),
    )
  }

  getQuarter(year, quarter) {
    return forkJoin([
      this.readExcelFile(year, quarter),
      this.getTaxExempt(year, quarter)
    ]).pipe(map(([data, taxExemptList]) => {
      const quarterObj = {};

      const rows = (data as any).rows.filter(row => this.isValid(row));

      rows.forEach(row => quarterObj[this.month(row)] = []);
      rows.forEach(row => quarterObj[this.month(row)].push(row));
      rows.forEach(row => row['taxExempt'] = (taxExemptList as String[]).includes(row['name']))

      rows.forEach(row => {
        row['price'] = getPrice(row['amount'], row['taxExempt'])
        row['tax'] = getTax(row['price'], row['taxExempt'])
      })

      return quarterObj;
    }))
  }

  getTaxExempt(year, quarter) {
    return this.http.get(`assets/reports/${ year }/quarter/${ quarter }/tax-exempt.json`);
  }

  private month(row) {
    return moment(row.date, 'MM/DD/YYYY').format('MMMM')
  }

  private isValid(row) {
    return moment(row.date, 'MM/DD/YYYY').isValid()
  }
}
