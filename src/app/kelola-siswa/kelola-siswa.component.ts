import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//jquery
declare var $:any;

@Component({
  selector: 'app-kelola-siswa',
  templateUrl: './kelola-siswa.component.html',
  styleUrls: ['./kelola-siswa.component.css']
})

export class KelolaSiswaComponent implements OnInit {

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable
  dataSiswa;
  fieldCariSiswa;
  hapusNis;
  hapusNama;

  //variable validasi
  d = new Date();
  tahunSekarang = this.d.getFullYear();
  countVerifikasi = 0;
  errorTambah;
  errorUbah;
  validasiKosong;

  //show hide konten
  showTambah        = true;
  showUbah          = true;
  showVerifikasi    = false;
  showKonten        = true;

  //show hide validasi
  tabelKosong           = true;
  showValGagalTambah    = true;
  showValBerhasilTambah = true;
  showValGagalUbah      = true;
  showValBerhasilUbah   = true;

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService) { }

  ngOnInit() {

    //modal
    $('#modalHapusSiswa').modal({detachable:false});

    //dropdown
    $("#tambahJKelamin").dropdown();
    $("#tambahJurusan").dropdown();
    $("#ubahJKelamin").dropdown();
    $("#ubahJurusan").dropdown();
    $("#resetPass").dropdown();
    
    //load data siswa ke service
  	this.http.get(this.link + '/klimaservice/public/api/siswa/tampil').subscribe((data)=>{
      
      //simpan pada variable
      this.dataSiswa = data;

      //validasi data kosong
      if (this.dataSiswa.length == 0) {
        this.tabelKosong = false;
      } else {
        this.tabelKosong = true;
        this.validasiKosong = "Data Kosong";
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

  //method tampil form tambah siswa
  toggleTambah() {

    //reset field
    $('#tambahSiswa').form('clear');

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

  //method show hide ubah data guru
  toggleUbah(item) {

    //validasi jika form tambah tampil
    if (this.showTambah == false) {
      this.showTambah = true;
    }

    //hide validasi error
    if (this.showValGagalUbah == false) {
      $('#valUbahGagal').transition('fade');
      this.showValGagalUbah = true;
    }

    //menampilkan form ubah
    if (this.showUbah == true) {
      this.showUbah = false;
    }

    //masukkan data pada form
    $('#ubahSiswa').form('set values',{
      ubahNoInduk: item.nis,
      noIndukLama: item.nis,
      ubahNama:item.nama,
      ubahAngkatan:item.angkatan,
      ubahJurusan:item.jurusan,
      passwordLama:item.password,
      ubahJKelamin:item.j_kelamin,
      resetPass:"tidak"
    });

    //scroll up otomatis
    $('html, body').animate({
      scrollTop: $("#kontenKelolaSiswa").offset().top
    }, 2000);
  }

  //method tambah siswa
  tambahSiswa() {

    //ambil data form tambah
    var value = $('#tambahSiswa').form('get values');

    //validasi angka pada nama
    var validasiAngka = /\d/.test(value.tambahNama);

    //simpan data value
    var data = {
      nis:value.tambahNoInduk,
      nip:localStorage.getItem('nip'),
      nama:value.tambahNama,
      angkatan:value.tambahAngkatan,
      jurusan:value.tambahJurusan,
      j_kelamin:value.tambahJKelamin,
      password:'123123'
    }

    //validasi apabila field kosong
    if (value.tambahNoInduk == "" || value.tambahNama == "" || value.tambahAngkatan == ""  || value.tambahJurusan == "" || value.tambahJKelamin == "") {
      
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
      this.errorTambah = "Nama Siswa Tidak Boleh Berupa Angka (0~9)!";

    }

    //validasi angkatan
    else if (value.tambahAngkatan > this.tahunSekarang || value.tambahAngkatan < 1000) {
      
      if (this.showValGagalTambah == true) {
        $('#valTambahGagal').transition('fade');
      }
      this.showValGagalTambah = false;
      this.errorTambah = "Tahun Angkatan Tidak Valid!";

    }

    //berhasil
    else if (validasiAngka == false) {

      //kirim data tambah
      this.http.post(this.link + '/klimaservice/public/api/siswa/tambah', data).subscribe((data)=>{

        //data berhasil ditambah
        if (data['validasi'] == true) {

          //reset kolom
          $('#tambahSiswa').form('clear');
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
          this.errorTambah = "Nomor Induk (NIS) Tidak Boleh Sama!";
        }
      });
    }
  }

  //method tutup form ubah
  closeUbah() {
    this.showValGagalUbah = true;
    this.showUbah         = true;
  }

  //method show modal hapus
  modalHapusGuru(nip, nama) {

    //variable hapus
    this.hapusNis     = nip;
    this.hapusNama    = nama;

    //hide form ubah data jika sedang tampil
    if (this.showUbah == false) {
      this.showUbah = true;
    }

    //tampil modal hapus
    $('#modalHapusSiswa').modal('show');
  }

  //method hide modal
  closeModal() {
    $('#modalHapusSiswa').modal('hide');   
  }

  //method ubah data siswa
  ubahSiswa() {

    //ambil data form tambah
    var value = $('#ubahSiswa').form('get values');

    //validasi angka dalam ubah nama
    var validasiAngka = /\d/.test(value.ubahNama);
    var pass;

    //validasi ubah password
    if (value.resetPass == "tidak") {
      pass = String(value.passwordLama);
    } else {
      pass = "123123";
    }

    //simpan data value
    var data = {
      nisLama:value.noIndukLama,
      nisBaru:value.ubahNoInduk,
      nama:value.ubahNama,
      j_kelamin:value.ubahJKelamin,
      jurusan:value.ubahJurusan,
      angkatan:value.ubahAngkatan,
      password:pass,
    }

    //validasi apabila field kosong
    if (value.ubahNoInduk == "" || value.ubahNama == "" || value.ubahAngkatan == "") {
      
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
      this.errorUbah = "Nama Siswa Tidak Boleh Berupa Angka (0~9)!";

    }

    //validasi angkatan
    else if (value.ubahAngkatan > this.tahunSekarang || value.ubahAngkatan < 1000) {
      
      if (this.showValGagalUbah == true) {
        $('#valUbahGagal').transition('fade');
      }
      this.showValGagalUbah = false;
      this.errorUbah = "Tahun Angkatan Tidak Valid!";

    }

    //berhasil
    else if (validasiAngka == false) {

      //kirim data ubah
      this.http.put(this.link + '/klimaservice/public/api/siswa/ubah', data).subscribe((data)=>{

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

        //validasi jika nis sama
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

  //method hapus siswa
  hapusSiswa(nis) {

    //kirim data hapus
    this.http.delete(this.link + '/klimaservice/public/api/siswa/hapus/' +nis).subscribe((data)=>{
      $('#modalHapusSiswa').modal('hide');
    });
    
    //reload data guru
    setTimeout(() =>{
      this.reloadData();
    }, 500);
  }

  //method cari siswa
  cariSiswa() {

    //simpan data value
    var data = {
      dataCari:this.fieldCariSiswa
    }

    //kirim data cari ke service
    this.http.post(this.link + '/klimaservice/public/api/siswa/cari', data).subscribe((data)=>{
      this.dataSiswa = data;

      //validasi data kosong
      if (this.dataSiswa.length == 0) {
        this.tabelKosong = false;
        this.validasiKosong = "Data Siswa Tidak Ditemukan";
      } else {
        this.tabelKosong = true;
      }
      this.fieldCariSiswa = "";

    });
  }

  //method reload tabel guru
  reloadData() {

    //request data guru
    this.http.get(this.link + '/klimaservice/public/api/siswa/tampil').subscribe((data)=>{

      //simpan hasil pada variable
      this.dataSiswa = data;

      //validasi data kosong
      if (this.dataSiswa.length == 0) {
        this.tabelKosong = false;
      } else {
        this.tabelKosong = true;
      }
    });
  }

}
