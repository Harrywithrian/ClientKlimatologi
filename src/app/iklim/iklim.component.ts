import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-iklim',
  templateUrl: './iklim.component.html',
  styleUrls: ['./iklim.component.css']
})
export class IklimComponent implements OnInit {

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //deklarasi variable
  kodeAwal;
  kodeAkhir;
  dataIklim;
  bulan;
  blnstr;
  tahun;

  //validasi
  validasi;
  tabelKosong;

  //show validasi
  showValidasi = true;

  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit() {

    //validasi modal
    $('#cariIklim').modal({detachable:false});

    //set validasi
  	this.validasi = "";
    this.tabelKosong = false;

  	$("#dropBulanAwal").dropdown();
  	$("#dropBulanAkhir").dropdown();
  }

  //modal cari iklim
  openModalCari() {
  	$('#cariIklim').modal('show');
  };

  //method cari iklim
  cariIklim() {

    //ambil data pada form
  	var value = $('#formCariIklim').form('get values');
  	var kodeAwal = value.tahunAwal + value.bulanAwal;
  	var kodeAkhir = value.tahunAkhir + value.bulanAkhir;

    //simpan data value
    var data = {
      kodeAwal:kodeAwal,
      kodeAkhir:kodeAkhir
    }
    //validasi data kosong
    if (value.tahunAwal == "" || value.tahunAkhir == "" || value.bulanAwal == "" || value.bulanAkhir == "") {
      //set validasi
      this.showValidasi = false;
      this.validasi = "Field Tidak Boleh Kosong";
    }

    //validasi kode tidak sesuai
  	else if (kodeAwal > kodeAkhir) {
      //set validasi
      this.showValidasi = false;
  		this.validasi = "Tahun Awal Tidak Boleh Lebih Besar Dari Tahun Akhir";
  	} else {

      //set validasi kosong
  		this.validasi = "";

      //tutup modal
      $('#cariIklim').modal('hide');

      //post data
      this.http.post(this.link + '/klimaservice/public/api/cariIklim', data).subscribe((data)=>{

        //simpan pada variable
        this.dataIklim = data;

        //validasi data kosong
        if (this.dataIklim.length == 0) {
          this.tabelKosong = false;
        } else {
          this.tabelKosong = true;
        }

        this.dataIklim.forEach((item) => {
            item.kd_klimatologi = this.setBulan(item.kd_klimatologi);
            item.lpm = item.lpm.substring(0, 5);
        });

        $('#cariIklim').modal('hide');
        $('#formCariIklim').form('clear');
        this.showValidasi = true;

      });
  	}
  }

  setBulan(kode){
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

    this.blnstr = this.blnstr + " " + this.tahun;
    return this.blnstr;
  };

}
