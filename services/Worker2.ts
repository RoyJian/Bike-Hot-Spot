import ch from '../utils/RabbitmqConn';
import { MongodbConn } from '../utils/MongodbConn';
import 'dotenv/config';

async function ProcessQueue() {
  const queue = 'UbikeV2';
  const connection = await ch();
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  const mongo = new MongodbConn();
  await mongo.connect();
  await mongo.db.createCollection('ubikev2').catch((err) => {});
  const collection = mongo.db.collection('ubikev2');
  await collection.createIndex({ location: '2dsphere' }).catch((err) => {});

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      data.map((obj: any) => {
        const site = {
          station: obj.sna,
          version: 'V2',
          available: obj.sbi,
          location: {
            type: 'Point',
            coordinates: [parseFloat(obj.lng), parseFloat(obj.lat)],
          },
          datatime: obj.updateTime,
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
