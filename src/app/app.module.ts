import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from "@angular/common/http";
import { AgGridModule }            from "ag-grid-angular";

import { AppRoutingModule }    from './app-routing.module';
import { AppComponent }        from './app.component';
import { MatCheckbox }         from "./mat.checkbox";
import { MatCheckboxModule }                from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule }                  from "@angular/material/button";
import { MatIconModule }       from "@angular/material/icon";
import { MatSelectModule }     from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatInputModule }      from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    MatCheckbox,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AgGridModule.withComponents([MatCheckbox]),
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
