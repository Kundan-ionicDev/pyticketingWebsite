import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { EventsComponent, EventTicketDialog } from './pages/events/events.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactusComponent } from './pages/contactus/contactus.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
// import { QRCodeModule } from 'angularx-qrcode';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';    
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhoneMaskDirective } from './PhoneMaskDirective'; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventsComponent,
    AboutComponent,
    ContactusComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    SettingsComponent,
    PageNotFoundComponent,
    EventTicketDialog,
    PhoneMaskDirective
  ],

  entryComponents: [
    EventTicketDialog
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxQRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
