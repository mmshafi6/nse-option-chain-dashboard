import axios from "axios";
import https from "https";

let cookie = "";

// ✅ Keep-alive agent (VERY IMPORTANT)
const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 5
});

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  Accept: "application/json",
  Referer: "https://www.nseindia.com",
  Connection: "keep-alive"
};

async function refreshCookie() {
  const res = await axios.get("https://www.nseindia.com", {
    headers,
    httpsAgent: agent,
    timeout: 20000
  });

  cookie = res.headers["set-cookie"]
    ?.map(c => c.split(";")[0])
    .join("; ");
}

// ✅ NEVER THROW → ALWAYS RETURN
export async function getOptionChain() {
  try {
    if (!cookie) await refreshCookie();

    const res = await axios.get(
      "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY",
      {
        headers: { ...headers, Cookie: cookie },
        httpsAgent: agent,
        timeout: 20000
      }
    );

    return res.data;
  } catch (err) {
    console.log("⚠ NSE first attempt failed, retrying once...");

    try {
      cookie = "";
      await refreshCookie();

      const retry = await axios.get(
        "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY",
        {
          headers: { ...headers, Cookie: cookie },
          httpsAgent: agent,
          timeout: 20000
        }
      );

      return retry.data;
    } catch {
      // 🔴 NEVER crash Express
      return {
        error: "NSE temporarily unavailable",
        records: { data: [], expiryDates: [] }
      };
    }
  }
}

export async function getExpiryDates() {
  const data = await getOptionChain();
  return data.records?.expiryDates || [];
}
