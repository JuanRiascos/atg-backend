
export const serialize = (object: {}, fields: any[]) => {
  let newObject = {}
  fields.map((field: any) => {
    let keys = '', parts = field.split('.')

    parts.forEach((subfield, i) => {
      keys += subfield;
      if (i + 1 >= parts.length)
        eval(`newObject.${keys} = object.${keys}`)
      else if (!eval(`newObject.${keys}`))
        eval(`newObject.${keys} = {}`)
      keys += '.'
    })
  })

  return newObject
}

export const generateSlug = (name: string) => {
  let slug = ''
  for (let i = 0; i < name.length; i++) {
    if (name.charAt(i) === ' ')
      slug += '_'
    else
      slug += name.charAt(i).toLowerCase()
  }
  return slug
}