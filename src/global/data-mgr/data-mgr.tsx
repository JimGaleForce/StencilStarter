import { getUrl, postUrl, toggleClass, getMe } from "../../helpers/utils";

export class DataMgr {
  static instance: DataMgr = null;
  static IsLoaded: boolean = false;

  basebaseUrl: string = '$api$';

  events: any = {};
  public settings: Settings = null;

  currentRoute: string = '';

  constructor() {
    if (DataMgr.instance === null) {
      DataMgr.instance = this;

      DataMgr.onEvent('data-manager', 'onLoad', {
        fn: async () => {
          await (await DataMgr.get()).getStartup();
        }
      });

      DataMgr.onEvent('data-manager', 'route-changed', {
        fn: async (detail) => {
          this.routeChanged(detail);
        }
      });

      this.loadSettings();
    }
  }

  async getStartup() {
    //this.rulesData = await getUrl(this.baseUrl) as Rule[];

    DataMgr.doEvent('got-startup-data');
  }

  static topLoadSettings() {
    if (DataMgr.instance === null) {
      new DataMgr();
    }

    DataMgr.instance.loadSettings();
  }

  routeChanged(data: any) {
    var route = data.route.toLowerCase();

    if (this.currentRoute !== route) {
      DataMgr.IsLoaded = false;
      DataMgr.doEvent('loading-change');
      this.currentRoute = route;

      var coreRoute = '';
      var prefs = ['/detail', '/edit'];
      for (var i = 0; i < prefs.length; i++) {
        if (route.indexOf(prefs[i]) === 0) {
          coreRoute = prefs[i];
          route = route.substring(prefs[i].length + 1);
        }
      }

      if (coreRoute === '/detail') {
      } else if (coreRoute === '/edit') {
      } else {
        DataMgr.IsLoaded = true;
        DataMgr.doEvent('loading-change');
      }
    }
  }

  loadSettings() {
    //Settings-2: set here
    var defaultSettings = {
      creator: "", darkMode: false
    };

    try {
      this.settings = JSON.parse(localStorage.getItem('settings')) as Settings;

      if (this.settings === null) {
        this.settings = defaultSettings;
      }
    } catch {
      this.settings = defaultSettings;
    }

    var ionApp = document.getElementsByTagName('ion-app');
    if (ionApp && ionApp.length > 0) {
      toggleClass(ionApp[0] as Element, 'nightmode', this.settings.darkMode);
      toggleClass(ionApp[0] as Element, 'daymode', !this.settings.darkMode);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    } catch {
      console.log('could not save settings');
    }
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async get() {
    if (DataMgr.instance === null) {
      new DataMgr();
    }

    return DataMgr.instance;
  }

  //--events--------------------------//

  static async onEvent(source: string, name: string, data: any) {
    var inst = await DataMgr.get();
    var eventList = inst.events[name] || [];
    var single = eventList.indexOf(e => e.source === source);
    data.source = source;
    if (single > -1) {
      eventList.splice(single, 1);
    }
    eventList.push(data);
    inst.events[name] = eventList;
    //log('added:' + name + " from " + source, 'events', 'data-manager');
  }

  static async doEvent(name: string, data: any = null) {
    var inst = await DataMgr.get();
    var eventList = inst.events[name] || [];
    for (var i = 0; i < eventList.length; i++) {
      if (typeof eventList[i].fn === 'function') {
        if (data === null) {
          eventList[i].fn()
        }
        else {
          eventList[i].fn(data);
        }
      }
    }
    //log('fired:' + name, 'events', 'data-manager');
  }
}

export interface Settings {
  darkMode: boolean;
  creator: string;
}
