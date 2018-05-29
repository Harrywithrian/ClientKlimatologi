import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-kelompok-siswa',
  templateUrl: './kelompok-siswa.component.html',
  styleUrls: ['./kelompok-siswa.component.css']
})
export class KelompokSiswaComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService) { }

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable
  nis;
  kd_kelompok;
  namaGuru;
  kelompokPribadi:any = {};
  cariGuru;
  hasilPencarian;

  //variable modal masuk kelompok
  cariKode;
  cariNama;
  cariJumlah;

  //variable show hide konten
  showCariKelompok = true;
  showKelompokPribadi = true;
  showPending = true;
  showPencarian = true;
  showDaftarKelompok = true;
  validasiKelompokKosong = true;

  ngOnInit() {

    //modal
    $('#modalMasukKelompok').modal({detachable:false});

    //load kelompok pribadi
    this.loadKelompokPribadi();

  }

  //batal masuk kelompok
  batalMasukKelompok() {

    //input data
    var data = { nis:this.nis };

    //request data ke service
    this.http.put(this.link + '/klimaservice/public/api/kelompok/siswa/batalReq', data).subscribe((data)=>{

      //validasi show hide
      this.showPending = true;
      this.showCariKelompok = false;

    });
  }

  //cari kelompok
  cariKelompok (){

    //masukkan value form
    var value = $('#formCariKelompok').form('get values');
    var data = { nama:value.cariGuru };

    //validasi data kosong
    if (value.cariGuru == "") {
      this.showPencarian = false;
      this.showDaftarKelompok = true;
      this.validasiKelompokKosong = false;
    }

    //data benar
    else {

      //request data ke service
      this.http.post(this.link + '/klimaservice/public/api/kelompok/siswa/cariKelompok', data).subscribe((data)=>{

        //simpan data pada variable
        this.hasilPencarian = data;
        this.showPencarian = false;

        //validasi data kosong
        if (this.hasilPencarian[0]['kd_kelompok'] == null) {
          this.showDaftarKelompok = true;
          this.validasiKelompokKosong = false;
        }

        //data tidak kosong
        else {
          this.showDaftarKelompok = false;
          this.validasiKelompokKosong = true;
          $('#formCariKelompok').form('clear');
        }

      });
    }
  }

  //tampil modal masuk kelompok
  modalMasukKelompok(item) {

    //simpan value pada variable
    this.cariKode = item.kd_kelompok;
    this.cariNama = item.nama;
    this.cariJumlah = item.anggota;

    //tampil modal
    $('#modalMasukKelompok').modal('show');
  }

  //tutup modal
  closeModalMasuk() {
    $('#modalMasukKelompok').modal('hide');
  }

  //request masuk kelompok swakarya
  MasukKelompok(cariKode) {

    //simpan value pada variable
    var data = {
      kd_kelompok:cariKode,
      nis:this.nis
    }

    //request data ke service
    this.http.put(this.link + '/klimaservice/public/api/kelompok/siswa/masukReq', data).subscribe((data)=>{

      //reload data kelompok pribadi
      this.loadKelompokPribadi();

      //validasi show hide konten
      this.showCariKelompok = true;
      this.showPending = false;
      this.showPencarian = true;
      this.showDaftarKelompok = true;
      this.validasiKelompokKosong = true;

      //tutup modal masuk kelompok
      $('#modalMasukKelompok').modal('hide');

    });
  }

  //load / reload data kelompok pribadi
  loadKelompokPribadi() {

    //input
    this.nis = localStorage.getItem('nis');
    var data = { nis:this.nis };

    // post data kelompok pribadi siswa
    this.http.post(this.link + '/klimaservice/public/api/kelompok/siswa/tampil', data).subscribe((data)=>{

      //simpan data
      this.kelompokPribadi = data[0];

      //validasi siswa belum memiliki kelompok
      if (this.kelompokPribadi == null || data[0]['kondisi'] == 'non_aktif') {

        this.kd_kelompok = "";
        this.namaGuru = "";
        this.showCariKelompok = false;

      }

      //validasi siswa pending
      else if (data[0]['kondisi'] == 'pending') {

        this.kd_kelompok = this.kelompokPribadi.kd_kelompok;
        this.namaGuru = this.kelompokPribadi.guru;
        this.showPending = false;

      }

      //validasi siswa sudah memiliki kelompok
      else if (data[0]['kondisi'] == 'diterima') {

        this.kd_kelompok = this.kelompokPribadi.kd_kelompok;
        this.router.navigateByUrl('/menu_utama_siswa/detailSwakaryaSiswa/'+ this.kd_kelompok);

      }

    });
  }

}
