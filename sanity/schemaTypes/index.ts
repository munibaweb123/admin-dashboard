import { type SchemaTypeDefinition } from 'sanity'
import { orderType } from '../order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [orderType],
}
