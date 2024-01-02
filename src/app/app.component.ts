import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'spica-task';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get("https://api4.allhours.com/api/v1/Users").subscribe();
  }
}
