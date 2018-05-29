import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-detail-kelompok-siswa',
  templateUrl: './detail-kelompok-siswa.component.html',
  styleUrls: ['./detail-kelompok-siswa.component.css']
})
export class DetailKelompokSiswaComponent implements OnInit {

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable kelompok
  kd_kelompok;
  dataKelompok:any = {};
  anggota;

  //variable iklim
  dataIklim;
  tempTahunAwal;
  tempTahunAkhir;
  hasilIklim:any = {};

  //variable tanaman
  dataTanaman;
  tanamanKelompok:any = {};

  //show hide validasi
  hideValidasiAnggota = true;
  showValGenerate     = true;
  showValKlasifikasi  = true;

  //validasi
  errorGenerate;
  errorKlasifikasi;

  //show hide konten
  hideKontenIklim     = true;
  hideHitungIklim     = true;
  hideDataIklim       = true;
  hideFormIklim       = false;
  hideKontenTanaman   = true;
  hidePilihTanaman    = true;
  hideTanamanKelompok = true;
  
  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService, private activeRoute:ActivatedRoute) { }

  ngOnInit() {

    //dropdown
  	$("#dropBulan").dropdown();

  	//simpan kode kelompok
  	this.activeRoute.params.subscribe((params) => {
      this.kd_kelompok = params['kd_kelompok'];
    });

    //simpan data value anggota
    var dataAnggota = {
      kd_kelompok:this.kd_kelompok
    }

    //simpan data value klasifikasi
    var dataKlasifikasi = {
      kd_klasifikasi:this.kd_kelompok + '-1'
    }

    //request data kelompok
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail', dataAnggota).subscribe((data)=>{
      this.dataKelompok = data[0];

      //load data 30%
      if (this.dataKelompok.progress <= 32) {
        this.loadDataAnggota(dataAnggota);
      }

      //load data 70%
      else if (this.dataKelompok.progress == 70) {
        this.loadDataAnggota(dataAnggota);
        this.loadDataPeriode(dataKlasifikasi);
        this.loadDataKlasifikasi(dataKlasifikasi);

        //validasi show mencari tanaman
        this.loadDataTanaman();
        this.hidePilihTanaman = false;
      }

      //load data 100%
      else if (this.dataKelompok.progress > 70) {
        this.loadDataAnggota(dataAnggota);
        this.loadDataPeriode(dataKlasifikasi);
        this.loadDataKlasifikasi(dataKlasifikasi);
        this.loadTanamanKelompok(this.kd_kelompok);
      }
    });
    
  }

  //method load anggota kelompok
  loadDataAnggota(dataAnggota) {

    //request data anggota
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/anggota', dataAnggota).subscribe((data)=>{
      
      // simpan data kelompok
      this.anggota = data;

      //validasi anggota
      if (this.anggota.length >= 7) {
        this.hideKontenIklim  = false;
      } else {
        this.hideValidasiAnggota = false;
      }

    });
  }

  //method load data iklim
  loadDataPeriode(dataKlasifikasi) {

    //request data klasifikasi
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/tampilPeriode', dataKlasifikasi).subscribe((data)=>{

      //simpan data iklim
      this.dataIklim = data;

      //validasi tampil lpm
      this.dataIklim.forEach((item) =>{
        item.lpm = item.lpm.substring(0, 5);
      });

      //validasi data iklim ada
      if (this.dataIklim.length > 0) {
        this.hideFormIklim    = true;
        this.hideDataIklim    = false;
      }

    });
  }

  //method load hasil perhitungan rata-rata
  loadDataKlasifikasi(dataKlasifikasi) {

    //request data klasifikasi
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/tampilKlasifikasi', dataKlasifikasi).subscribe((data)=>{
      
      //simpan data rata-rata
      this.hasilIklim = data[0];

      if (this.hasilIklim) {
        this.hideKontenTanaman = false;
      }
    });
  }

  //load data tanaman
  loadTanamanKelompok(kd_kelompok) {

    //simpan variable
    var data = {
      kd_kelompok:kd_kelompok
    }

    //request data klasifikasi
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/tampilTanaman', data).subscribe((data)=>{
      this.tanamanKelompok = data[0];

      if (this.tanamanKelompok.kd_tanaman == "") {
        this.hidePilihTanaman = false;
        this.loadDataTanaman();
      } else {
        this.hidePilihTanaman = true;
        this.hideTanamanKelompok = false;
      }

      //suhu kosong
      if (this.tanamanKelompok.suhu_min > 0 && this.tanamanKelompok.suhu_maks == 0) {
        this.tanamanKelompok.suhu = "> " + this.tanamanKelompok.suhu_min + "ºC";
      } else if (this.tanamanKelompok.suhu_min == 0 && this.tanamanKelompok.suhu_maks > 0) {
        this.tanamanKelompok.suhu = "< " + this.tanamanKelompok.suhu_maks + "ºC";
      } else if (this.tanamanKelompok.suhu_min > 0 && this.tanamanKelompok.suhu_maks > 0) {
        this.tanamanKelompok.suhu = this.tanamanKelompok.suhu_min + "ºC - " + this.tanamanKelompok.suhu_maks + "ºC";
      }

      //kelembapan kosong
      if (this.tanamanKelompok.kelembaban_min > 0 && this.tanamanKelompok.kelembaban_maks == null) {
        this.tanamanKelompok.kelembapan = "> " + this.tanamanKelompok.kelembaban_min + "%";
      } else if (this.tanamanKelompok.kelembaban_min == null && this.tanamanKelompok.kelembaban_maks > 0) {
        this.tanamanKelompok.kelembapan = "< " + this.tanamanKelompok.kelembaban_maks + "%";
      } else if (this.tanamanKelompok.kelembaban_min > 0 && this.tanamanKelompok.kelembaban_maks > 0) {
        this.tanamanKelompok.kelembapan = this.tanamanKelompok.kelembaban_min + "% - " + this.tanamanKelompok.kelembaban_maks + "%";
      }

      //curah hujan kosong
      if (this.tanamanKelompok.ch_min > 0 && this.tanamanKelompok.ch_maks == 0) {
        this.tanamanKelompok.ch = "> " + this.tanamanKelompok.ch_min + " mm";
      } else if (this.tanamanKelompok.ch_min == 0 && this.tanamanKelompok.ch_maks > 0) {
        this.tanamanKelompok.ch = "< " + this.tanamanKelompok.ch_maks + " mm";
      } else if (this.tanamanKelompok.ch_min > 0 && this.tanamanKelompok.ch_maks > 0) {
        this.tanamanKelompok.ch = this.tanamanKelompok.ch_min + " mm - " + this.tanamanKelompok.ch_maks + " mm";
      }

      //lpm kosong
      if (this.tanamanKelompok.lpm_maks == "") {
        this.tanamanKelompok.lpm = "> " + this.tanamanKelompok.lpm_min;
      } else if (this.tanamanKelompok.lpm_min == "") {
        this.tanamanKelompok.lpm = "< " + this.tanamanKelompok.lpm_maks;
      } else {
        this.tanamanKelompok.lpm = this.tanamanKelompok.lpm_min + " - " + this.tanamanKelompok.lpm_maks;
      }
    });

  }

  //method generate iklim
  generateIklim () {
  	
    //simpan value form
  	var value = $('#loadIklim').form('get values');
  	var tahunAwal = String(value.tahunAwal);
  	var tahunAkhir = String(value.tahunAkhir);
  	var bulan = String(value.bulan);

    //validasi tahun
  	this.tempTahunAwal  = tahunAwal;
  	this.tempTahunAkhir = tahunAkhir;

    //validasi tahun awal lebih besar dari tahun akhir
    if (tahunAwal == "" || tahunAkhir == "" || bulan == "") {
      this.showValGenerate = false;
      this.errorGenerate = "Field Tidak Boleh Kosong";
    }

    //validasi tahun awal lebih besar dari tahun akhir
    else if (tahunAwal > tahunAkhir) {
      this.showValGenerate = false;
      this.errorGenerate = "Tahun Awal Tidak Boleh Lebih Besar Dari Tahun Akhir";
    }

    else {

      //kosongkan validasi
      this.showValGenerate = true;
      this.errorGenerate = "";

      //simpan data value
      var data = {
        tahunAwal: tahunAwal + bulan,
        tahunAkhir: tahunAkhir + bulan,
        bulan: bulan
      }

      //simpan data progress kelompok
      var progress = {
        kd_kelompok: this.kd_kelompok,
        progress:70,
        keterangan:'Memilih Tanaman'
      }

      //post data value
      this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/siswa/generateIklim', data).subscribe((data)=>{
        
        //simpan data
        this.dataIklim = data;

        //validasi tampil lpm
        this.dataIklim.forEach((item) =>{
          item.lpm = item.lpm.substring(0, 5);
        });

        //validasi show
        this.hideHitungIklim = false;
        this.hideDataIklim   = false;
      });

      //post data progress
      this.http.put(this.link + '/klimaservice/public/api/kelompok/detail/siswa/tambahProgress', progress).subscribe((data)=>{
      });
    }
  	
  }

  //method tampil tahun pada tabel
  kolomTahun(tahun){
  	return tahun.substring(0, 4);
  }

  //simpan perhitungan rata-rata iklim
  simpanIklim () {

    //simpan value form
  	var value = $('#hitungIklim').form('get values');

    //validasi tahun awal lebih besar dari tahun akhir
    if (value.suhu == "" || value.kelembaban == "" || value.curahHujan == "" || value.lpm == "") {
      this.showValKlasifikasi = false;
      this.errorKlasifikasi = "Field Tidak Boleh Kosong";
    }

    else {
      //kosongkan validasi
      this.showValKlasifikasi = true;
      this.errorKlasifikasi = "";

      //simpan data value
      var kode = [];
      this.dataIklim.forEach((item) =>{
        kode.push(item.kd_klimatologi);
      });

      //simpan data value
      var data = {
        kd_kelompok: this.kd_kelompok,
        kd_klasifikasi: this.kd_kelompok + '-1',
        tahunAwal: this.tempTahunAwal,
        tahunAkhir: this.tempTahunAkhir,
        suhu: value.suhu,
        kelembaban: value.kelembaban,
        curah_hujan: value.curahHujan,
        lpm: value.lpm,
        kd_klimatologi: JSON.stringify(kode)
      }

      //post data rata-rata
      this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/siswa/simpanIklim', data).subscribe((data)=>{

        //simpan data rata-rata
        this.hasilIklim = data[0];

        //validasi lpm
        this.hasilIklim['rata_lpm'] = this.hasilIklim['rata_lpm'].substring(0,5);

        //validasi hide
        this.hideFormIklim     = true;
        this.hideHitungIklim   = true;
        this.hideKontenTanaman = false;
        this.hidePilihTanaman  = false;
        this.loadDataTanaman();

      });
    }
  }

  //method load data tanaman
  loadDataTanaman() {

    //request data tanaman
    this.http.get(this.link + '/klimaservice/public/api/tanaman/tampil').subscribe((data)=>{

      //simpan hasil request
      this.dataTanaman = data;

      //validasi data kosong
      this.dataTanaman.forEach((item) =>{
        
        //suhu kosong
        if (item.suhu_min > 0 && item.suhu_maks == 0) {
          item.suhu = "> " + item.suhu_min + "ºC";
        } else if (item.suhu_min == 0 && item.suhu_maks > 0) {
          item.suhu = "< " + item.suhu_maks + "ºC";
        } else if (item.suhu_min > 0 && item.suhu_maks > 0) {
          item.suhu = item.suhu_min + "ºC - " + item.suhu_maks + "ºC";
        }

        //kelembapan kosong
        if (item.kelembaban_min > 0 && item.kelembaban_maks == null) {
          item.kelembapan = "> " + item.kelembaban_min + "%";
        } else if (item.kelembaban_min == null && item.kelembaban_maks > 0) {
          item.kelembapan = "< " + item.kelembaban_maks + "%";
        } else if (item.kelembaban_min > 0 && item.kelembaban_maks > 0) {
          item.kelembapan = item.kelembaban_min + "% - " + item.kelembaban_maks + "%";
        }

        //curah hujan kosong
        if (item.ch_min > 0 && item.ch_maks == 0) {
          item.ch = "> " + item.ch_min + " mm";
        } else if (item.ch_min == 0 && item.ch_maks > 0) {
          item.ch = "< " + item.ch_maks + " mm";
        } else if (item.ch_min > 0 && item.ch_maks > 0) {
          item.ch = item.ch_min + " mm - " + item.ch_maks + " mm";
        }

        //lpm kosong
        if (item.lpm_maks == "") {
          item.lpm = "> " + item.lpm_min;
        } else if (item.lpm_min == "") {
          item.lpm = "< " + item.lpm_maks;
        } else {
          item.lpm = item.lpm_min + " - " + item.lpm_maks;
        }

      });
    });
  }

  pilihTanaman(kd_tanaman) {
    var data = {
      kd_kelompok:this.kd_kelompok,
      kd_tanaman:kd_tanaman
    }

    var progress = {
      kd_kelompok: this.kd_kelompok,
      progress:100,
      keterangan:'Selesai'
    }

    this.http.put(this.link + '/klimaservice/public/api/kelompok/detail/siswa/simpanTanaman', data).subscribe((data)=>{
      this.hidePilihTanaman = true;
      this.hideTanamanKelompok = false;
      this.loadTanamanKelompok(this.kd_kelompok);
    });

    //post data progress
    this.http.put(this.link + '/klimaservice/public/api/kelompok/detail/siswa/tambahProgress', progress).subscribe((data)=>{
    });
  }

}
