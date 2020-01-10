import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { EventsComponent } from './pages/events/events.component';
import { ContactusComponent } from './pages/contactus/contactus.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { TermsconditionComponent } from './pages/termscondition/termscondition.component';


const routes: Routes = 
[
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'events/:id/:name', component: EventsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactusComponent },
  { path: 'termscondition', component: TermsconditionComponent, pathMatch: 'full' },
  { path: 'privacypolicy', component: PrivacypolicyComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
