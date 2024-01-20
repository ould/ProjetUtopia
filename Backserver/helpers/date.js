
module.exports = {
  addDateDays: (h) => {
    var todayDate = new Date();
    var result = todayDate.setDate(todayDate.getDate() + h);
    return result
  }
}
