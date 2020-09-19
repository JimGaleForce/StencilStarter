import { Component, h, State } from '@stencil/core';
import { DataMgr } from '../../global/data-mgr/data-mgr';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  @State() refreshCount: number = 0;

  constructor() {
    DataMgr.onEvent('app-root', 'loading-change', { fn: () => { ++this.refreshCount } })
  }

  onTabsDidChange(event: CustomEvent<{ tab: string }>) {
    this.doTabChange(event.detail.tab);
  }

  doTabChange(tab: string) {
    if (tab === 'tab-home') {
      DataMgr.IsLoaded = false;
      DataMgr.doEvent('loading-change');

      DataMgr.doEvent('update-home');
    }

    if (tab === 'tab-about') {
      DataMgr.IsLoaded = false;
      DataMgr.doEvent('loading-change');

      DataMgr.doEvent('update-about');
    }
  }

  componentDidRender() {
    if (!DataMgr.IsLoaded) {
      DataMgr.IsLoaded = true;
      this.refreshCount++;
    }
  }

  render() {
    DataMgr.topLoadSettings();

    return [
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="tab-home" />
          <ion-route url="/about" component="tab-about" />
          {/* <ion-route url="/profile/:name" component="app-profile" /> */}
        </ion-router>

        <div id='main-spinner-background' class={DataMgr.IsLoaded ? 'hide' : ''}>
          <ion-spinner id='main-spinner' class={'spinner ' + (DataMgr.IsLoaded ? 'hide' : '')} name='crescent' paused={DataMgr.IsLoaded}></ion-spinner>
        </div>

        <ion-tabs onIonTabsDidChange={e => this.onTabsDidChange(e)}>

          <ion-tab tab="tab-home" component="page-home">
          </ion-tab>

          <ion-tab tab="tab-about" component="page-about">
          </ion-tab>

          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="tab-home">
              <ion-icon name='build'></ion-icon>
              <ion-label>Home</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="tab-about">
              <ion-icon class='svg-icon' src="/assets/icon/Block-Chart 1.svg"></ion-icon>
              <ion-label>About</ion-label>
            </ion-tab-button>
          </ion-tab-bar>

        </ion-tabs>
      </ion-app>,
      <ion-popover-controller></ion-popover-controller>,
      <ion-modal-controller></ion-modal-controller>,
      <ion-action-sheet-controller></ion-action-sheet-controller>,
      <ion-alert-controller></ion-alert-controller>

    ];
  }
}
