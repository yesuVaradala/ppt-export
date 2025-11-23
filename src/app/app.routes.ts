import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExportDemoComponent } from './components/export-demo/export-demo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'export-demo', component: ExportDemoComponent },
  { path: '**', redirectTo: '' }
];
