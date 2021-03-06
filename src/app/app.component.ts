import { Component, OnInit, HostListener } from '@angular/core';
import { Item, ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'firstpwa';
  items: Array<Item>;
  deferredPrompt: any;
  showButton = false;
    
  constructor(
    private apiService: ApiService
  ) { }
  
  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.fetch().subscribe(
      (data: Array<Item>) => {
        console.log(data);
        this.items = data;
      }, (err) => {
        console.log(err);
      }
    );
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    console.log(this.deferredPrompt);
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }
}