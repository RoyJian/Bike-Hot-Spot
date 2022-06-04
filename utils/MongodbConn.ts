import { Db, MongoClient } from 'mongodb';
import 'dotenv/config';
const { MONGODB_HOST, MONGODB_PORT, MONGODB_USER, MONGODB_PASS, MONGODB_DB, NODE_ENV } = process.env;

export class MongodbConn {
  public client: MongoClient;
  public db: Db;
  constructor() {
    const host = NODE_ENV === 'Deployment' ? MONGODB_HOST : 'localhost';
    const url = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${host}:${MONGODB_PORT}`;
    this.client = new MongoClient(url);
    this.db = this.client.db(MONGODB_DB);
  }
  public async connect() {
    await this.client.connect();
  }
}
