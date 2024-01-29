
module.exports = {
  addDateHours: (h) => {
    var result = Date.now() + h*1000*60*60;
    return result
  }
}
