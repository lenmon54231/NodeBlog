const getDate = () => {
  let mydate, y, m, d, hh, mm, ss;
  mydate = new Date()
  y = mydate.getFullYear()
  m = mydate.getMonth() + 1
  d = mydate.getDate()
  hh = mydate.getHours()
  mm = mydate.getMinutes()
  ss = mydate.getSeconds()
  if (m < 10) m = '0' + m
  if (d < 10) d = '0' + d
  if (hh < 10) hh = '0' + hh
  if (mm < 10) mm = '0' + mm
  if (ss < 10) ss = '0' + ss
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}


module.exports = getDate;