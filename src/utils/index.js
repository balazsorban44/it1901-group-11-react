// Parse any date into an ISOString and returns a slice of it. For example: "1970-01-01T00:00:00.000Z"
const dateParser = (from, to,...date) => new Date(...date).toISOString().slice(from, to)
// Parse a date. Returns "1970-01-01"
export const parseDate = (...date) => dateParser(0, 10, ...date)
// Parse a time. Returns 00:00
export const parseTime = (...date) => dateParser(11, 16, ...date)
