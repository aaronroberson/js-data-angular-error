export default ngModule => {
  ngModule.config(function($httpProvider, $logProvider, $compileProvider, $tooltipProvider, jwtInterceptorProvider, cfpLoadingBarProvider, APP_SETTINGS, toastrConfig) {

    // Turn debug logging output off for production
    $logProvider.debugEnabled(APP_SETTINGS.ENV !== 'production');

    // Turn debug info off for production
    $compileProvider.debugInfoEnabled(APP_SETTINGS.ENV !== 'production');

    // Turn spinner off on loading bar
    cfpLoadingBarProvider.includeSpinner = false;

    // Angular UI Bootstrap tooltip defaults
    $tooltipProvider.options({
      popupDelay: 1000,
      appendToBody: true
    });

    _.extend(toastrConfig, {
      preventOpenDuplicates: true
    });

    /*
    $provide.decorator('taOptions', ['$delegate', function(taOptions) {
      // $delegate is the taOptions we are decorating
      taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['indent', 'outdent'],
        ['html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
      ];
    }]);
    */

    // Please note we're annotating the function so that the $injector works when the file is minified
    jwtInterceptorProvider.tokenGetter = ['config', function(config) {

      // Skip authentication for any requests ending in .html
      if (config.url.substr(config.url.length - 5) === '.html') {
        return null;
      }

      return JSON.parse(window.localStorage.getItem('auth-token'));
    }];

    // Make all HTTP requests that return in around the same time resolve in one digest
    $httpProvider.useApplyAsync(true);

    // Set the default headers
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common['Accept-Version'] = '2.0.0';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Register the httpInterceptor service
    $httpProvider.interceptors.push('httpInterceptor');

    // Register the JWT Interceptor service
    $httpProvider.interceptors.push('jwtInterceptor');

  });

  ngModule.config(function(dialogsProvider) {
    dialogsProvider.useBackdrop('static');
    dialogsProvider.useEscClose(false);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('sm');
  });

  ngModule.run(function($rootScope, $state, $stateParams, $log, APP_SETTINGS, AuthService, models, toastr, DTDefaultOptions) {

    var updatePromptShown = false;

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('assessments.list') }"> will set the <li>
    // to active whenever 'assessments.list' or one of its descendants is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // Datatables display 25 items per page by default
    DTDefaultOptions.setDisplayLength(25);

    DTDefaultOptions.setBootstrapOptions({
      TableTools: {
        classes: {
          container: 'btn-group',
          buttons: {
            normal: 'btn btn-default'
          }
        }
      },
      ColVis: {
        classes: {
          masterButton: 'btn btn-default'
        }
      },
      pagination: {
        classes: {
          ul: 'pagination pagination-sm'
        }
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState) {

      var whitelist = ['login', 'logout', '404', 'maintenance'];

      if (toState.name !== 'maintenance') {

        models.App.get(function(app) {
          $rootScope.companyName = app.name;

          $rootScope.maintenance = {
            active: app.disabled,
            message: app.messageDisabledHtml
          };

          if (app.disabled) {
            event.preventDefault();
            $state.go('maintenance');

          } else if (!_.contains(whitelist, toState.name) && !AuthService.isAuthenticated()) {
            // TODO ROLES: if (!AuthService.getSessionUser() || !_.contains(AuthService.getSessionUser().roles, toState.data.role)) {
            event.preventDefault();
            $state.go('login');
          }

          if (app.currentVersion > APP_SETTINGS.VERSION) {
            if (!updatePromptShown) {
              toastr.info('Update available <a href="javascript:history.go(0);" class="refresh">REFRESH</a>', {
                allowHtml: true,
                tapToDismiss: false,
                positionClass: 'toast-bottom-left',
                progressBar: true,
                closeButton: true
              });
              updatePromptShown = true;
            }
          }

        });
      }

    });

    //some error logging to reduce the amount of hair I pull out of my head :)
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.error('Error transitioning');
      $log.error('From state', fromState);
      $log.error('To stage', toState);
      $log.error('Error', error);
    });
  });
};
