import axios from "axios";

let cookie = "";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  Accept: "application/json",
  Referer: "https://www.nseindia.com"
};

async function refreshCookie() {
  const res = await axios.get("https://www.nseindia.com", {
    headers
  });
  cookie = res.headers["set-cookie"]
    .map(c => c.split(";")[0])
    .join("; ");
}

export async function getOptionChain() {
  if (!cookie) await refreshCookie();

  try {
    const res = await axios.get(
      "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY",
      {
        headers: {
          ...headers,
          Cookie: cookie
        }
      }
    );
    return res.data;
  } catch {
    await refreshCookie();
    return getOptionChain();
  }
}

export async function getExpiryDates() {
  const data = await getOptionChain();
  return data.records.expiryDates;
}
