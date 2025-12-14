import { useEffect, useState } from "react";

function App() {
  const [expiries, setExpiries] = useState([]);
  const [selectedExpiry, setSelectedExpiry] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // 1️⃣ Load expiry dates
  useEffect(() => {
    fetch("http://localhost:5000/api/option-chain/expiries")
      .then((res) => res.json())
      .then((json) => {
        setExpiries(json.expiries || []);
        if (json.expiries && json.expiries.length > 0) {
          setSelectedExpiry(json.expiries[0]);
        }
      })
      .catch(() => setError("Failed to load expiries"));
  }, []);

  // 2️⃣ Load option chain data
  useEffect(() => {
    if (!selectedExpiry) return;

    fetch("http://localhost:5000/api/option-chain")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setError("Failed to load option chain"));
  }, [selectedExpiry]);

  if (error) return <h2>{error}</h2>;
  if (!data) return <h2>Loading data…</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>NSE Option Chain Dashboard</h1>

      {/* Expiry Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <b>Expiry:</b>{" "}
        <select
          value={selectedExpiry}
          onChange={(e) => setSelectedExpiry(e.target.value)}
        >
          {expiries.map((ex, i) => (
            <option key={i} value={ex}>
              {ex}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <p><b>Spot:</b> {data.spot}</p>
      <p><b>PCR:</b> {data.pcr}</p>
      <p><b>Max Pain:</b> {data.maxPain}</p>

      {/* Option Chain Table */}
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#eaeaea" }}>
          <tr>
            <th>Strike</th>
            <th>Call OI</th>
            <th>Put OI</th>
          </tr>
        </thead>

        <tbody>
          {data.records.map((r, i) => {
            // ATM = strike closest to spot price
            const isATM = Math.abs(r.strikePrice - data.spot) < 100;

            return (
              <tr
                key={i}
                style={{
                  backgroundColor: isATM ? "#fff3cd" : "#ffffff"
                }}
              >
                <td>
                  <b>{r.strikePrice}</b>
                </td>

                <td style={{ color: "red" }}>
                  {r.CE ? r.CE.openInterest : "-"}
                </td>

                <td style={{ color: "green" }}>
                  {r.PE ? r.PE.openInterest : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
