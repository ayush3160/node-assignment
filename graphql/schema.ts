import { GraphQLSchema } from 'graphql';
import query from './query/rootQuery';

export default new GraphQLSchema({
  query,
});
