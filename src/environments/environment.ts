// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// live data

// to create build
// node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod

// scp -i ~/Downloads/yskill.pem ~/clickUsaPlatformLatest/platform-2.1/platform-2.1.zip ubuntu@3.6.88.86:/var/www/


// platform-2.1.zip 


// local data
// export const environment = {
//     production: false,
//     scheme : 'https://',
//     apiUrl: 'api.usleadwave.com',// api.usleadwave.com
//     filename: 'offers.csv',
//     statsFileName:'stats.csv'
// };

export const environment = {
    production: false,
    scheme : 'http://',
    apiUrl: 'localhost:3000',
    filename: 'offers.csv',
    statsFileName:'stats.csv'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
