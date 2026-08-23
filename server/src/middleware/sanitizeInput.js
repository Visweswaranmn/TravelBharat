// Strips MongoDB operator keys (anything starting with "$" or containing
// ".") out of req.body/query/params — closes NoSQL-operator-injection
// attempts like `?state[$ne]=1` or a login body of {"email": {"$gt": ""}}.
//
// Written as an in-place mutation rather than using a package like
// express-mongo-sanitize because that package reassigns req.query
// wholesale (`req.query = cleaned`), which Express 5 rejects — req.query
// is a getter-only property there. Mutating keys in place works fine.
const stripOperators = (value) => {
  if (!value || typeof value !== 'object') return

  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete value[key]
      continue
    }
    stripOperators(value[key])
  }
}

export const sanitizeInput = (req, res, next) => {
  stripOperators(req.body)
  stripOperators(req.query)
  stripOperators(req.params)
  next()
}
