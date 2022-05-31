import axios from 'axios';
import amqplib from 'amqplib';

const { RABBITMQ_HOST, RABBITMQ_PORT } = process.env;

async function GetUbileV1() {
  const v1URL: string = 'https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json';
  const res = await axios.get(v1URL);
  return res.data;
}

export default async function messageQueue() {
  const connection = await amqplib.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`);
  const channel = await connection.createChannel();
  await channel.assertQueue('UbikeV1');
  const data = JSON.stringify(await GetUbileV1());
  channel.sendToQueue('UbikeV1', Buffer.from(data));
  channel.close();
}
