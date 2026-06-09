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
    var tel = e.target.closest('a[href^="tel:"]');
    if (tel) gtag("event", "phone_click", { event_category: "engagement" });
    var cta = e.target.closest('a[href*="/order"], a[href*="/custom-order"], a[href*="/design-your-cake"]');
    if (cta) gtag("event", "cta_click", { event_category: "engagement", link_url: cta.getAttribute("href") });
  });
})();
