export function calculatePCR(records) {
  let putOI = 0, callOI = 0;

  records.forEach(r => {
    callOI += r.CE?.openInterest || 0;
    putOI += r.PE?.openInterest || 0;
  });

  return +(putOI / callOI).toFixed(2);
}
