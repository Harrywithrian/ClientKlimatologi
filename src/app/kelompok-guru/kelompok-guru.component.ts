import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-kelompok-guru',
  templateUrl: './kelompok-guru.component.html',
  styleUrls: ['./kelompok-guru.component.css']
})
export class KelompokGuruComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService) { }

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable
  nip;
  listKelompok;
  kodeHapus;

  ngOnInit() {
    $('#modalHapusKelompok').modal({detachable:false});

  	// load data cookie
  	this.nip = localStorage.getItem('nip');
  	var data = { nip:this.nip }

    //post service
  	this.http.post(this.link + '/klimaservice/public/api/kelompok/guru/tampil', data).subscribe((data)=>{
      
      //simpan pada variable
      this.listKelompok = data;

      //load data kelompok
      setTimeout(() => {
		    this.reloadData();
		  }, 500);
       
    });
  }

  //method detail kelompok
  detailKelompok(kd_kelompok) {
    var kd_kelompok = kd_kelompok;
    this.router.navigateByUrl('/menu_utama_guru/detailSwakaryaGuru/'+ kd_kelompok);
  }

  //tambah data kelompok
  tambahKelompok () {

    //variable
    var date = new Date();
    var tahun = date.getFullYear();
    var kodeNip = this.nip.substring(0, 8);

    //generate kode
    var kode = "SW-" + kodeNip + "-" + tahun;

    //simpan data value
    var data = {
      kd_kelompok:kode,
      nip:this.nip,
      keterangan:'Memilih siswa'
    }

    //post data
    this.http.post(this.link + '/klimaservice/public/api/kelompok/guru/tambah', data).subscribe((data)=>{  
    
      //load data kelompok
      setTimeout(() =>{
        this.reloadData();
      }, 500);

    });

  }

  //modal hapus kelompok
  modalHapusKelompok (kd_kelompok) {
    this.kodeHapus = kd_kelompok;
    $('#modalHapusKelompok').modal('show');
  }

  //tutup modal
  closeModal () {
    $('#modalHapusKelompok').modal('hide');
  }

  //hapus data kelompok
  hapusKelompok(kodeHapus) {

    //delete kelompok
    this.http.delete(this.link + '/klimaservice/public/api/kelompok/guru/hapus/' +kodeHapus).subscribe((data)=>{
      $('#modalHapusKelompok').modal('hide');
    });
    
    //load data kelompok
    setTimeout(() =>{
      this.reloadData();
    }, 500);
    
  }

  //reload data kelompok
  reloadData() {
    
    //load data cookie
    this.nip = localStorage.getItem('nip');

    //simpan value
    var data = {
      nip:this.nip
    }

    //post data kelompok
    this.http.post(this.link + '/klimaservice/public/api/kelompok/guru/tampil', data).subscribe((data)=>{
      
      //simpan data post
      this.listKelompok = data;

      //load data kelompok
      setTimeout(() => {
        $('[data-kelompok]').each(function() {
          $(this).progress();
        });
      }, 500);   

    });

  }

}