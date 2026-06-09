// Fires automatically on every VERIFIED (non-spam) Netlify form submission.
// Texts the lead details via Twilio. Spam submissions never reach here, which
// is the point: you only get pinged for real leads.
//
// Set these four environment variables in Netlify
// (Site configuration -> Environment variables):
//   TWILIO_ACCOUNT_SID   your Twilio account SID  (starts with AC...)
//   TWILIO_AUTH_TOKEN    your Twilio auth token
//   TWILIO_FROM          your Twilio phone number (e.g. +1571...)
//   ALERT_TO             the cell to text         (e.g. +1703...)
// Until all four are set, the function logs the message and does nothing else,
// so nothing breaks.

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || "{}");
    const form = (payload && payload.form_name) || "form";
    const d = (payload && payload.data) || {};

    const pick = (...keys) => {
      for (const k of keys) if (d[k]) return String(d[k]).trim();
      return "";
    };

    const name = pick("name", "fullname", "full_name") || "Someone";
    const phone = pick("phone", "tel", "telephone");
    const email = pick("email");
    const occasion = pick("occasion", "interest", "event_type", "cake_type");
    const date = pick("event_date", "date", "event-date");

    const lines = [
      `New lead (${form}): ${name}`,
      phone && `Phone: ${phone}`,
      email && `Email: ${email}`,
      occasion && `For: ${occasion}`,
      date && `Date: ${date}`,
      `See full details in Netlify Forms.`,
    ].filter(Boolean);
    const msg = lines.join("\n");

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;
    const to = process.env.ALERT_TO;

    if (!sid || !token || !from || !to) {
      console.log("Twilio not configured yet. Lead alert would read:\n" + msg);
      return { statusCode: 200, body: "not configured" };
    }

    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: from, To: to, Body: msg }),
      }
    );

    if (!res.ok) {
      console.error("Twilio send failed", res.status, await res.text());
      return { statusCode: 200, body: "twilio error" };
    }
    return { statusCode: 200, body: "sent" };
  } catch (err) {
    console.error("Lead alert function error:", err);
    return { statusCode: 200, body: "error" };
  }
};
