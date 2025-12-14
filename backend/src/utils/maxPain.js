export function calculateMaxPain(records) {
  let painMap = {};

  records.forEach(s => {
    painMap[s.strikePrice] = records.reduce((acc, r) => {
      return acc +
        Math.abs(r.strikePrice - s.strikePrice) *
        ((r.CE?.openInterest || 0) +
         (r.PE?.openInterest || 0));
    }, 0);
  });

  return +Object.keys(painMap).reduce((a, b) =>
    painMap[a] < painMap[b] ? a : b
  );
}
