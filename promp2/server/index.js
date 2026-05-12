const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const { initDB, prepare, queryAll, queryOne } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

let dbReady = false;
let dbInstance = null;

app.post('/api/report', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ success: false, error: 'Database not ready' });
  }

  try {
    const data = req.body;
    const type = data.type;
    const baseData = [
      data.user_id, data.app_version, data.device, data.device_type,
      data.os, data.os_version, data.browser, data.browser_version,
      data.network_type, data.page_url, data.timestamp
    ];

    switch (type) {
      case 'performance':
        prepare(`
          INSERT INTO performance_data (
            user_id, app_version, device, device_type, os, os_version, browser, browser_version,
            network_type, white_screen_time, first_screen_time, dom_ready_time, load_event_time,
            redirect_count, redirect_time, dns_time, tcp_time, ttfb, transfer_time,
            parse_dom_time, resource_count, page_url, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          baseData[0], baseData[1], baseData[2], baseData[3],
          baseData[4], baseData[5], baseData[6], baseData[7],
          baseData[8],
          data.white_screen_time, data.first_screen_time, data.dom_ready_time,
          data.load_event_time, data.redirect_count, data.redirect_time, data.dns_time,
          data.tcp_time, data.ttfb, data.transfer_time, data.parse_dom_time,
          data.resource_count, baseData[9], baseData[10]
        );
        break;

      case 'error':
        prepare(`
          INSERT INTO error_data (
            user_id, app_version, device, device_type, os, os_version, browser, browser_version,
            network_type, error_type, error_message, error_stack, error_file, error_line,
            error_column, page_url, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          baseData[0], baseData[1], baseData[2], baseData[3],
          baseData[4], baseData[5], baseData[6], baseData[7],
          baseData[8],
          data.error_type, data.error_message, data.error_stack, data.error_file,
          data.error_line, data.error_column, baseData[9], baseData[10]
        );
        break;

      case 'exception':
        prepare(`
          INSERT INTO exception_data (
            user_id, app_version, device, device_type, os, os_version, browser, browser_version,
            network_type, exception_type, exception_message, exception_stack, page_url, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          baseData[0], baseData[1], baseData[2], baseData[3],
          baseData[4], baseData[5], baseData[6], baseData[7],
          baseData[8],
          data.exception_type, data.exception_message, data.exception_stack,
          baseData[9], baseData[10]
        );
        break;

      case 'page_view':
        prepare(`
          INSERT INTO page_view_data (
            user_id, app_version, device, device_type, os, os_version, browser, browser_version,
            network_type, page_url, entry_url, exit_url, stay_time, scroll_depth, click_count, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          baseData[0], baseData[1], baseData[2], baseData[3],
          baseData[4], baseData[5], baseData[6], baseData[7],
          baseData[8],
          baseData[9], data.entry_url, data.exit_url, data.stay_time,
          data.scroll_depth, data.click_count, baseData[10]
        );
        break;

      case 'resource':
        prepare(`
          INSERT INTO resource_data (
            user_id, app_version, device, device_type, os, os_version, browser, browser_version,
            network_type, resource_url, resource_type, resource_duration, resource_size,
            success, page_url, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          baseData[0], baseData[1], baseData[2], baseData[3],
          baseData[4], baseData[5], baseData[6], baseData[7],
          baseData[8],
          data.resource_url, data.resource_type, data.resource_duration, data.resource_size,
          data.success, baseData[9], baseData[10]
        );
        break;

      case 'api':
        prepare(`
          INSERT INTO api_data (
            user_id, app_version, device, device_type, os, os_version, browser, browser_version,
            network_type, api_url, api_method, api_status, api_duration, success,
            error_message, page_url, timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          baseData[0], baseData[1], baseData[2], baseData[3],
          baseData[4], baseData[5], baseData[6], baseData[7],
          baseData[8],
          data.api_url, data.api_method, data.api_status, data.api_duration,
          data.success, data.error_message, baseData[9], baseData[10]
        );
        break;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

function applyFilters(rows, req) {
  const { userId, device, appVersion, os, browser, networkType, startTime, endTime, pageKeyword } = req.query;
  
  return rows.filter(row => {
    if (userId && row.user_id !== userId) return false;
    if (device && row.device !== device) return false;
    if (appVersion && row.app_version !== appVersion) return false;
    if (os && row.os !== os) return false;
    if (browser && row.browser !== browser) return false;
    if (networkType && row.network_type !== networkType) return false;
    if (startTime && row.timestamp < parseInt(startTime)) return false;
    if (endTime && row.timestamp > parseInt(endTime)) return false;
    if (pageKeyword && row.page_url && !row.page_url.toLowerCase().includes(pageKeyword.toLowerCase())) return false;
    return true;
  });
}

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

app.get('/api/overview', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let pageViews = queryAll(`SELECT * FROM page_view_data`);
    let perfs = queryAll(`SELECT * FROM performance_data`);
    let errors = queryAll(`SELECT * FROM error_data`);
    let exceptions = queryAll(`SELECT * FROM exception_data`);
    let apis = queryAll(`SELECT * FROM api_data`);

    pageViews = applyFilters(pageViews, req);
    perfs = applyFilters(perfs, req);
    errors = applyFilters(errors, req);
    exceptions = applyFilters(exceptions, req);
    apis = applyFilters(apis, req);

    const pvCount = pageViews.length;
    const uvSet = new Set(pageViews.map(p => p.user_id));
    const uvCount = uvSet.size;
    const perfCount = perfs.length;
    const errorCount = errors.length;
    const exceptionCount = exceptions.length;
    const apiCount = apis.length;
    const apiSuccessCount = apis.filter(a => a.success === 1).length;

    const avgWhiteScreen = perfCount > 0 ? mean(perfs.map(p => p.white_screen_time)) : 0;
    const avgFirstScreen = perfCount > 0 ? mean(perfs.map(p => p.first_screen_time)) : 0;

    const errorRate = pvCount > 0 ? ((errorCount / pvCount) * 100) : 0;
    const exceptionRate = pvCount > 0 ? ((exceptionCount / pvCount) * 100) : 0;
    const apiSuccessRate = apiCount > 0 ? ((apiSuccessCount / apiCount) * 100) : 0;

    res.json({
      pv: pvCount,
      uv: uvCount,
      avgWhiteScreenTime: Math.round(avgWhiteScreen),
      avgFirstScreenTime: Math.round(avgFirstScreen),
      errorCount,
      exceptionCount,
      errorRate: parseFloat(errorRate.toFixed(2)),
      exceptionRate: parseFloat(exceptionRate.toFixed(2)),
      apiCount,
      apiSuccessCount,
      apiSuccessRate: parseFloat(apiSuccessRate.toFixed(2))
    });
  } catch (err) {
    console.error('Overview error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/performance/trend', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let perfs = queryAll(`SELECT * FROM performance_data ORDER BY timestamp ASC`);
    perfs = applyFilters(perfs, req);

    const interval = parseInt(req.query.interval) || 3600000;
    const grouped = {};

    perfs.forEach(item => {
      const bucket = Math.floor(item.timestamp / interval) * interval;
      if (!grouped[bucket]) {
        grouped[bucket] = {
          whiteScreen: [],
          firstScreen: [],
          domReady: [],
          loadEvent: []
        };
      }
      grouped[bucket].whiteScreen.push(item.white_screen_time);
      grouped[bucket].firstScreen.push(item.first_screen_time);
      grouped[bucket].domReady.push(item.dom_ready_time);
      grouped[bucket].loadEvent.push(item.load_event_time);
    });

    const result = Object.keys(grouped).sort().map(bucket => {
      const g = grouped[bucket];
      return {
        timestamp: parseInt(bucket),
        avgWhiteScreen: Math.round(mean(g.whiteScreen)),
        avgFirstScreen: Math.round(mean(g.firstScreen)),
        avgDomReady: Math.round(mean(g.domReady)),
        avgLoadEvent: Math.round(mean(g.loadEvent)),
        count: g.whiteScreen.length
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Performance trend error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/performance/distribution', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let perfs = queryAll(`SELECT * FROM performance_data`);
    perfs = applyFilters(perfs, req);

    const ranges = [
      { label: '<1s', min: 0, max: 1000 },
      { label: '1-2s', min: 1000, max: 2000 },
      { label: '2-3s', min: 2000, max: 3000 },
      { label: '3-5s', min: 3000, max: 5000 },
      { label: '>5s', min: 5000, max: Infinity }
    ];

    const firstScreenData = perfs.map(r => r.first_screen_time);

    const distribution = ranges.map(range => {
      const count = firstScreenData.filter(t => t >= range.min && t < range.max).length;
      return {
        label: range.label,
        count
      };
    });

    res.json(distribution);
  } catch (err) {
    console.error('Performance distribution error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/errors/trend', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let errors = queryAll(`SELECT * FROM error_data ORDER BY timestamp ASC`);
    let exceptions = queryAll(`SELECT * FROM exception_data ORDER BY timestamp ASC`);

    errors = applyFilters(errors, req);
    exceptions = applyFilters(exceptions, req);

    const interval = parseInt(req.query.interval) || 3600000;

    const errorGrouped = {};
    errors.forEach(item => {
      const bucket = Math.floor(item.timestamp / interval) * interval;
      errorGrouped[bucket] = (errorGrouped[bucket] || 0) + 1;
    });

    const exceptionGrouped = {};
    exceptions.forEach(item => {
      const bucket = Math.floor(item.timestamp / interval) * interval;
      exceptionGrouped[bucket] = (exceptionGrouped[bucket] || 0) + 1;
    });

    const allBuckets = new Set([...Object.keys(errorGrouped), ...Object.keys(exceptionGrouped)]);
    const result = Array.from(allBuckets).sort().map(bucket => ({
      timestamp: parseInt(bucket),
      errorCount: errorGrouped[bucket] || 0,
      exceptionCount: exceptionGrouped[bucket] || 0
    }));

    res.json(result);
  } catch (err) {
    console.error('Errors trend error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/errors/top', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let errors = queryAll(`SELECT * FROM error_data`);
    let exceptions = queryAll(`SELECT * FROM exception_data`);

    errors = applyFilters(errors, req);
    exceptions = applyFilters(exceptions, req);

    const limit = parseInt(req.query.limit) || 10;

    const errorMap = {};
    errors.forEach(e => {
      const key = e.error_message || 'unknown';
      if (!errorMap[key]) {
        errorMap[key] = { error_message: e.error_message, error_type: e.error_type, error_file: e.error_file, count: 0 };
      }
      errorMap[key].count++;
    });

    const exceptionMap = {};
    exceptions.forEach(e => {
      const key = e.exception_message || 'unknown';
      if (!exceptionMap[key]) {
        exceptionMap[key] = { exception_message: e.exception_message, exception_type: e.exception_type, count: 0 };
      }
      exceptionMap[key].count++;
    });

    const topErrors = Object.values(errorMap).sort((a, b) => b.count - a.count).slice(0, limit);
    const topExceptions = Object.values(exceptionMap).sort((a, b) => b.count - a.count).slice(0, limit);

    res.json({
      errors: topErrors,
      exceptions: topExceptions
    });
  } catch (err) {
    console.error('Top errors error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/api/stats', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let apis = queryAll(`SELECT * FROM api_data`);
    apis = applyFilters(apis, req);

    const total = apis.length;
    const success = apis.filter(a => a.success === 1).length;
    const avgDuration = total > 0 ? mean(apis.map(a => a.api_duration)) : 0;

    const apiMap = {};
    apis.forEach(a => {
      const key = `${a.api_url}|${a.api_method}`;
      if (!apiMap[key]) {
        apiMap[key] = { api_url: a.api_url, api_method: a.api_method, count: 0, durations: [], successCount: 0 };
      }
      apiMap[key].count++;
      apiMap[key].durations.push(a.api_duration);
      if (a.success === 1) apiMap[key].successCount++;
    });

    const apiList = Object.values(apiMap).map(item => ({
      ...item,
      avgDuration: Math.round(mean(item.durations)),
      successRate: ((item.successCount / item.count) * 100).toFixed(2)
    }));

    const topApis = [...apiList].sort((a, b) => b.count - a.count).slice(0, 20);
    const slowApis = [...apiList].sort((a, b) => b.avgDuration - a.avgDuration).slice(0, 10);

    const successRate = total > 0 ? ((success / total) * 100).toFixed(2) : '0.00';

    res.json({
      total,
      success,
      fail: total - success,
      avgDuration: Math.round(avgDuration),
      successRate,
      topApis,
      slowApis
    });
  } catch (err) {
    console.error('API stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/user/behavior', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let pageViews = queryAll(`SELECT * FROM page_view_data`);
    pageViews = applyFilters(pageViews, req);

    const pvCount = pageViews.length;
    const avgStayTime = pvCount > 0 ? mean(pageViews.map(p => p.stay_time)) : 0;
    const avgScrollDepth = pvCount > 0 ? mean(pageViews.map(p => p.scroll_depth)) : 0;
    const avgClickCount = pvCount > 0 ? mean(pageViews.map(p => p.click_count)) : 0;

    const pageMap = {};
    pageViews.forEach(p => {
      const key = p.page_url;
      if (!pageMap[key]) {
        pageMap[key] = { page_url: p.page_url, count: 0, stays: [] };
      }
      pageMap[key].count++;
      pageMap[key].stays.push(p.stay_time);
    });

    const topPages = Object.values(pageMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map(item => ({
        ...item,
        avgStay: Math.round(mean(item.stays))
      }));

    res.json({
      pv: pvCount,
      avgStayTime: Math.round(avgStayTime),
      avgScrollDepth: Math.round(avgScrollDepth),
      avgClickCount: Math.round(avgClickCount),
      topPages
    });
  } catch (err) {
    console.error('User behavior error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/filters/options', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    const pageViews = queryAll(`SELECT DISTINCT user_id, app_version, device, os, browser, network_type FROM page_view_data`);

    const users = [...new Set(pageViews.map(p => p.user_id))].sort().slice(0, 100);
    const versions = [...new Set(pageViews.map(p => p.app_version))].sort();
    const devices = [...new Set(pageViews.map(p => p.device))].sort();
    const osList = [...new Set(pageViews.map(p => p.os))].sort();
    const browsers = [...new Set(pageViews.map(p => p.browser))].sort();
    const networks = [...new Set(pageViews.map(p => p.network_type))].sort();

    res.json({
      users,
      versions,
      devices,
      osList,
      browsers,
      networks
    });
  } catch (err) {
    console.error('Filters options error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/errors/list', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let errors = queryAll(`SELECT * FROM error_data ORDER BY timestamp DESC`);
    errors = applyFilters(errors, req);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.json({
      list: errors.slice(start, end),
      total: errors.length,
      page,
      pageSize
    });
  } catch (err) {
    console.error('Error list error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/exceptions/list', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    let exceptions = queryAll(`SELECT * FROM exception_data ORDER BY timestamp DESC`);
    exceptions = applyFilters(exceptions, req);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.json({
      list: exceptions.slice(start, end),
      total: exceptions.length,
      page,
      pageSize
    });
  } catch (err) {
    console.error('Exception list error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pages/search', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    const keyword = req.query.keyword || '';
    let pageViews = queryAll(`SELECT * FROM page_view_data`);
    let perfs = queryAll(`SELECT * FROM performance_data`);
    let errors = queryAll(`SELECT * FROM error_data`);
    let exceptions = queryAll(`SELECT * FROM exception_data`);

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      pageViews = pageViews.filter(p => p.page_url.toLowerCase().includes(lowerKeyword));
      perfs = perfs.filter(p => p.page_url.toLowerCase().includes(lowerKeyword));
      errors = errors.filter(e => e.page_url.toLowerCase().includes(lowerKeyword));
      exceptions = exceptions.filter(e => e.page_url.toLowerCase().includes(lowerKeyword));
    }

    const pageMap = {};
    pageViews.forEach(p => {
      const key = p.page_url;
      if (!pageMap[key]) {
        pageMap[key] = { page_url: key, pv: 0, stays: [], clicks: [], scrolls: [] };
      }
      pageMap[key].pv++;
      pageMap[key].stays.push(p.stay_time);
      pageMap[key].clicks.push(p.click_count);
      pageMap[key].scrolls.push(p.scroll_depth);
    });

    const perfMap = {};
    perfs.forEach(p => {
      const key = p.page_url;
      if (!perfMap[key]) {
        perfMap[key] = { whiteScreen: [], firstScreen: [], domReady: [], loadEvent: [] };
      }
      perfMap[key].whiteScreen.push(p.white_screen_time);
      perfMap[key].firstScreen.push(p.first_screen_time);
      perfMap[key].domReady.push(p.dom_ready_time);
      perfMap[key].loadEvent.push(p.load_event_time);
    });

    const errorMap = {};
    errors.forEach(e => {
      const key = e.page_url;
      errorMap[key] = (errorMap[key] || 0) + 1;
    });

    const exceptionMap = {};
    exceptions.forEach(e => {
      const key = e.page_url;
      exceptionMap[key] = (exceptionMap[key] || 0) + 1;
    });

    const pages = Object.keys(pageMap).map(url => {
      const pv = pageMap[url];
      const perf = perfMap[url] || { whiteScreen: [], firstScreen: [], domReady: [], loadEvent: [] };
      const errorCount = errorMap[url] || 0;
      const exceptionCount = exceptionMap[url] || 0;
      const errorRate = pv.pv > 0 ? ((errorCount / pv.pv) * 100) : 0;

      return {
        page_url: url,
        pv: pv.pv,
        avgStayTime: Math.round(mean(pv.stays)),
        avgWhiteScreenTime: Math.round(mean(perf.whiteScreen)),
        avgFirstScreenTime: Math.round(mean(perf.firstScreen)),
        avgDomReadyTime: Math.round(mean(perf.domReady)),
        avgLoadEventTime: Math.round(mean(perf.loadEvent)),
        errorCount,
        exceptionCount,
        errorRate: parseFloat(errorRate.toFixed(2))
      };
    }).sort((a, b) => b.pv - a.pv);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.json({
      list: pages.slice(start, end),
      total: pages.length,
      page,
      pageSize
    });
  } catch (err) {
    console.error('Page search error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pages/performance-ranking', (req, res) => {
  if (!dbReady) {
    return res.status(500).json({ error: 'Database not ready' });
  }

  try {
    const perfs = queryAll(`SELECT * FROM performance_data`);

    const sortBy = req.query.sortBy || 'first_screen_time';

    const pageMap = {};
    perfs.forEach(p => {
      const key = p.page_url;
      if (!pageMap[key]) {
        pageMap[key] = {
          page_url: key,
          whiteScreen: [],
          firstScreen: [],
          domReady: [],
          loadEvent: [],
          pv: 0
        };
      }
      pageMap[key].whiteScreen.push(p.white_screen_time);
      pageMap[key].firstScreen.push(p.first_screen_time);
      pageMap[key].domReady.push(p.dom_ready_time);
      pageMap[key].loadEvent.push(p.load_event_time);
      pageMap[key].pv++;
    });

    let pages = Object.keys(pageMap).map(url => {
      const p = pageMap[url];
      return {
        page_url: url,
        pv: p.pv,
        avgWhiteScreenTime: Math.round(mean(p.whiteScreen)),
        avgFirstScreenTime: Math.round(mean(p.firstScreen)),
        avgDomReadyTime: Math.round(mean(p.domReady)),
        avgLoadEventTime: Math.round(mean(p.loadEvent))
      };
    });

    const sortMap = {
      'white_screen_time': 'avgWhiteScreenTime',
      'first_screen_time': 'avgFirstScreenTime',
      'dom_ready_time': 'avgDomReadyTime',
      'load_event_time': 'avgLoadEventTime'
    };
    const sortField = sortMap[sortBy] || 'avgFirstScreenTime';

    pages.sort((a, b) => b[sortField] - a[sortField]);

    const limit = parseInt(req.query.limit) || 50;

    res.json({
      list: pages.slice(0, limit),
      total: pages.length,
      sortBy,
      limit
    });
  } catch (err) {
    console.error('Performance ranking error:', err);
    res.status(500).json({ error: err.message });
  }
});

function generateMockData() {
  if (!dbReady) return;

  prepare(`DELETE FROM performance_data`).run();
  prepare(`DELETE FROM error_data`).run();
  prepare(`DELETE FROM exception_data`).run();
  prepare(`DELETE FROM page_view_data`).run();
  prepare(`DELETE FROM api_data`).run();
  prepare(`DELETE FROM resource_data`).run();

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const versions = ['1.0.0', '1.1.0', '1.2.0', '2.0.0'];
  const devices = ['iPhone', 'Android Device', 'Mac', 'Windows PC'];
  const osList = ['iOS', 'Android', 'macOS', 'Windows'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const networks = ['4g', '3g', 'wifi', '2g'];
  const userIds = [];
  
  for (let i = 0; i < 50; i++) {
    userIds.push('user_' + (1000 + i));
  }

  const errorMessages = [
    'Cannot read property of undefined',
    'Network Error',
    'Timeout',
    'TypeError: x is not a function',
    'ReferenceError: variable is not defined',
    'SyntaxError',
    'RangeError',
    'Permission denied'
  ];

  const apiUrls = [
    '/api/users',
    '/api/products',
    '/api/orders',
    '/api/cart',
    '/api/auth/login',
    '/api/search',
    '/api/recommendations'
  ];

  const pages = [
    'http://localhost:3000/',
    'http://localhost:3000/products',
    'http://localhost:3000/product/123',
    'http://localhost:3000/cart',
    'http://localhost:3000/checkout',
    'http://localhost:3000/login',
    'http://localhost:3000/profile'
  ];

  for (let i = 0; i < 500; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const version = versions[Math.floor(Math.random() * versions.length)];
    const deviceIndex = Math.floor(Math.random() * devices.length);
    const device = devices[deviceIndex];
    const os = osList[deviceIndex];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const network = networks[Math.floor(Math.random() * networks.length)];
    const page = pages[Math.floor(Math.random() * pages.length)];
    const timestamp = now - Math.floor(Math.random() * oneDay * 7);

    const whiteScreenTime = 100 + Math.floor(Math.random() * 500);
    const firstScreenTime = whiteScreenTime + 200 + Math.floor(Math.random() * 1500);
    const domReady = firstScreenTime + 100 + Math.floor(Math.random() * 500);
    const loadTime = domReady + 50 + Math.floor(Math.random() * 300);

    prepare(`
      INSERT INTO performance_data (
        user_id, app_version, device, device_type, os, os_version, browser, browser_version,
        network_type, white_screen_time, first_screen_time, dom_ready_time, load_event_time,
        redirect_count, redirect_time, dns_time, tcp_time, ttfb, transfer_time,
        parse_dom_time, resource_count, page_url, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId, version, device, 'desktop', os, '10.0', browser, '100.0', network,
      whiteScreenTime, firstScreenTime, domReady, loadTime,
      Math.floor(Math.random() * 2), Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 50), Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 200), Math.floor(Math.random() * 300),
      Math.floor(Math.random() * 500), 20 + Math.floor(Math.random() * 30),
      page, timestamp
    );

    prepare(`
      INSERT INTO page_view_data (
        user_id, app_version, device, device_type, os, os_version, browser, browser_version,
        network_type, page_url, entry_url, exit_url, stay_time, scroll_depth, click_count, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId, version, device, 'desktop', os, '10.0', browser, '100.0', network,
      page, '', page, 30000 + Math.floor(Math.random() * 120000),
      20 + Math.floor(Math.random() * 60), 3 + Math.floor(Math.random() * 15),
      timestamp
    );

    if (Math.random() > 0.7) {
      const apiUrl = apiUrls[Math.floor(Math.random() * apiUrls.length)];
      const method = Math.random() > 0.5 ? 'GET' : 'POST';
      const success = Math.random() > 0.1 ? 1 : 0;
      const status = success ? 200 : (Math.random() > 0.5 ? 500 : 404);
      const duration = 100 + Math.floor(Math.random() * 1000);

      prepare(`
        INSERT INTO api_data (
          user_id, app_version, device, device_type, os, os_version, browser, browser_version,
          network_type, api_url, api_method, api_status, api_duration, success,
          error_message, page_url, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId, version, device, 'desktop', os, '10.0', browser, '100.0', network,
        apiUrl, method, status, duration, success,
        success ? '' : 'Server Error', page, timestamp
      );
    }

    if (Math.random() > 0.85) {
      const errMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      prepare(`
        INSERT INTO error_data (
          user_id, app_version, device, device_type, os, os_version, browser, browser_version,
          network_type, error_type, error_message, error_stack, error_file, error_line,
          error_column, page_url, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId, version, device, 'desktop', os, '10.0', browser, '100.0', network,
        'js_error', errMsg, 'stack trace...', 'app.js',
        45 + Math.floor(Math.random() * 100), 10, page, timestamp
      );
    }

    if (Math.random() > 0.9) {
      const errMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      prepare(`
        INSERT INTO exception_data (
          user_id, app_version, device, device_type, os, os_version, browser, browser_version,
          network_type, exception_type, exception_message, exception_stack, page_url, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId, version, device, 'desktop', os, '10.0', browser, '100.0', network,
        'unhandled_rejection', errMsg, 'promise stack...', page, timestamp
      );
    }
  }

  console.log('Mock data generated successfully');
}

app.post('/api/generate-mock', (req, res) => {
  try {
    generateMockData();
    res.json({ success: true });
  } catch (err) {
    console.error('Generate mock error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

async function startServer() {
  try {
    dbInstance = await initDB();
    dbReady = true;
    generateMockData();

    app.listen(PORT, () => {
      console.log(`Frontend Monitoring System running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
