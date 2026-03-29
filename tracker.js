(function () {
  "use strict";

  // =============================
  // Config
  // =============================
  const scriptTag = document.currentScript;
  const SITE_ID = scriptTag.getAttribute("data-site-id") || "default";
  const API_URL = "https://yourdomain.com/api/track";

  // =============================
  // Generate / Get Visitor ID
  // =============================
  function getVisitorId() {
    let vid = localStorage.getItem("vid");
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("vid", vid);
    }
    return vid;
  }

  const visitorId = getVisitorId();

  // =============================
  // Session ID
  // =============================
  function getSessionId() {
    let sid = sessionStorage.getItem("sid");
    if (!sid) {
      sid = "s_" + Date.now();
      sessionStorage.setItem("sid", sid);
    }
    return sid;
  }

  const sessionId = getSessionId();

  // =============================
  // Collect Data
  // =============================
  function collectData() {
    return {
      site_id: SITE_ID,
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      language: navigator.language,
      screen: screen.width + "x" + screen.height,
      visitor_id: visitorId,
      session_id: sessionId,
      timestamp: new Date().toISOString()
    };
  }

  // =============================
  // Send Data
  // =============================
  function sendData(data) {
    navigator.sendBeacon(API_URL, JSON.stringify(data));
  }

  // =============================
  // Track Page View
  // =============================
  function trackPageView() {
    const data = collectData();
    data.event = "pageview";
    sendData(data);
  }

  // =============================
  // Track Clicks
  // =============================
  function trackClicks() {
    document.addEventListener("click", function (e) {
      const target = e.target.closest("a, button");

      if (!target) return;

      const data = collectData();
      data.event = "click";
      data.element = target.tagName;
      data.text = target.innerText?.substring(0, 100);

      sendData(data);
    });
  }

  // =============================
  // Track Time on Page
  // =============================
  let startTime = Date.now();

  function trackTimeOnPage() {
    window.addEventListener("beforeunload", function () {
      const data = collectData();
      data.event = "time_on_page";
      data.duration = Date.now() - startTime;

      sendData(data);
    });
  }

  // =============================
  // SPA Support (React, Vue)
  // =============================
  function hookHistory() {
    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      trackPageView();
    };

    window.addEventListener("popstate", trackPageView);
  }

  // =============================
  // Init
  // =============================
  function init() {
    trackPageView();
    trackClicks();
    trackTimeOnPage();
    hookHistory();
  }

  init();
})();
