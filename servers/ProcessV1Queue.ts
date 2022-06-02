import ch from '../utils/RabbitmqConn';
import { MongodbConn } from '../utils/MongodbConn';
import 'dotenv/config';

async function ProcessQueue() {
  const queue = 'UbikeV1';
  const channel = await ch();
  await channel.assertQueue(queue);
  // const db = await MongodbConn();
  // await db.createCollection('ubikev1').catch((err) => {});
  // const collection = await db.collection('ubikev1');
  // await collection.createIndex({ location: '2dsphere' }).catch((err) => {});
  const mongo = new MongodbConn();
  await mongo.connect();
  await mongo.db.createCollection('ubikev1').catch((err) => {});
  const collection = mongo.db.collection('ubikev1');
  await collection.createIndex({ location: '2dsphere' }).catch((err) => {});

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      let finalData: any[] = Object.values(data.retVal);
      finalData.map((obj) => {
        const site = {
          station: obj.sna,
          version: 'V1',
          available: obj.sbi,
          location: {
            type: 'Point',
            coordinates: [parseFloat(obj.lng), parseFloat(obj.lat)],
          },
          datatime: obj.mday,
        };
        const id: number = parseInt(obj.sno, 10);
        collection.updateOne({ _id: id }, { $set: { _id: id, ...site } }, { upsert: true });
      });
      console.log(new Date().toLocaleString(), 'done');
      channel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
}
ProcessQueue();
