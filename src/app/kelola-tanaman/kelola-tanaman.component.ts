import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//jquery
declare var $:any;

@Component({
  selector: 'app-kelola-tanaman',
  templateUrl: './kelola-tanaman.component.html',
  styleUrls: ['./kelola-tanaman.component.css']
})

export class KelolaTanamanComponent implements OnInit {

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable
  dataTanaman;
  detailTanaman:any = {};
  hapusKode;
  hapusNama;
  fieldCariTanaman;

  //validasi
  errorTambah;
  errorUbah;

  //show hide validasi
  tabelKosong        = true;
  showValGagalTambah = true;
  showValGagalUbah   = true;

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService) { }

  ngOnInit() {

    //modal
    $('#modalDetailTanaman').modal({detachable:false});
    $('#modalTambahTanaman').modal({detachable:false});
    $('#modalUbahTanaman').modal({detachable:false});
    $('#modalHapusTanaman').modal({detachable:false});

  	//request data tanaman
  	this.http.get(this.link + '/klimaservice/public/api/tanaman/tampil').subscribe((data)=>{

      //simpan hasil request
    	this.dataTanaman = data;

      //validasi tabel kosong
      if (this.dataTanaman.length < 1) {
        this.tabelKosong = false;
      } else {
        this.tabelKosong = true;
      }
    });
  }

  //detail tanaman
  detail(item) {

    //tampil modal
    $('#modalDetailTanaman').modal('show');

    //simpan dalam value
    this.detailTanaman = item;

    //validasi suhu min
    if (this.detailTanaman.suhu_min == 0) {
      this.detailTanaman.suhu_min = "-";
    }

    //validasi suhu maks
    if (this.detailTanaman.suhu_maks == 0) {
      this.detailTanaman.suhu_maks = "-";
    }

    //validasi kelembapan min
    if (this.detailTanaman.kelembaban_min == null || this.detailTanaman.kelembaban_min == 0) {
      this.detailTanaman.kelembaban_min = "-";
    }

    //validasi kelembapan maks
    if (this.detailTanaman.kelembaban_maks == null || this.detailTanaman.kelembaban_maks == 0) {
      this.detailTanaman.kelembaban_maks = "-";
    }

    //validasi curah hujan min
    if (this.detailTanaman.ch_min == 0) {
      this.detailTanaman.ch_min = "-";
    }

    //validasi curah hujan maks
    if (this.detailTanaman.ch_maks == 0) {
      this.detailTanaman.ch_maks = "-";
    }

    //validasi lpm maks
    if (this.detailTanaman.lpm_min == "") {
      this.detailTanaman.lpm_min = "-";
    }

    //validasi lpm maks
    if (this.detailTanaman.lpm_maks == "") {
      this.detailTanaman.lpm_maks = "-";
    }

  }

  //tampil modal tambah
  modalTambah() {
    $('#modalTambahTanaman').modal('show');
    $('#tambahTanaman').form('clear');
    this.showValGagalTambah = true;
    this.errorTambah        = "";
  }

  //tampil modal ubah
  modalUbah(item) {

    //tutup validasi
    this.showValGagalUbah = true;
    this.errorUbah        = "";

    //validasi suhu min kosong
    if (item.suhu_min == "-" || item.suhu_min == 0) {
      item.suhu_min = "";
    }

    //validasi suhu maks kosong
    if (item.suhu_maks == "-" || item.suhu_maks == 0) {
      item.suhu_maks = "";
    }

    //validasi kelembaban min kosong
    if (item.kelembaban_min == "-" || item.kelembaban_min == 0) {
      item.kelembaban_min = "";
    }

    //validasi kelembaban maks kosong
    if (item.kelembaban_maks == "-" || item.kelembaban_maks == 0) {
      item.kelembaban_maks = "";
    }

    //validasi curah hujan min kosong
    if (item.ch_min == "-" || item.ch_min == 0) {
      item.ch_min = "";
    }

    //validasi curah hujan maks kosong
    if (item.ch_maks == "-" || item.ch_maks == 0) {
      item.ch_maks = "";
    }

    //validasi lpm min kosong
    if (item.lpm_min == "-" || item.lpm_min == "") {
      item.lpm_min = "";
    }

    //validasi curah hujan maks kosong
    if (item.lpm_maks == "-" || item.lpm_maks == "") {
      item.lpm_maks = "";
    }

    //masukkan data pada form
    $('#ubahTanaman').form('set values',{
      kodeUbah:item.kd_tanaman,
      kodeLama:item.kd_tanaman,
      namaUbah:item.nama,
      lamaTanamUbah:item.lama_tanam,
      suhuMinUbah:item.suhu_min,
      suhuMaksUbah:item.suhu_maks,
      kelembabanMinUbah:item.kelembaban_min,
      kelembabanMaksUbah:item.kelembaban_maks,
      chMinUbah:item.ch_min,
      chMaksUbah:item.ch_maks,
      lpmMinUbah:item.lpm_min,
      lpmMaksUbah:item.lpm_maks
    });

    //tampil modal
    $('#modalUbahTanaman').modal('show');
  }

  //tampil modal tambah
  modalHapus(item) {
    this.hapusKode = item.kd_tanaman;
    this.hapusNama = item.nama;

    $('#modalHapusTanaman').modal('show');
  }

  //tutup modal detail
  closeModalDetail() {
    $('#modalDetailTanaman').modal('hide');   
  }

  //tutup modal tambah
  closeModalTambah() {
    $('#modalTambahTanaman').modal('hide');
    $('#tambahTanaman').form('clear'); 
  }

  //tutup modal ubah
  closeModalUbah() {
    $('#modalUbahTanaman').modal('hide');
    $('#ubahTanaman').form('clear'); 
  }

  //tutup modal hapus
  closeModalHapus() {
    $('#modalHapusTanaman').modal('hide');
  }

  //tambah tanaman
  tambahTanaman() {

    //ambil data form tambah
    var value = $('#tambahTanaman').form('get values');

    //validasi angka pada nama
    var angkaLamaTanam = /\d/.test(value.lamaTanamTambah);

    //validasi kode kosong
    if (value.kodeTambah == "") {
      this.showValGagalTambah = false;
      this.errorTambah        = "Field Kode Tanaman Tidak Boleh Kosong";
    }

    //validasi nama kosong
    else if (value.namaTambah == "") {
      this.showValGagalTambah = false;
      this.errorTambah        = "Field Nama Tanaman Tidak Boleh Kosong";
    }

    //validasi lama tanam kosong
    else if (value.lamaTanamTambah == "") {
      this.showValGagalTambah = false;
      this.errorTambah        = "Field Lama Tanam Tanaman Tidak Boleh Kosong";
    }

    //validasi lama tanam kosong
    else if (angkaLamaTanam == false) {
      this.showValGagalTambah = false;
      this.errorTambah        = "Field Lama Tanam Harus Di Isi Dengan Angka";
    }

    //validasi suhu
    else if (value.suhuMinTambah != "" && value.suhuMaksTambah != "" &&
             value.suhuMinTambah > value.suhuMaksTambah) {

      this.showValGagalTambah = false;
      this.errorTambah        = "Suhu Min Tidak Boleh Lebih Besar Dari Suhu Maks";
    }

    //validasi kelembapan
    else if (value.kelembabanMinTambah != "" && value.kelembabanMaksTambah != "" &&
             value.kelembabanMinTambah > value.kelembabanMaksTambah) {

      this.showValGagalTambah = false;
      this.errorTambah        = "Kelembapan Min Tidak Boleh Lebih Besar Dari Kelembapan Maks";
    }

    //validasi curah hujan
    else if (value.chMinTambah != "" && value.chMaksTambah != "" &&
             value.chMinTambah > value.chMaksTambah) {

      this.showValGagalTambah = false;
      this.errorTambah        = "Curah Hujan Min Tidak Boleh Lebih Besar Dari Curah Hujan Maks";
    }

    else if (value.kodeTambah != "" && value.namaTambah != "" && value.lamaTanamTambah != "") {

      //simpan data value
      var data = {
        kd_tanaman:value.kodeTambah,
        nip:localStorage.getItem('nip'),
        nama:value.namaTambah,
        lama_tanam:value.lamaTanamTambah,
        suhu_min:value.suhuMinTambah,
        suhu_maks:value.suhuMaksTambah,
        kelembaban_min:value.kelembabanMinTambah,
        kelembaban_maks:value.kelembabanMaksTambah,
        ch_min:value.chMinTambah,
        ch_maks:value.chMaksTambah,
        lpm_min:value.lpmMinTambah,
        lpm_maks:value.lpmMaksTambah
      }

      //kirim data tambah
      this.http.post(this.link + '/klimaservice/public/api/tanaman/tambah', data).subscribe((data)=>{

        //validasi jika nip tidak unik
        if (data['validasi'] == false) {
          this.showValGagalTambah = false;
          this.errorTambah        = "Kode Tanaman Tidak Boleh Sama";
        } else {
          //kosongkan validasi
          this.showValGagalTambah = true;
          this.errorTambah        = "";

          //hide modal
          $('#modalTambahTanaman').modal('hide');

          //reload data
          this.reloadData();
        }

      });
    }
  }

  //tambah tanaman
  ubahTanaman() {

    //ambil data form tambah
    var value = $('#ubahTanaman').form('get values');

    //validasi angka pada nama
    var angkaLamaTanam = /\d/.test(value.lamaTanamUbah);

    //validasi kode kosong
    if (value.kodeUbah == "") {
      this.showValGagalUbah = false;
      this.errorUbah        = "Field Kode Tanaman Tidak Boleh Kosong";
    }

    //validasi nama kosong
    else if (value.namaUbah == "") {
      this.showValGagalUbah = false;
      this.errorUbah        = "Field Nama Tanaman Tidak Boleh Kosong";
    }

    //validasi lama tanam kosong
    else if (value.lamaTanamUbah == "") {
      this.showValGagalUbah = false;
      this.errorUbah        = "Field Lama Tanam Tanaman Tidak Boleh Kosong";
    }

    //validasi lama tanam kosong
    else if (angkaLamaTanam == false) {
      this.showValGagalUbah = false;
      this.errorUbah        = "Field Lama Tanam Harus Di Isi Dengan Angka";
    }

    //validasi suhu
    else if (value.suhuMinUbah != "" && value.suhuMaksUbah != "" &&
             value.suhuMinUbah > value.suhuMaksUbah) {

      this.showValGagalUbah = false;
      this.errorUbah        = "Suhu Min Tidak Boleh Lebih Besar Dari Suhu Maks";
    }

    //validasi kelembapan
    else if (value.kelembabanMinUbah != "" && value.kelembabanMaksUbah != "" &&
             value.kelembabanMinUbah > value.kelembabanMaksUbah) {

      this.showValGagalUbah = false;
      this.errorUbah        = "Kelembapan Min Tidak Boleh Lebih Besar Dari Kelembapan Maks";
    }

    //validasi curah hujan
    else if (value.chMinUbah != "" && value.chMaksUbah != "" &&
             value.chMinUbah > value.chMaksUbah) {

      this.showValGagalUbah = false;
      this.errorUbah        = "Curah Hujan Min Tidak Boleh Lebih Besar Dari Curah Hujan Maks";
    }

    else if (value.kodeUbah != "" && value.namaUbah != "" && value.lamaTanamUbah != "") {

      //simpan data value
      var data = {
        kd_tanaman:value.kodeUbah,
        kode_lama:value.kodeLama,
        nama:value.namaUbah,
        lama_tanam:value.lamaTanamUbah,
        suhu_min:value.suhuMinUbah,
        suhu_maks:value.suhuMaksUbah,
        kelembaban_min:value.kelembabanMinUbah,
        kelembaban_maks:value.kelembabanMaksUbah,
        ch_min:value.chMinUbah,
        ch_maks:value.chMaksUbah,
        lpm_min:value.lpmMinUbah,
        lpm_maks:value.lpmMaksUbah
      }

      //kirim data ubah
      this.http.put(this.link + '/klimaservice/public/api/tanaman/ubah', data).subscribe((data)=>{

        //validasi jika nip tidak unik
        if (data['validasi'] == false) {
          this.showValGagalUbah = false;
          this.errorUbah        = "Kode Tanaman Tidak Boleh Sama";
        } else {
          //kosongkan validasi
          this.showValGagalUbah = true;
          this.errorUbah        = "";
          $('#modalUbahTanaman').modal('hide');
          this.reloadData();
        }

      });
    }
  }

  //hapus tanaman
  hapusTanaman(kode) {

    //kirim data hapus
    this.http.delete(this.link + '/klimaservice/public/api/tanaman/hapus/' +kode).subscribe((data)=>{
      $('#modalHapusTanaman').modal('hide');
    });
    
    //reload data tanaman
    setTimeout(() =>{
      this.reloadData();
    }, 500);
   
  }

  //method cari tanaman
  cariTanaman() {
    var data = {
      dataCari:this.fieldCariTanaman
    }

    //kirim data cari
    this.http.post(this.link + '/klimaservice/public/api/tanaman/cari', data).subscribe((data)=>{

      //simpan hasil request
      this.dataTanaman = data;

      //validasi tabel kosong
      if (this.dataTanaman.length < 1) {
        this.tabelKosong = false;
      } else {
        this.tabelKosong = true;
      }
      
    });
  }

  //reload data tanaman
  reloadData() {

    //request data tanaman
    this.http.get(this.link + '/klimaservice/public/api/tanaman/tampil').subscribe((data)=>{

      //simpan hasil request
      this.dataTanaman = data;

      //validasi tabel kosong
      if (this.dataTanaman.length < 1) {
        this.tabelKosong = false;
      } else {
        this.tabelKosong = true;
      }

    });
  }

}
