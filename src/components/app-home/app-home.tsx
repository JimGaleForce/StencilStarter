import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {
  @State() page: any = null;

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Title</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        home
      </ion-content>
    ];
  }
}
