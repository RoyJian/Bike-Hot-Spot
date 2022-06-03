import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { loadFilesSync } from '@graphql-tools/load-files';
import resolver from './resolvers/resolvers';
import { join } from 'path';
const { PORT } = process.env;
async function main() {
  const rootSchema = loadFilesSync(join(__dirname, './schemas/root.graphql'));
  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: resolver(),
  });
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}
main();
