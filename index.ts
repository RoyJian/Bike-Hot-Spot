import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { ApolloServer } from 'apollo-server';
import resolver from './resolvers/resolvers';
import messageQueue from './models/messageQueue';

const { PORT } = process.env;
messageQueue();
const server = new ApolloServer({
  // 用 Node.js 的 fs 和 path 模組 來讀取我們的 schema 檔案
  typeDefs: fs.readFileSync(path.join('./schema/root.graphql'), 'utf8'),
  resolvers: resolver(),
});
server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
