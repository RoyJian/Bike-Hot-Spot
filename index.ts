import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { loadFiles, loadFilesSync } from '@graphql-tools/load-files';
import { printSchema } from 'graphql';
import resolver from './resolvers/resolvers';
import { join } from 'path';
const { PORT } = process.env;
async function main() {
  const rootSchema = loadFilesSync(join(__dirname, './schemas/root.graphql'));
  // const spotSchema = loadFilesSync(join(__dirname, './schemas/Spot.grpahql'));
  const server = new ApolloServer({
    // 用 Node.js 的 fs 和 path 模組 來讀取我們的 schema 檔案
    typeDefs: [rootSchema],
    resolvers: resolver(),
  });
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}
main();
