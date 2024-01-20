
module.exports = {
  addDateHours: (h) => {
    var result = Date.now() + h*60*60;
    return result
  }
}
