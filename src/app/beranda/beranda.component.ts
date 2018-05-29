import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Chart } from './../chart';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-beranda',
  templateUrl: './beranda.component.html',
  styleUrls: ['./beranda.component.css'],
})
export class BerandaComponent implements OnInit {

  //link
  link = 'http://localhost:80/Skripsi';
  // link = 'http://klimatologi.online';

  //variable
  namaPengguna;
  statusPengguna;
  kodeCuaca:string;
  statusCuaca:any = {};
  statusDetik:any = {};
  statusSensor;
  tempSensor;
  booleanSensor;
  tabelHarian = [];

  //variable tanggal
  cuacaMenit;
  cuacaJam;
  cuacaTanggal;
  cuacaBulan;
  cuacaBulanStr;
  cuacaTahun;

  //show hide konten grafik
  showGrafik = true;

  //id canvas grafik
  @ViewChild('grafikSuhu') grafikSuhu:ElementRef;
  @ViewChild('grafikTekanan') grafikTekanan:ElementRef;
  @ViewChild('grafikKelembapan') grafikKelembapan:ElementRef;
  @ViewChild('grafikCurahHujan') grafikCurahHujan:ElementRef;
  @ViewChild('grafikKecAngin') grafikKecAngin:ElementRef;
  @ViewChild('grafikEvaporasi') grafikEvaporasi:ElementRef;

  constructor(private http:HttpClient, private router:Router, private cookieService: CookieService) { }

  ngOnInit() {

  	//nama pengguna
    this.namaPengguna = localStorage.getItem('nama');
    this.statusPengguna = localStorage.getItem('status');

    //tampil grafik
    if (this.statusPengguna == "kerumahtanggaan") {
      this.showGrafik = false;
    }

  	//request data cuaca
  	this.http.get(this.link + '/klimaservice/public/api/cuaca').subscribe((data)=>{

  	  //setting tanggal waktu
      this.kodeCuaca = data[0].kd_klimatologi;
      this.setTanggalCuaca(this.kodeCuaca);

      //simpan variable
      this.statusCuaca = data[0];

      //tampil data satu hari
      this.dataCuacaHarian(this.kodeCuaca.substring(0,8));

    });

  	//reload cuaca per menit
    setInterval(() => {

      //refresh data cuaca per menit
      this.http.get(this.link + '/klimaservice/public/api/cuaca').subscribe((data)=>{
        this.kodeCuaca = data[0].kd_klimatologi;
        this.setTanggalCuaca(this.kodeCuaca);
        this.statusCuaca = data[0];
      });
    }, 60000);

    //setting chart suhu
    var grafikSuhu = new Chart();
    grafikSuhu.init(this.grafikSuhu.nativeElement, "Suhu Udara");

    //setting chart tekanan
    var grafikTekanan = new Chart();
    grafikTekanan.init(this.grafikTekanan.nativeElement, "Tekanan Udara");

    //setting chart kelembapan
    var grafikKelembapan = new Chart();
    grafikKelembapan.init(this.grafikKelembapan.nativeElement, "Kelembapan Udara");

    //setting chart curah hujan
    var grafikCurahHujan = new Chart();
    grafikCurahHujan.init(this.grafikCurahHujan.nativeElement, "Curah Hujan");

    //setting chart kecepatan angin
    var grafikKecAngin = new Chart();
    grafikKecAngin.init(this.grafikKecAngin.nativeElement, "Kecepatan Angin");

    //setting chart knot
    var grafikEvaporasi = new Chart();
    grafikEvaporasi.init(this.grafikEvaporasi.nativeElement, "Ketinggian Air (Panci Evaporasi)");

    //reload cuaca per detik
    setInterval(() => {

      //refresh data cuaca
      this.http.get(this.link + '/klimaservice/public/api/cuaca/detik').subscribe((data)=>{
        this.statusDetik = data[0];

        console.log(this.statusDetik);

          //grafik berjalan
          grafikSuhu.addDataChart(this.statusDetik.suhu, "");
          grafikTekanan.addDataChart(this.statusDetik.tekanan, "");
          grafikKelembapan.addDataChart(this.statusDetik.kelembaban, "");
          grafikCurahHujan.addDataChart(this.statusDetik.curah_hujan, "");
          grafikKecAngin.addDataChart(this.statusDetik.k_angin, "");
          grafikEvaporasi.addDataChart(this.statusDetik.k_air, "");
      });
    }, 3000);

  }

  //method load data cuaca satu hari
  dataCuacaHarian(kode) {
    var data = {
      kode:kode
    }

    //request data tabel cuaca perhari
    this.http.post(this.link + '/klimaservice/public/api/cuaca/harian', data).subscribe((data)=>{

      //deklarasi variable
      var input;
      var temp:any = [];
      var tempEvap;
      var validasi1 = false;
      var validasi2 = false;
      var validasi3 = false;
      var validasi4 = false;
      temp = data;

      //data default
      for (var i = 0; i < 4; i++) {

        input = {
          suhu:"-",
          kelembaban:"-",
          tekanan:"-",
          curah_hujan:"-",
          lpm:"-",
          k_air:"-",
          k_angin:"-",
          arah_angin:"-"
        }
        this.tabelHarian.splice(i, 0, input);

      }

      //simpan data asli
      temp.forEach((item) => {
        
        //validasi jam 7
        if (item.kd_klimatologi.substring(8 , 12) == "0700" && validasi1 == false) {
          this.tabelHarian[0] = item;
          tempEvap = this.tabelHarian[0]['k_air'];
          this.tabelHarian[0]['k_air'] = tempEvap - this.tabelHarian[0]['k_air'];
          this.tabelHarian[0]['k_air'] = this.tabelHarian[0]['k_air'] + " ("+ tempEvap + ")";
          this.tabelHarian[0]['lpm'] = this.tabelHarian[0]['lpm'].substring(0, 5);
          validasi1 = true;
        }

        //validasi jam 1
        if (item.kd_klimatologi.substring(8 , 12) == "1300" && validasi2 == false) {
          this.tabelHarian[1] = item;
          this.tabelHarian[1]['k_air'] = tempEvap - this.tabelHarian[1]['k_air'];
          this.tabelHarian[1]['k_air'] = this.tabelHarian[1]['k_air'] + " ("+ tempEvap + ")";
          this.tabelHarian[1]['lpm'] = this.tabelHarian[1]['lpm'].substring(0, 5);
          validasi2 = true;
        }

        //validasi jam 5
        if (item.kd_klimatologi.substring(8 , 12) == "1700" && validasi3 == false) {
          this.tabelHarian[2] = item;
          this.tabelHarian[2]['k_air'] = tempEvap - this.tabelHarian[2]['k_air'];
          this.tabelHarian[2]['k_air'] = this.tabelHarian[2]['k_air'] + " ("+ tempEvap + ")";
          this.tabelHarian[2]['lpm'] = this.tabelHarian[2]['lpm'].substring(0, 5);
          validasi3 = true;
        }

        //validasi rata-rata
        if (item.status == "hari" && validasi4 == false) {
          this.tabelHarian[3] = item;
          this.tabelHarian[3]['k_air'] = this.tabelHarian[3]['evaporasi'];
          this.tabelHarian[3]['lpm'] = this.tabelHarian[3]['lpm'].substring(0, 5);
          validasi4 = true;
        }

      });

      //simpan data waktu
      this.tabelHarian[0]['kd_klimatologi'] = "07:00 WIB";
      this.tabelHarian[1]['kd_klimatologi'] = "13:00 WIB";
      this.tabelHarian[2]['kd_klimatologi'] = "17:00 WIB";
      this.tabelHarian[3]['kd_klimatologi'] = "Rata-Rata";

    });
  }

  //method setting tanggal
  setTanggalCuaca(kode){

    //variable
    this.cuacaMenit = kode.substring(10 , 12);
    this.cuacaJam = kode.substring(8 , 10);
    this.cuacaTanggal = kode.substring(6 , 8);
    this.cuacaBulan = kode.substring(4 , 6);
    this.cuacaTahun = kode.substring(0 , 4);

    //definisi bulan
    switch (this.cuacaBulan) {
      case "01":
        this.cuacaBulanStr = 'Januari';
        break;
      case "02":
        this.cuacaBulanStr = 'Februari';
        break;
      case "03":
        this.cuacaBulanStr = 'Maret';
        break;
      case "04":
        this.cuacaBulanStr = 'April';
        break;
      case "05":
        this.cuacaBulanStr = 'Mei';
        break;
      case "06":
        this.cuacaBulanStr = 'Juni';
        break;
      case "07":
        this.cuacaBulanStr = 'Juli';
        break;
      case "08":
        this.cuacaBulanStr = 'Agustus';
        break;
      case "09":
        this.cuacaBulanStr = 'September';
        break;
      case "10":
        this.cuacaBulanStr = 'Oktober';
        break;
      case "11":
        this.cuacaBulanStr = 'November';
        break;
      case "12":
        this.cuacaBulanStr = 'Desember';
        break;
    }
  }

  gambar(arahAngin) {
    if (arahAngin == "utara") {
      
    }
  }

}
