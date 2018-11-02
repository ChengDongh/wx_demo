function formatTime(date){
  var date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime_one(date) {
  var date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function isphone(mobile) {
  return /^1(3|4|5|7|8)\d{9}$/.test(mobile)
}
module.exports = {
  formatTime: formatTime,
  isphone: isphone,
  formatTime_one: formatTime_one,
}

