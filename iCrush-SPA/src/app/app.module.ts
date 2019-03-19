//#region '@angular and 3rd party libs'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import {TimeAgoPipe} from 'time-ago-pipe';
import {NgxAutoScrollModule} from 'ngx-auto-scroll';
//#endregion

//#region 'Material Modules'
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import 'hammerjs';
//#endregion

//#region 'Services'
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import { UserService } from './_services/user.service';
import { SignalrService } from './_services/signalr.service';
//#endregion

import { ErrorInterceptorProvider } from './_services/error.interceptor';

//#region 'Components'
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { MemberListFiltersComponent } from './members/member-list-filters/member-list-filters.component';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
//#endregion

//#region 'Routes and RouteGuards'
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
//#endregion

//#region 'Route Resolver'
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolver/lists.resolver';
import { MessagesResolver } from './_resolver/messages.resolver';
//#endregion

export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      TimeAgoPipe,
      MemberListFiltersComponent,
      MemberMessagesComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      MatIconModule,
      MatToolbarModule,
      MatListModule,
      MatFormFieldModule,
      MatButtonModule,
      MatInputModule,
      MatMenuModule,
      MatCardModule,
      MatTabsModule,
      MatRadioModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatSelectModule,
      MatPaginatorModule,
      MatButtonToggleModule,
      MatTooltipModule,
      MatTableModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(appRoutes),
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000', 'localhost:5000/message'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      }),
      NgxGalleryModule,
      FileUploadModule,
      NgxAutoScrollModule
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      UserService,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChanges,
      ListsResolver,
      MessagesResolver,
      SignalrService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
