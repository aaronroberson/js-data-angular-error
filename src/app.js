'use strict';

require('jquery');
require('angular');
require('moment');
require('lodash');
require('datatables');
require('metismenu');
require('js-data');
require('js-data-angular');

// TODO exclude angular-sanitize from bower webpack plugin successfully
require('angular-sanitize');
require('angular-bootstrap');
require('angular-datepicker');
require('angular-dialog-service');
require('angular-loading-bar');
require('angular-toastr');
require('angular-ui-select');
require('angular-ui-utils');
require('checklist-model');
require('jquery.scrollbar');
require('angular-ui-layout/src/ui-layout');

// TextAngular must follow rangy
window.rangy = require('rangy');
window.rangy.saveSelection = require('rangy/lib/rangy-selectionsaverestore');
require('textAngular');

angular.module('GSNPortal', [
  require('angular-animate'),
  'ui.bootstrap',
  require('angular-cookies'),
  'datePicker',
  require('angular-datatables'),
  'datatables.bootstrap',
  'datatables.colvis',
  'datatables.tabletools',
  'datatables.scroller',
  'datatables.columnfilter',
  'dialogs.main',
  require('angular-jwt'),
  'angular-loading-bar',
  require('angular-messages'),
  require('angular-resource'),
  'ngSanitize',
  require('angular-storage'),
  'toastr',
  require('angular-touch'),
  require('angular-translate'),
  'ui.layout',
  require('angular-ui-router'),
  'checklist-model',
  'jQueryScrollbar',
  'textAngular',
  'ui.select',
  'ui.utils',
  require('angular-utils-pagination')
]);
