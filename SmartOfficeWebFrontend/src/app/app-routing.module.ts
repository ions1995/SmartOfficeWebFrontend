import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from './resolver/data-resolver.service';

const routes: Routes = [
  //{ path: '', redirectTo: 'home', pathMatch: 'full' }
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'create-meeting', loadChildren: './create-meeting/create-meeting.module#CreateMeetingPageModule' },
  {
    path: 'create-meeting/:id',
    resolve: {
      special: DataResolverService
    },
    loadChildren: './create-meeting/create-meeting.module#CreateMeetingPageModule'
  },
  { path: 'meeting-details', loadChildren: './meeting-details/meeting-details.module#MeetingDetailsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'userdetails', loadChildren: './userdetails/userdetails.module#UserdetailsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
