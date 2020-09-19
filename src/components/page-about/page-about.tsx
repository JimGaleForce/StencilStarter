import { Component, h, State } from '@stencil/core';
import { toggleClass } from '../../helpers/utils';
import { DataMgr } from '../../global/data-mgr/data-mgr';
import { getMe } from '../../helpers/utils';
import moment from 'moment';

@Component({
  tag: 'page-about',
  styleUrl: 'page-about.css'
})
export class PageAbout {
  @State() renderCount: number = 0;
  metricsRules: any = null;
  metricsGroom: any = null;
  metricsRetokenize: any = null;

  metricsOverall: any = null;
  metricsDropToLink: any = null;

  constructor() {
    DataMgr.onEvent('settings', 'settings-changed', {
      fn: () => {
        this.renderCount++;
      }
    })
  }

  componentWillLoad() {
  }

  toggleDark(e) {
    var ionApp = document.getElementsByTagName('ion-app');
    var isDark = e.detail.checked;
    if (ionApp && ionApp.length > 0) {
      toggleClass(ionApp[0] as Element, 'nightmode', isDark);
      toggleClass(ionApp[0] as Element, 'daymode', !isDark);
    }

    DataMgr.instance.settings.darkMode = isDark;
    DataMgr.instance.saveSettings();
  }

  render() {
    var settings = DataMgr.instance.settings;

    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>AppName: Settings</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <h1>Settings</h1>

        <ion-item>
          <ion-label>Dark mode</ion-label>
          <ion-toggle checked={settings.darkMode}
            onIonChange={(e) => this.toggleDark(e)}></ion-toggle>
        </ion-item>
        <ion-item>
          <div class='full-line'>
            <ion-label class='edit-label'>creator (for new rules):</ion-label>
            <ion-input readonly class='editable' id='creator' value={getMe()}></ion-input>
          </div>
        </ion-item>
        <h1>About</h1>
        <ion-item class=''>
          Your app info goes here
        </ion-item>
        <ion-item class='aboutinfo'>
          courtesy of you
        </ion-item>
        <ion-item class='aboutinfo'>
          version 0.1.0.1
        </ion-item>
        <ion-item class='aboutinfo'>
          contact me for more
        </ion-item>

      </ion-content>
    ];
  }
}
