// Turns "Ooty Botanical Garden" into "ooty-botanical-garden".
export const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')

// Generates a slug from `name` and guarantees it's unique for `Model`,
// appending -2, -3, ... if the base slug is already taken. `filter` scopes
// the uniqueness check (e.g. a City's slug only needs to be unique within
// its own state), and `excludeId` skips the document being updated.
export const generateUniqueSlug = async (Model, name, { filter = {}, excludeId } = {}) => {
  const base = slugify(name)
  let slug = base
  let counter = 2

  while (true) {
    const query = { ...filter, slug }
    if (excludeId) query._id = { $ne: excludeId }

    const exists = await Model.exists(query)
    if (!exists) return slug

    slug = `${base}-${counter}`
    counter += 1
  }
}
