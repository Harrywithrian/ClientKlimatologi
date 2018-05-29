import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//jquery
declare var $:any;

@Component({
  selector: 'app-kelola-guru',
  templateUrl: './kelola-guru.component.html',
  styleUrls: ['./kelola-guru.component.css']
})
export class KelolaGuruComponent implements OnInit {

  //link meminta data
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable
  dataGuru;

  //variable hapus
  hapusNip;
  fieldCariGuru;
  hapusNama;
  hapusStatus;

  //variable validasi
  countVerifikasi = 0;
  countPengelola = 0;
  errorTambah;
  errorUbah;
  errorHapus;
  validasiKosong;

  //show or hide konten
  showTambah        = true;
  showUbah          = true;
  showVerifikasi    = false;
  showKonten        = true;

  //show or hide validation
  tabelKosong           = false;
  showValBerhasilTambah = true;
  showValBerhasilUbah   = true;
  showValGagalTambah    = true;
  showValGagalUbah      = true;

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService) { }

  ngOnInit() {

    //modal
    $('#modalHapusGuru').modal({detachable:false});

    //dropdown
    $("#tambahStatus").dropdown();
    $("#ubahStatus").dropdown();
    $("#resetPass").dropdown();
    

    //validasi hitung gagal verifikasi
    this.countVerifikasi = 0;

    //request data guru
  	this.http.get(this.link + '/klimaservice/public/api/guru/tampil').subscribe((data)=>{

      //simpan hasil pada variable
      this.dataGuru = data;

      //hitung jumlah pengelola
      this.dataGuru.forEach((item) => {
        if (item.status == "pengelola") {
          this.countPengelola = this.countPengelola + 1;
        }
      });
      
      //validasi data kosong
      if (this.dataGuru.length == 0) {
        this.tabelKosong = false;
        this.validasiKosong = "Data Kosong";
      } else {
        this.tabelKosong = true;
      }

    });
  }

  //method verifikasi password
  verifikasi() {
    //ambil data form verifikasi
    var value     = $('#formVerifikasi').form('get values');
    var password  = value.verifikasiPass;
    var cookie    = localStorage.getItem('password');

    //validasi password benar
    if (password == cookie) {
      this.showVerifikasi  = true;
      this.showKonten      = false;
    } else {

      //validasi password salah
      $('#formVerifikasi').form('clear');
      this.countVerifikasi = this.countVerifikasi + 1;

      // validasi count 3x
      if (this.countVerifikasi == 3) {
        localStorage.clear();
        this.router.navigateByUrl('/login');
      }
    }
  }

  //show hide tambah data guru
  toggleTambah() {

    //reset field
    $('#tambahGuru').form('clear');

    //validasi jika form ubah tampil
    if (this.showUbah == false) {
      this.showUbah = true;
    }

    //toogle form tambah data
    if (this.showTambah == true) {
      this.showTambah = false;
    } else
    if (this.showTambah == false) {
      this.showTambah = true;
    }

    //hide validasi error
    if (this.showValGagalTambah == false) {
      $('#valTambahGagal').transition('fade');
      this.showValGagalTambah = true;
    }
  }

  //show hide ubah data guru
  toggleUbah(item) {

    //validasi jika form tambah tampil
    if (this.showTambah == false) {
      this.showTambah = true;
    }

    //validasi jika mengubah data diri
    if (item.nip == localStorage.getItem('nip')) {
      $('#btnUbahGuru').addClass('disabled');
    } else {
      $('#btnUbahGuru').removeClass('disabled');
    }

    //menampilkan form ubah
    if (this.showUbah == true) {
      this.showUbah = false;
    }

    //hide validasi error
    if (this.showValGagalUbah == false) {
      $('#valUbahGagal').transition('fade');
      this.showValGagalUbah = true;
    }

    //masukkan data pada form
    $('#ubahGuru').form('set values',{
      ubahNoInduk: item.nip,
      noIndukLama: item.nip,
      ubahNama:item.nama,
      ubahStatus:item.status,
      passwordLama:item.password,
      resetPass:"tidak"
    });

    //scroll up otomatis
    $('html, body').animate({
      scrollTop: $("#kontenKelolaGuru").offset().top
    }, 2000);
  }

  //tutup form ubah
  closeUbah() {
    this.showValGagalUbah = true;
    this.showUbah         = true;
  }

  //show modal hapus
  modalHapusGuru(nip, nama, status) {

    //variable hapus
    this.hapusNip     = nip;
    this.hapusNama    = nama;
    this.hapusStatus  = status;

    //hide form ubah data jika sedang tampil
    if (this.showUbah == false) {
      this.showUbah = true;
    }

    //validasi apabila pengelola kurang dari 1
    if (this.countPengelola == 1 && this.hapusStatus == "pengelola") {
      this.errorHapus = "Anda Tidak Dapat Menghapus Pengelola Apabila Jumlah Dari Pengelola Yang Terdaftar Hanya 1.";
      $('#btnHapusGuru').addClass('disabled');

    //validasi jika menghapus data diri
    } else if (this.hapusNip == localStorage.getItem('nip')){
      this.errorHapus = "Anda Tidak Dapat Menghapus Data Diri Anda Sendiri.";
      $('#btnHapusGuru').addClass('disabled');

    //button hapus aktif
    } else {
      this.errorHapus = "Apakah " + this.hapusStatus + " dengan data tersebut akan dihapus?";
      $('#btnHapusGuru').removeClass('disabled');
    }

    //tampil modal hapus
    $('#modalHapusGuru').modal('show');
  }

  //hide modal
  closeModal() {
    //tampil modal hapus
    $('#modalHapusGuru').modal('hide');   
  }

  //tambah data guru
  tambahGuru() {

    //ambil data form tambah
    var value = $('#tambahGuru').form('get values');

    //validasi angka pada nama
    var validasiAngka = /\d/.test(value.tambahNama);

    //simpan data value
    var data = {
      nip:value.tambahNoInduk,
      nama:value.tambahNama,
      status:value.tambahStatus,
      password:'123123'
    }

    //validasi apabila field kosong
    if (value.tambahNoInduk == "" || value.tambahNama == "" || value.tambahStatus == "") {

      if (this.showValGagalTambah == true) {
        $('#valTambahGagal').transition('fade');
      }
      this.showValGagalTambah = false;
      this.errorTambah = "Field Tidak Boleh Kosong!"; 

    }

    //validasi nama berupa angka
    else if (validasiAngka == true){
      
      if (this.showValGagalTambah == true) {
        $('#valTambahGagal').transition('fade');
      }
      this.showValGagalTambah = false;
      this.errorTambah = "Nama Guru Tidak Boleh Berupa Angka (0~9)!";

    }

    //berhasil
    else if (validasiAngka == false) {
      
      //kirim data tambah
      this.http.post(this.link + '/klimaservice/public/api/guru/tambah', data).subscribe((data)=>{

        //data berhasil ditambah
        if (data['validasi'] == true) {

          //reset kolom
          $('#tambahGuru').form('clear');
          this.reloadData();

          //validasi berhasil tambah
          if (this.showValGagalTambah == false) {
            $('#valTambahGagal').transition('fade');
          }
          this.showValGagalTambah = true;
          setTimeout(() =>{
            $('#valTambahBerhasil').transition('fade');
            this.showValBerhasilTambah = false;
          }, 500);

          //hidden validasi tambah
          setTimeout(() =>{
            $('#valTambahBerhasil').transition('fade');
            this.showValBerhasilTambah = true;
          }, 3000);
        }

        //validasi jika nip tidak unik
        else if (data['validasi'] == false) {

          // validasi error data nip sama
          if (this.showValGagalTambah == true) {
            $('#valTambahGagal').transition('fade');
          }
          this.showValGagalTambah = false;
          this.errorTambah = "Nomor Induk (NIP) Tidak Boleh Sama!";
        }
      });
    }
  }

  //ubah data guru
  ubahGuru() {

    //ambil data form ubah
    var value = $('#ubahGuru').form('get values');

    //validasi angka dalam ubah nama
    var validasiAngka = /\d/.test(value.ubahNama);
    var pass;

    //validasi ubah password
    if (value.resetPass == "tidak") {
      pass = String(value.passwordLama);
    } else {
      pass = "123123";
    }

    // //simpan data value
    var data = {
      nipLama:value.noIndukLama,
      nipBaru:value.ubahNoInduk,
      nama:value.ubahNama,
      status:value.ubahStatus,
      password:pass
    }

    //validasi field kosong
    if (value.ubahNoInduk == "" || value.ubahNama == "" || value.ubahStatus == "") {

      if (this.showValGagalUbah == true) {
        $('#valUbahGagal').transition('fade');
      }
      this.showValGagalUbah = false;
      this.errorUbah = "Field Tidak Boleh Kosong!"; 

    }

    //validasi nama berupa angka
    else if (validasiAngka == true){
      
      if (this.showValGagalUbah == true) {
        $('#valUbahGagal').transition('fade');
      }
      this.showValGagalUbah = false;
      this.errorUbah = "Nama Guru Tidak Boleh Berupa Angka (0~9)!";

    }

    //berhasil
    else if (validasiAngka == false) {
      
      //kirim data ubah
      this.http.put(this.link + '/klimaservice/public/api/guru/ubah', data).subscribe((data)=>{

        //data berhasil diubah
        if (data['validasi'] == true) {

          //reset data pada tabel
          this.reloadData();

          //validasi berhasil ubah
          if (this.showValGagalUbah == false) {
            $('#valUbahGagal').transition('fade');
          }
          this.showValGagalUbah = true;
          setTimeout(() =>{
            $('#valUbahBerhasil').transition('fade');
            this.showValBerhasilUbah = false;
          }, 500);

          //hidden validasi ubah
          setTimeout(() =>{
            $('#valUbahBerhasil').transition('fade');
            this.showValBerhasilUbah = true;
          }, 3000);
        } 

        //validasi jika nip sama
        else if (data['validasi'] == false) {

          if (this.showValGagalUbah == true) {
            $('#valUbahGagal').transition('fade');
          }
          this.showValGagalUbah = false;
          this.errorUbah = "Nomor Induk (NIP) Tidak Boleh Sama!";

        }

      });
    }
  }

  //hapus guru
  hapusGuru(nip) {

    //kirim data hapus
    this.http.delete(this.link + '/klimaservice/public/api/guru/hapus/' +nip).subscribe((data)=>{
      $('#modalHapusGuru').modal('hide');
    });
    
    //reload data guru
    setTimeout(() =>{
      this.reloadData();
    }, 500);
   
  }

  //method cari guru
  cariGuru() {
    //simpan data value
    var data = {
      dataCari:this.fieldCariGuru
    }

    //kirim data cari ke service
    this.http.post(this.link + '/klimaservice/public/api/guru/cari', data).subscribe((data)=>{
      this.dataGuru = data;

      //validasi data kosong
      if (this.dataGuru.length == 0) {
        this.tabelKosong = false;
        this.validasiKosong = "Data Guru Tidak Ditemukan";
      } else {
        this.tabelKosong = true;
      }
      this.fieldCariGuru = "";

    });
  }

  //reload tabel guru
  reloadData() {

    //request data guru
    this.http.get(this.link + '/klimaservice/public/api/guru/tampil').subscribe((data)=>{

      //simpan hasil pada variable
      this.dataGuru = data;

      //validasi data kosong
      if (this.dataGuru.length == 0) {
        this.tabelKosong = false;
        this.validasiKosong = "Data Kosong";
      } else {
        this.tabelKosong = true;
      }

    });
  }

}
