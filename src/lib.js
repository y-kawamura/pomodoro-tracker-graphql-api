const toDate = (datetime) =>
  new Date(
    Date.UTC(datetime.getFullYear(), datetime.getMonth(), datetime.getDate())
  )

module.exports = {
  toDate
}
