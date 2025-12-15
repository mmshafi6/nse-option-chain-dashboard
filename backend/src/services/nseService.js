import axios from "axios";

let cookie = "";

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
    timeout: 10000
  });

  cookie = res.headers["set-cookie"]
    ?.map(c => c.split(";")[0])
    .join("; ");
}

// ✅ LIVE NSE — CLOUD ONLY
export async function getOptionChain() {
  try {
    if (!cookie) await refreshCookie();

    const res = await axios.get(
      "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY",
      {
        headers: {
          ...headers,
          Cookie: cookie
        },
        timeout: 10000
      }
    );

    return res.data;
  } catch (err) {
    console.log("NSE blocked once, retrying...");
    cookie = "";
    await refreshCookie();

    const retry = await axios.get(
      "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY",
      {
        headers: {
          ...headers,
          Cookie: cookie
        }
      }
    );

    return retry.data;
  }
}

export async function getExpiryDates() {
  const data = await getOptionChain();
  return data.records.expiryDates;
}
