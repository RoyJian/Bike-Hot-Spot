import axios from 'axios';
import ch from '../utils/RabbitmqConn';
import 'dotenv/config';
const { RABBITMQ_HOST, RABBITMQ_PORT } = process.env;

async function GetUbileV1() {
  const v1URL: string = 'https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json';
  const res = await axios.get(v1URL);
  return res.data;
}

async function InsertQueue() {
  const channel = await ch();
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
InsertQueue();
