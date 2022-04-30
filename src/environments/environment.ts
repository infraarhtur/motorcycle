// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { cargarJSON } from '../app/functions/utilidades';
// const environmentConfig = cargarJSON('assets/json/environment-config.json');

 const environment = {
  
  production: false,
  whatsapp: '+573238150323',
  urlBaseServicio : 'http://localhost:3000',
  criptoJsKey : 'La$D0$Ru3das.com',
 
  redirecCaducoToken:'https://localhost:4200/#/login',
  redirecTokenInvalido:'https://localhost:4200/#/login',
  nameCloudinary:'lasdosruedas',
  presetCloudinary: 'motorcycles_preset',

  firebase: {
    apiKey: 'AIzaSyBNOQDzryCrBN8DfJgwTAwjW0hspu54M_0',
    authDomain: 'lasdosruedas-8836c.firebaseapp.com',
    projectId: 'lasdosruedas-8836c',
    storageBucket: 'lasdosruedas-8836c.appspot.com',
    messagingSenderId: '997232626916',
    appId: '1:997232626916:web:017871fb8ec8a5860a30f1',
    measurementId: 'G-S47RK3HFJX'
  }
};

// if (environment.production == true){
  // Object.assign(environment, environmentConfig);
// }

export { environment };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
