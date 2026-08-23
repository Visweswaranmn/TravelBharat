// Strips Mongo operator keys ("$ne", "$gt", dotted paths, etc.) out of
// incoming data so req.body.email can't be swapped for {"$gt": ""} and
// sneak past a query. Doing it by hand instead of pulling in
// express-mongo-sanitize because that package reassigns req.query
// outright, and Express 5 made req.query getter-only — it just throws.
// Mutating in place, like below, still works fine.
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
