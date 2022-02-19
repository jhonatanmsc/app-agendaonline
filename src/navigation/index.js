/*

Array of object

Top level object can be:
1. Header
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- Header ---/

header

/--- nav Grp ---/

title
icon (if it's on top level)
tag
tagVariant
children

/--- nav Item ---/

icon (if it's on top level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)
tag
tagVariant

*/
import configurations from './configurations.ts';
//import customerService from './customerService.ts';
import dashboard from './dashboard.ts';
//import financial from './financial.ts';
//import medicalReport from './medicalReport.ts';
// import patients from './patients.ts';
//import reception from './reception.ts';
//import report from './report.ts';
// import stock from './stock.ts';

// Array of sections
export default [
  {
    header: 'Menus',
  },
  ...dashboard,
  ...configurations,
  //...customerService,
  //...financial,
  //...medicalReport,
  // ...patients,
  //...reception,
  //...report,
  // ...stock,
]
