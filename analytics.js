/* Cakes by Steph - website analytics & lead tracking
   ------------------------------------------------------------------
   SETUP (one time): paste your IDs below, save, that's it.
     1) GA4_ID  - your Google Analytics 4 Measurement ID  (looks like  G-XXXXXXXXXX)
     2) ADS_ID  - optional Google Ads tag ID              (looks like  AW-XXXXXXXXXX)
   Until a real GA4_ID is in place, tracking stays off and nothing breaks.
   ------------------------------------------------------------------ */
var GA4_ID = "G-6725JMNSF3";
var ADS_ID = "AW-18223804877";

(function () {
  if (!GA4_ID || GA4_ID.indexOf("XXXX") !== -1) return; // not configured yet

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA4_ID);
  if (ADS_ID && ADS_ID.indexOf("XXXX") === -1) gtag("config", ADS_ID);

  // Track phone taps and clicks on the main call-to-action links
  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var tel = e.target.closest('a[href^="tel:"], a[href^="sms:"]');
    if (tel) gtag("event", "phone_click", { event_category: "engagement" });
    var cta = e.target.closest('a[href*="/custom-order"], a[href*="/design-your-cake"]');
    if (cta) gtag("event", "cta_click", { event_category: "engagement", link_url: cta.getAttribute("href") });
  });
})();

/* Sticky mobile call/text bar - injected sitewide (this static site has no
   shared includes, so analytics.js, which loads on every page, is the one
   reliable place to add a global UI element). Mobile only; one-tap call or
   text to Stephanie. Localizes its labels to the page language. */
(function () {
  var PHONE = "+12404715637";
  function init() {
    if (document.getElementById("cbs-mobilebar")) return;
    if (!document.body) return;
    var es = (document.documentElement.lang || "").indexOf("es") === 0;
    var css = document.createElement("style");
    css.textContent =
      "#cbs-mobilebar{display:none}" +
      "@media(max-width:768px){" +
        "#cbs-mobilebar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:9999;" +
          "border-top:1px solid var(--line,#e4d3c4);box-shadow:0 -4px 18px rgba(42,26,16,.14);}" +
        "#cbs-mobilebar a{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;" +
          "padding:15px 10px;font-family:'Jost',sans-serif;font-size:.82rem;letter-spacing:.12em;" +
          "text-transform:uppercase;text-decoration:none;}" +
        "#cbs-mobilebar a.cbs-call{background:var(--rose,#bd7a66);color:#fff;}" +
        "#cbs-mobilebar a.cbs-text{background:var(--ivory,#fdfaf4);color:var(--dark,#2a1a10);}" +
        "body{padding-bottom:56px;}" +
      "}";
    document.head.appendChild(css);
    var bar = document.createElement("div");
    bar.id = "cbs-mobilebar";
    bar.setAttribute("aria-label", es ? "Llamar o escribir" : "Call or text");
    bar.innerHTML =
      '<a class="cbs-call" href="tel:' + PHONE + '">☎︎ ' + (es ? "Llamar" : "Call") + '</a>' +
      '<a class="cbs-text" href="sms:' + PHONE + '">✉︎ ' + (es ? "Escribir" : "Text") + '</a>';
    document.body.appendChild(bar);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
