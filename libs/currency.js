function fnumber(number) {
  return "Rp. " + new Intl.NumberFormat("id-ID").format(number);
}

module.exports = { fnumber };
