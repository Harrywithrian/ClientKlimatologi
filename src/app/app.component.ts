import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//indetify jquery
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private http:HttpClient){};

  ngOnInit(){
  };

}