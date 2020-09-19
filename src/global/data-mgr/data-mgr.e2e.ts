//import { newE2EPage } from '@stencil/core/testing';
//import {DataMgr} from '../data-mgr/data-mgr';
import { isProdMode } from '../../helpers/utils';

it('should be in prod mode', () => {
  expect(isProdMode()).toEqual(true);
})