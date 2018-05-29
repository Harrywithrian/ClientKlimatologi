import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';

//halaman
import { LoginComponent } from './login/login.component';
import { MenuUtamaGuruComponent } from './menu-utama-guru/menu-utama-guru.component';
import { MenuUtamaSiswaComponent } from './menu-utama-siswa/menu-utama-siswa.component';
import { MenuUtamaKerumatanggaanComponent } from './menu-utama-kerumatanggaan/menu-utama-kerumatanggaan.component';
import { MenuUtamaPdeComponent } from './menu-utama-pde/menu-utama-pde.component';
import { BerandaComponent } from './beranda/beranda.component';
import { IklimComponent } from './iklim/iklim.component';
import { KelompokGuruComponent } from './kelompok-guru/kelompok-guru.component';
import { DetailKelompokGuruComponent } from './detail-kelompok-guru/detail-kelompok-guru.component';
import { KelompokSiswaComponent } from './kelompok-siswa/kelompok-siswa.component';
import { DetailKelompokSiswaComponent } from './detail-kelompok-siswa/detail-kelompok-siswa.component';
import { KelolaSiswaComponent } from './kelola-siswa/kelola-siswa.component';
import { KelolaGuruComponent } from './kelola-guru/kelola-guru.component';
import { KelolaTanamanComponent } from './kelola-tanaman/kelola-tanaman.component';
import { UbahPasswordComponent } from './ubah-password/ubah-password.component';



const appRoutes: Routes = [
  //halaman awal
	{
		path: '',
		component: LoginComponent
	},
  //path guru pde
  {
    path: 'menu_utama_pde',
    component: MenuUtamaPdeComponent,
    children: [
      {
        path: 'kelolaSiswa',
        component: KelolaSiswaComponent
      },
      {
        path: 'kelolaGuru',
        component: KelolaGuruComponent
      },
      {
        path: 'ubahPassword',
        component: UbahPasswordComponent
      }
    ]
  },
  //path guru kerumahtanggaan
  {
    path: 'menu_utama_kerumahtanggaan',
    component: MenuUtamaKerumatanggaanComponent,
    children: [
      {
        path: 'beranda',
        component: BerandaComponent
      },
      {
        path: 'iklim',
        component: IklimComponent
      },
      {
        path: 'kelolaTanaman',
        component: KelolaTanamanComponent
      },
      {
        path: 'ubahPassword',
        component: UbahPasswordComponent
      }
    ]
  },
  //path guru
  {
    path: 'menu_utama_guru',
    component: MenuUtamaGuruComponent,
    children: [
      {
        path: 'beranda',
        component: BerandaComponent
      },
      {
        path: 'iklim',
        component: IklimComponent
      },
      {
        path: 'swakaryaGuru',
        component: KelompokGuruComponent
      },
      {
        path: 'detailSwakaryaGuru/:kd_kelompok',
        component: DetailKelompokGuruComponent
      },
      {
        path: 'ubahPassword',
        component: UbahPasswordComponent
      }

    ]
  },
  //path siswa
  {
    path: 'menu_utama_siswa',
    component: MenuUtamaSiswaComponent,
    children: [
      {
        path: 'beranda',
        component: BerandaComponent
      },
      {
        path: 'iklim',
        component: IklimComponent
      },
      {
        path: 'swakaryaSiswa',
        component: KelompokSiswaComponent
      },
      {
        path: 'detailSwakaryaSiswa/:kd_kelompok',
        component: DetailKelompokSiswaComponent
      },
      {
        path: 'ubahPassword',
        component: UbahPasswordComponent
      }
    ]
  },
  //logout
  {
    path: 'login', 
    redirectTo: ''
  },
  //link asal
	{
		path: '**', 
		redirectTo: ''
	}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuUtamaGuruComponent,
    MenuUtamaSiswaComponent,
    MenuUtamaKerumatanggaanComponent,
    MenuUtamaPdeComponent,
    IklimComponent,
    KelolaSiswaComponent,
    KelolaGuruComponent,
    DetailKelompokGuruComponent,
    KelompokGuruComponent,
    KelompokSiswaComponent,
    DetailKelompokSiswaComponent,
    UbahPasswordComponent,
    KelolaTanamanComponent,
    BerandaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
    	appRoutes,
    	{ enableTracing: false }
    ),
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
