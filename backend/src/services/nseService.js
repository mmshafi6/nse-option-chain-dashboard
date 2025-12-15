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
    console.error("NSE fetch failed, retrying once...");
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
