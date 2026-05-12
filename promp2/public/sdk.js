(function(global) {
  'use strict';

  function Monitor(options) {
    this.options = Object.assign({
      appVersion: '1.0.0',
      reportUrl: 'http://localhost:3000/api/report',
      sampleRate: 1,
      enablePerformance: true,
      enableError: true,
      enableException: true,
      enableResource: true,
      enableAPI: true,
      enablePV: true,
      userId: null
    }, options);

    this.userId = this.options.userId || this.generateUserId();
    this.deviceInfo = this.getDeviceInfo();
    this.pageStartTime = Date.now();
    this.clickCount = 0;
    this.maxScrollDepth = 0;

    this.init();
  }

  Monitor.prototype.generateUserId = function() {
    let id = localStorage.getItem('monitor_user_id');
    if (!id) {
      id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('monitor_user_id', id);
    }
    return id;
  };

  Monitor.prototype.getDeviceInfo = function() {
    const ua = navigator.userAgent;
    const deviceType = /Mobile|Android|iPhone|iPad|iPod/.test(ua) ? 'mobile' : 'desktop';
    
    let os = 'unknown';
    let osVersion = 'unknown';
    if (/Windows/.test(ua)) {
      os = 'Windows';
      const winMatch = ua.match(/Windows NT ([\d.]+)/);
      osVersion = winMatch ? winMatch[1] : 'unknown';
    } else if (/Mac OS X/.test(ua)) {
      os = 'macOS';
      const macMatch = ua.match(/Mac OS X ([\d_]+)/);
      osVersion = macMatch ? macMatch[1].replace(/_/g, '.') : 'unknown';
    } else if (/Android/.test(ua)) {
      os = 'Android';
      const androidMatch = ua.match(/Android ([\d.]+)/);
      osVersion = androidMatch ? androidMatch[1] : 'unknown';
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      os = 'iOS';
      const iosMatch = ua.match(/OS ([\d_]+)/);
      osVersion = iosMatch ? iosMatch[1].replace(/_/g, '.') : 'unknown';
    } else if (/Linux/.test(ua)) {
      os = 'Linux';
    }

    let browser = 'unknown';
    let browserVersion = 'unknown';
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) {
      browser = 'Chrome';
      const chromeMatch = ua.match(/Chrome\/([\d.]+)/);
      browserVersion = chromeMatch ? chromeMatch[1] : 'unknown';
    } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
      browser = 'Safari';
      const safariMatch = ua.match(/Version\/([\d.]+)/);
      browserVersion = safariMatch ? safariMatch[1] : 'unknown';
    } else if (/Firefox/.test(ua)) {
      browser = 'Firefox';
      const ffMatch = ua.match(/Firefox\/([\d.]+)/);
      browserVersion = ffMatch ? ffMatch[1] : 'unknown';
    } else if (/Edg/.test(ua)) {
      browser = 'Edge';
      const edgeMatch = ua.match(/Edg\/([\d.]+)/);
      browserVersion = edgeMatch ? edgeMatch[1] : 'unknown';
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const networkType = connection ? connection.effectiveType : 'unknown';

    const device = /iPhone/.test(ua) ? 'iPhone' :
                   /iPad/.test(ua) ? 'iPad' :
                   /Android/.test(ua) ? 'Android Device' :
                   /Mac/.test(ua) ? 'Mac' :
                   /Windows/.test(ua) ? 'Windows PC' : 'Unknown';

    return {
      device,
      deviceType,
      os,
      osVersion,
      browser,
      browserVersion,
      networkType
    };
  };

  Monitor.prototype.getBaseData = function() {
    return {
      user_id: this.userId,
      app_version: this.options.appVersion,
      device: this.deviceInfo.device,
      device_type: this.deviceInfo.deviceType,
      os: this.deviceInfo.os,
      os_version: this.deviceInfo.osVersion,
      browser: this.deviceInfo.browser,
      browser_version: this.deviceInfo.browserVersion,
      network_type: this.deviceInfo.networkType,
      page_url: window.location.href,
      timestamp: Date.now()
    };
  };

  Monitor.prototype.report = function(type, data) {
    if (Math.random() > this.options.sampleRate) return;

    const payload = Object.assign({}, this.getBaseData(), data, { type });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.options.reportUrl, JSON.stringify(payload));
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.options.reportUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(payload));
    }
  };

  Monitor.prototype.getPerformanceData = function() {
    if (!this.options.enablePerformance) return;
    if (!window.performance || !performance.timing) return;

    const timing = performance.timing;
    const navigation = performance.navigation;
    
    const whiteScreenTime = timing.responseStart - timing.fetchStart;
    const firstScreenTime = timing.domInteractive - timing.fetchStart;
    const domReadyTime = timing.domContentLoadedEventEnd - timing.fetchStart;
    const loadEventTime = timing.loadEventEnd - timing.fetchStart;

    const data = {
      white_screen_time: Math.max(0, whiteScreenTime),
      first_screen_time: Math.max(0, firstScreenTime),
      dom_ready_time: Math.max(0, domReadyTime),
      load_event_time: Math.max(0, loadEventTime),
      redirect_count: navigation ? navigation.redirectCount : 0,
      redirect_time: Math.max(0, timing.redirectEnd - timing.redirectStart),
      dns_time: Math.max(0, timing.domainLookupEnd - timing.domainLookupStart),
      tcp_time: Math.max(0, timing.connectEnd - timing.connectStart),
      ttfb: Math.max(0, timing.responseStart - timing.requestStart),
      transfer_time: Math.max(0, timing.responseEnd - timing.responseStart),
      parse_dom_time: Math.max(0, timing.domComplete - timing.domInteractive),
      resource_count: performance.getEntriesByType ? performance.getEntriesByType('resource').length : 0
    };

    this.report('performance', data);
  };

  Monitor.prototype.captureError = function(errorEvent) {
    if (!this.options.enableError) return;

    const data = {
      error_type: 'js_error',
      error_message: errorEvent.message,
      error_file: errorEvent.filename,
      error_line: errorEvent.lineno,
      error_column: errorEvent.colno,
      error_stack: errorEvent.error ? errorEvent.error.stack : ''
    };

    this.report('error', data);
  };

  Monitor.prototype.captureUnhandledRejection = function(event) {
    if (!this.options.enableException) return;

    const data = {
      exception_type: 'unhandled_rejection',
      exception_message: event.reason ? String(event.reason) : 'Unknown rejection',
      exception_stack: event.reason && event.reason.stack ? event.reason.stack : ''
    };

    this.report('exception', data);
  };

  Monitor.prototype.captureResourceError = function(event) {
    if (!this.options.enableResource) return;
    if (event.target === window) return;

    const target = event.target;
    const resourceUrl = target.src || target.href;
    if (!resourceUrl) return;

    const data = {
      resource_url: resourceUrl,
      resource_type: target.tagName ? target.tagName.toLowerCase() : 'unknown',
      resource_duration: 0,
      resource_size: 0,
      success: 0
    };

    this.report('resource', data);
  };

  Monitor.prototype.interceptXHR = function() {
    if (!this.options.enableAPI) return;

    const self = this;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
      this._apiMethod = method;
      this._apiUrl = url;
      this._apiStartTime = Date.now();
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
      const self2 = this;

      this.addEventListener('loadend', function() {
        const duration = Date.now() - self2._apiStartTime;
        const success = self2.status >= 200 && self2.status < 400 ? 1 : 0;

        const data = {
          api_url: self2._apiUrl,
          api_method: self2._apiMethod,
          api_status: self2.status,
          api_duration: duration,
          success: success,
          error_message: success ? '' : self2.statusText
        };

        self.report('api', data);
      });

      return originalSend.apply(this, arguments);
    };
  };

  Monitor.prototype.interceptFetch = function() {
    if (!this.options.enableAPI || !window.fetch) return;

    const self = this;
    const originalFetch = window.fetch;

    window.fetch = function(input, init) {
      const startTime = Date.now();
      const url = typeof input === 'string' ? input : input.url;
      const method = (init && init.method) || 'GET';

      return originalFetch.apply(this, arguments).then(function(response) {
        const duration = Date.now() - startTime;
        const success = response.ok ? 1 : 0;

        const data = {
          api_url: url,
          api_method: method,
          api_status: response.status,
          api_duration: duration,
          success: success,
          error_message: success ? '' : response.statusText
        };

        self.report('api', data);
        return response;
      }).catch(function(error) {
        const duration = Date.now() - startTime;

        const data = {
          api_url: url,
          api_method: method,
          api_status: 0,
          api_duration: duration,
          success: 0,
          error_message: error.message
        };

        self.report('api', data);
        throw error;
      });
    };
  };

  Monitor.prototype.trackPageView = function() {
    if (!this.options.enablePV) return;

    const self = this;
    
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      self.maxScrollDepth = Math.max(self.maxScrollDepth, depth);
    });

    document.addEventListener('click', function() {
      self.clickCount++;
    });

    window.addEventListener('beforeunload', function() {
      const stayTime = Date.now() - self.pageStartTime;
      
      const data = {
        entry_url: document.referrer,
        exit_url: window.location.href,
        stay_time: stayTime,
        scroll_depth: self.maxScrollDepth,
        click_count: self.clickCount
      };

      self.report('page_view', data);
    });
  };

  Monitor.prototype.init = function() {
    const self = this;

    window.addEventListener('error', function(event) {
      self.captureError(event);
    }, true);

    window.addEventListener('unhandledrejection', function(event) {
      self.captureUnhandledRejection(event);
    });

    window.addEventListener('error', function(event) {
      self.captureResourceError(event);
    }, true);

    this.interceptXHR();
    this.interceptFetch();
    this.trackPageView();

    window.addEventListener('load', function() {
      setTimeout(function() {
        self.getPerformanceData();
      }, 0);
    });
  };

  global.Monitor = Monitor;
  global.__Monitor = new Monitor({
    appVersion: '1.0.0',
    reportUrl: 'http://localhost:3000/api/report'
  });

})(window);
