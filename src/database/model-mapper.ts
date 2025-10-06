import { mapping } from 'cassandra-driver'
import { createModelMapper } from './utils/create-model-mapper'

export const modelMapper: mapping.ModelMapper = await createModelMapper()
