import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


//indetify jquery
declare var $:any;

@Component({
  selector: 'app-detail-kelompok-guru',
  templateUrl: './detail-kelompok-guru.component.html',
  styleUrls: ['./detail-kelompok-guru.component.css']
})
export class DetailKelompokGuruComponent implements OnInit {
  
  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable
  kd_kelompok;
  detailKelompok:any = {};
  anggota;
  nis;
  angkatan;
  nama;
  pending;

  //variable iklim
  dataIklim;
  hasilIklim:any = {};
  tanamanKelompok:any = {};

  //show hide konten
  showKontenIklim = true;
  showKontenTanaman = true;

  //show hide validasi
  showAnggotaKosong = true;
  showRequestKosong = true;

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService, private activeRoute:ActivatedRoute) { }

  ngOnInit() {

    //modal
    $('#modalKonfirmasi').modal({detachable:false});

  	//ambil kode kelompok
  	this.activeRoute.params.subscribe((params) => {
      this.kd_kelompok = params['kd_kelompok'];
    });

    //masukan kode kelompok
    var kodeKelompok = {
      kd_kelompok:this.kd_kelompok
    }

    //masukan kode klasifikasi
    var dataKlasifikasi = {
      kd_klasifikasi:this.kd_kelompok + '-1'
    }

  	//get informasi kelompok
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail', kodeKelompok).subscribe((data)=>{     
      this.detailKelompok = data[0];
      setTimeout(() => {
        $('#progressBar').progress();
      }, 500);

      //load 30%
      if (this.detailKelompok.progress <= 32) {
        this.loadDataAnggota(kodeKelompok);
      }

      //load 70%
      else if (this.detailKelompok.progress == 70) {
        this.loadDataAnggota(kodeKelompok);
        this.loadDataPeriode(dataKlasifikasi);
        this.loadDataKlasifikasi(dataKlasifikasi);

        this.showKontenIklim = false;
      }

      //load 100%
      else if (this.detailKelompok.progress == 100) {
        this.loadDataAnggota(kodeKelompok);
        this.loadDataPeriode(dataKlasifikasi);
        this.loadDataKlasifikasi(dataKlasifikasi);
        this.loadTanamanKelompok(kodeKelompok);

        this.showKontenIklim   = false;
        this.showKontenTanaman = false;
      }
    });
    
  }

  //ambil data siswa
  loadDataAnggota(kodeKelompok) {

    //get data anggota kelompok
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/anggota', kodeKelompok).subscribe((data)=>{
      this.anggota = data;

      //validasi anggota kosong
      if (this.anggota.length < 1) {
        this.showAnggotaKosong = false;
      } else {
        this.showAnggotaKosong = true;
      }
    });

    //get data request anggota kelompok
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/guru/pending', kodeKelompok).subscribe((data)=>{
      this.pending = data;

      //validasi anggota kosong
      if (this.pending.length < 1) {
        this.showRequestKosong = false;
      } else {
        this.showRequestKosong = true;
      }
    });
  }

  //load data iklim
  loadDataPeriode(dataKlasifikasi) {

    //post data
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/tampilPeriode', dataKlasifikasi).subscribe((data)=>{
      //simpan data
      this.dataIklim = data;

      //validasi tampil lpm
      this.dataIklim.forEach((item) =>{
        item.lpm = item.lpm.substring(0, 5);
      });
    });
  }

  //load data tanaman
  loadTanamanKelompok(kodeKelompok) {

    //request data klasifikasi
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/tampilTanaman', kodeKelompok).subscribe((data)=>{
      this.tanamanKelompok = data[0];

      //suhu kosong
      if (this.tanamanKelompok.suhu_min > 0 && this.tanamanKelompok.suhu_maks == 0) {
        this.tanamanKelompok.suhu = "> " + this.tanamanKelompok.suhu_min + "ºC";
      } else if (this.tanamanKelompok.suhu_min == 0 && this.tanamanKelompok.suhu_maks > 0) {
        this.tanamanKelompok.suhu = "< " + this.tanamanKelompok.suhu_maks + "ºC";
      } else if (this.tanamanKelompok.suhu_min > 0 && this.tanamanKelompok.suhu_maks > 0) {
        this.tanamanKelompok.suhu = this.tanamanKelompok.suhu_min + "ºC - " + this.tanamanKelompok.suhu_maks + "ºC";
      }

      //kelembapan kosong
      if (this.tanamanKelompok.kelembaban_min > 0 && this.tanamanKelompok.kelembaban_maks == 0) {
        this.tanamanKelompok.kelembapan = "> " + this.tanamanKelompok.kelembaban_min + "%";
      } else if (this.tanamanKelompok.kelembaban_min == 0 && this.tanamanKelompok.kelembaban_maks > 0) {
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

  //method tampil tahun pada tabel
  kolomTahun(tahun){
    return tahun.substring(0, 4);
  }

  //method load hasil perhitungan rata-rata
  loadDataKlasifikasi(dataKlasifikasi) {

    //post data
    this.http.post(this.link + '/klimaservice/public/api/kelompok/detail/both/tampilKlasifikasi', dataKlasifikasi).subscribe((data)=>{
      //simpan data rata-rata
      this.hasilIklim = data[0];
    });

  }

  //modal show konfirmasi anggota
  modalKonfirmasi (pending) {
    this.nis = pending['nis'];
    this.nama = pending['nama'];
    this.angkatan = pending['angkatan'];
    $('#modalKonfirmasi').modal('show');
  }

  //method konfirmasi siswa
  konfirmasi (nis) {
    var data = {
      nis:nis,
      kd_kelompok:this.kd_kelompok
    }
    this.http.put(this.link + '/klimaservice/public/api/kelompok/detail/guru/konfirmasi', data).subscribe((data)=>{
      //reload tabel kelompok
      data = {
        kd_kelompok:this.kd_kelompok
      }
      //load tabel siswa
      this.loadDataAnggota(data);
      $('#modalKonfirmasi').modal('hide');
    });
  }

  //method tolak siswa
  tolakReq (nis) {
    var data = {
      nis:nis
    }
    this.http.put(this.link + '/klimaservice/public/api/kelompok/detail/guru/tolakReq', data).subscribe((data)=>{
      //reload tabel kelompok
      data = {
        kd_kelompok:this.kd_kelompok
      }
      //load tabel siswa
      this.loadDataAnggota(data);
      $('#modalKonfirmasi').modal('hide');
    });
  }

  //kembali
  kembali () {
    this.router.navigateByUrl('/menu_utama_guru/swakaryaGuru');
  }

}
