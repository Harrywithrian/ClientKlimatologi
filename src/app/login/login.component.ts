import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

title = 'app';

  //deklarasi variable program
  self = this;

  //deklariasi variable cuaca
  dataCuaca:any = {};
  kode;
  tanggal;
  bulan;
  blnstr;
  tahun;
  jam;
  menit;

  //deklarasi variable login
  no_induk : string;
  password : string;
  errorLogin;

  //deklarasi show/hide
  showValidasi = true;

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService){};

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable simpan eksekusi jquery saat aplikasi mulai dibuka
  ngOnInit(){

    //validasi modal
    $('#modalLogin').modal({detachable:false});

    // tampil data cuaca
    this.http.get(this.link + '/klimaservice/public/api/cuaca').subscribe((data)=>{

      this.kode = data[0].kd_klimatologi;
      this.setTanggal(this.kode);

      this.dataCuaca = data[0];
    });

    //tampil setiap 1 menit
    setInterval(() => {
      this.http.get(this.link + '/klimaservice/public/api/cuaca').subscribe((data)=>{
        this.kode = data[0].kd_klimatologi;
        this.setTanggal(this.kode);
        this.dataCuaca = data[0];
      });
    }, 60000);
    
  };

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

  //tampil modal
  openModal() {

  	$('#modalLogin').modal('show');
    this.showValidasi = true;
    
    //reset form login
    this.errorLogin = "";
    this.no_induk = "";
    this.password = "";
  };

  login() {
    //ambil data form login
    var value = $('#login-form').form('get values');

    //simpan data value
    var data = {
      no_induk:value.no_induk,
      password:value.password
    }

    //post data
    this.http.post(this.link + '/klimaservice/public/api/login', data).subscribe((data)=>{
      
      //validasi login
      //login berhasil
      if (data['validasi'] == true) {

        //reset form login
        this.errorLogin = "";
        this.no_induk = "";
        this.password = "";

        //simpan status user
        var statusUser = data['message'][0]['status'];

        //simpan data nip pada cookie
        if (statusUser == "guru" || statusUser == "pengelola" || statusUser == "kerumahtanggaan") {
          localStorage.setItem( 'nip', data['message'][0]['no_induk'] );
        }

        //simpan data nis pada cookie
        if (statusUser == "siswa") {
          localStorage.setItem( 'nis', data['message'][0]['no_induk'] );
        }

        //simpan data pada cookie
        localStorage.setItem( 'nama', data['message'][0]['nama'] );
        localStorage.setItem( 'status', data['message'][0]['status'] );
        localStorage.setItem( 'password', data['message'][0]['password'] );

        //arahkan pada halaman utama
        switch (statusUser) {
          case "guru":
            $('.tiny.modal').modal('hide');
            this.router.navigateByUrl('/menu_utama_guru/beranda');
            break;
          case "pengelola":
            $('.tiny.modal').modal('hide');
            this.router.navigateByUrl('/menu_utama_pde/kelolaSiswa');
            break;
          case "kerumahtanggaan":
            $('.tiny.modal').modal('hide');
            this.router.navigateByUrl('/menu_utama_kerumahtanggaan/beranda');
            break;
          case "siswa":
            $('.tiny.modal').modal('hide');
            this.router.navigateByUrl('/menu_utama_siswa/beranda');
            break;
        }
      }

      //validasi password kosong
      else if (value.password == "" && value.no_induk == "") {
        this.showValidasi = false;
        this.errorLogin = "Field Login Tidak Boleh Kosong!";
      }
      //validasi username kosong
      else if (value.no_induk == "") {
        this.showValidasi = false;
        this.errorLogin = "Field Nomor Induk Tidak Boleh Kosong!";
      }
      //validasi password kosong
      else if (value.password == "") {
        this.showValidasi = false;
        this.errorLogin = "Field Password Tidak Boleh Kosong!";
      }
      else {
        //username atau password salah
        this.showValidasi = false;
        this.errorLogin = "Username Atau Password Salah!";
        this.password = "";
      }
    });
  }

}
