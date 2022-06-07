import axios from 'axios';
import ch from '../utils/RabbitmqConn';
import amqplib from 'amqplib';
import 'dotenv/config';

async function GetUbileV1() {
  const v1URL: string = 'https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json';
  const res = await axios.get(v1URL);
  return res.data;
}

async function InsertQueue(data: string) {
  const connection = await ch();
  const channel = await connection.createChannel();
  await channel.assertQueue('UbikeV1');
  const task = async () => {
    const data = JSON.stringify(await GetUbileV1());
    channel.sendToQueue('UbikeV1', Buffer.from(data));
    console.log(new Date().toLocaleString(), 'insert!');
    return;
  };
  task();
  setInterval(() => {
    task();
  }, 1000 * 60);
}

async function InsertStream(data: string) {
  const connection = await ch();
  const channel = await connection.createChannel();
  channel.assertQueue('UbikeV1Stream', {
    durable: true,
    exclusive: false,
    autoDelete: false,
    arguments: { 'x-queue-type': 'stream', 'x-max-age': '1m', 'x-max-length-bytes': 20 * 100000 },
  });
  const task = async () => {
    let data = await GetUbileV1();
    // data.createtime = new Date().toLocaleString();
    data = Object.values(data.retVal);
    const buffer = JSON.stringify(data);
    channel.sendToQueue('UbikeV1Stream', Buffer.from(buffer), { persistent: true });
    console.log(new Date().toLocaleString(), 'insert!');
    return;
  };
  task();
  setInterval(() => {
    task();
  }, 1000 * 60);
  return;
}
async function main() {
  const data = JSON.stringify(await GetUbileV1());
  InsertQueue(data);
  InsertStream(data);
}
main();
