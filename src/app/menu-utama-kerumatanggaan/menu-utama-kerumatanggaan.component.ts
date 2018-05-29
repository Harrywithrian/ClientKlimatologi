import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-menu-utama-kerumatanggaan',
  templateUrl: './menu-utama-kerumatanggaan.component.html',
  styleUrls: ['./menu-utama-kerumatanggaan.component.css'],
})
export class MenuUtamaKerumatanggaanComponent implements OnInit {

  //variable
  kode;
  dataCuaca:any = {};
  menit;
  jam;
  tanggal;
  bulan;
  tahun;
  blnstr;

  constructor(private http:HttpClient, private cookieService: CookieService, private router:Router) { }

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  ngOnInit() {

    //redirect to login
    if (localStorage.getItem('nip') == null) {
      this.router.navigateByUrl('/login');
    }

    //tampil data cuaca
    this.http.get(this.link + '/klimaservice/public/api/cuaca').subscribe((data)=>{
      this.kode = data[0].kd_klimatologi;
      this.setTanggal(this.kode);
      this.dataCuaca = data[0];
    });

    //interval tampil data cuaca
    setInterval(() => {
      this.http.get(this.link + '/klimaservice/public/api/cuaca').subscribe((data)=>{
        this.kode = data[0].kd_klimatologi;
        this.setTanggal(this.kode);
        this.dataCuaca = data[0];
      });
    },60000);

  }

  //setting tanggal
  setTanggal(kode){

    this.menit = kode.substring(10 , 12);
    this.jam = kode.substring(8 , 10);
    this.tanggal = kode.substring(6 , 8);
    this.bulan = kode.substring(4 , 6);
    this.tahun = kode.substring(0 , 4);

    switch (this.bulan) {
      case "01":
        this.blnstr = 'Januari';
        break;
      case "02":
        this.blnstr = 'Februari';
        break;
      case "03":
        this.blnstr = 'Maret';
        break;
      case "04":
        this.blnstr = 'April';
        break;
      case "05":
        this.blnstr = 'Mei';
        break;
      case "06":
        this.blnstr = 'Juni';
        break;
      case "07":
        this.blnstr = 'Juli';
        break;
      case "08":
        this.blnstr = 'Agustus';
        break;
      case "09":
        this.blnstr = 'September';
        break;
      case "10":
        this.blnstr = 'Oktober';
        break;
      case "11":
        this.blnstr = 'November';
        break;
      case "12":
        this.blnstr = 'Desember';
        break;
    }
  };

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
