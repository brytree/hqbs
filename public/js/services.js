angular.module('hqbsServices', ['ngResource'])

.factory('{Pic}', ['$resource',function($resource) {
  return $resource('/api/pics/:id', {id: '@id'}, 
    {
      'query': {isArray:false}, 
       update: {method: 'PUT'}
    });
}])
.factory('Pics', ['$resource', function($resource) {
  return $resource('/api/pics/all', {}, 
    {
      'query': {method:'GET', isArray:false}, 
    });
}])
.factory('Auth', ['$window', function($window) {
  return {
    saveToken: function(token) {
      $window.localStorage['secretposts-token'] = token;
    },
    getToken: function() {
      return $window.localStorage['secretposts-token'];
    },
    removeToken: function() {
      $window.localStorage.removeItem('secretposts-token');
    },
    isLoggedIn: function() {
      var token = this.getToken();
      return token ? true : false;
    },
    currentUser: function() {
      if (this.isLoggedIn()) {
        var token = this.getToken();
        try {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return payload;
        } catch(err) {
          return false;
        }
      }
    }
  }
}])
.factory('AuthInterceptor', ['Auth', function(Auth) {
  return {
    request: function(config) {
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}])
.factory('Alerts', [function() {
  var alerts = [];

  return {
    clear: function() {
      alerts = [];
    },
    add: function(type, msg) {
      alerts.push({type: type, msg: msg});
    },
    get: function() {
      return alerts;
    },
    remove: function(idx) {
      alerts.splice(idx, 1);
    }
  }
}])