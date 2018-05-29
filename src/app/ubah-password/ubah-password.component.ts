import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//jquery
declare var $:any;

@Component({
  selector: 'app-ubah-password',
  templateUrl: './ubah-password.component.html',
  styleUrls: ['./ubah-password.component.css']
})
export class UbahPasswordComponent implements OnInit {

	//link
    link = 'http://localhost:80/Skripsi';
    // link = 'http://klimatologi.online';

	//variable cookie
	passwordCookie	= localStorage.getItem('password');
	statusCookie	= localStorage.getItem('status');

	//variable validasi
	errorUbah;
	berhasilUbah;
  passwordLama;
  passwordBaru;
  verifikasi;

	//show hide validasi
	showValGagalUbah	= true;
	showValBerhasilUbah	= true;

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService) { }

  ngOnInit() {
  }

  //method ubah password
  ubahPassword(){

  	//ambil data form ubah password
    var value = $('#formUbahPass').form('get values');
    var data;

    //validasi form kosong
    if (value.passwordLama == "" || value.passwordBaru == "" || value.verifikasi == "") {

    	if (this.showValGagalUbah == true) {
        	$('#valUbahGagal').transition('fade');
      	}
      	this.showValGagalUbah = false;
      	this.errorUbah = "Field Tidak Boleh Kosong!";

    }

    //validasi password lama tidak sesuai
    else if (value.passwordLama != this.passwordCookie) {

   		if (this.showValGagalUbah == true) {
        	$('#valUbahGagal').transition('fade');
      	}
      	this.showValGagalUbah = false;
      	this.errorUbah = "Password Lama Tidak Sesuai!";
      	$('#formUbahPass').form('clear');

    }

    //validasi verifikasi password tidak sama
    else if (value.passwordBaru != value.verifikasi) {

   		if (this.showValGagalUbah == true) {
        	$('#valUbahGagal').transition('fade');
      	}
      	this.showValGagalUbah = false;
      	this.errorUbah = "Verifikasi Password Tidak Sesuai Dengan Password Baru!";
      	$('#formUbahPass').form('clear'); 

    }

    //password tidak berubah
    else if (value.passwordBaru == value.passwordLama) {

    	//hide validasi gagal
   		if (this.showValGagalUbah == false) {
        	$('#valUbahGagal').transition('fade');
        	this.showValGagalUbah = true;
        	this.errorUbah = "";
      	}

      	//show validasi benar
      	setTimeout(() =>{
      		$('#formUbahPass').form('clear'); 
      		this.berhasilUbah = "Password Tidak Berubah.";
        	$('#valUbahBerhasil').transition('fade');
            this.showValBerhasilUbah = false;
          }, 500);

      	//hide validasi tambah
        setTimeout(() =>{
            $('#valUbahBerhasil').transition('fade');
            this.showValBerhasilUbah = true;
            this.berhasilUbah = "";
        }, 3000);
    }

    //berhasil ubah password
    else {

    	//validasi guru atau siswa
    	if (this.statusCookie == "pengelola" || this.statusCookie == "kerumahtanggaan" || this.statusCookie == "guru") {
    		
    		//simpan data value
    		data = {
		      nip:localStorage.getItem('nip'),
		      password:value.passwordBaru
		    }

		    //kirim data ubah
		    this.http.put(this.link + '/klimaservice/public/api/guru/ubahPassword', data).subscribe((data)=>{

		    });

    	} else {

    		//simpan data value
    		data = {
		      nis:localStorage.getItem('nis'),
		      password:value.passwordBaru
		    }

		    //kirim data ubah
		    this.http.put(this.link + '/klimaservice/public/api/siswa/ubahPassword', data).subscribe((data)=>{

		    });

    	}

		//show validasi benar
      	setTimeout(() =>{
      		$('#formUbahPass').form('clear'); 
      		this.berhasilUbah = "Password Telah Berubah, Silahkan Login Kembali";
        	$('#valUbahBerhasil').transition('fade');
            this.showValBerhasilUbah = false;
          }, 500);

      	//hide validasi tambah
        setTimeout(() =>{
            $('#valUbahBerhasil').transition('fade');
            this.showValBerhasilUbah = true;
            this.berhasilUbah = "";

            //logout otomatis
            localStorage.clear();
        	  this.router.navigateByUrl('/login');
        }, 3000);    	
    }
  }

}
