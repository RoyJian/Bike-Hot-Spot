import axios from 'axios';
import ch from '../utils/RabbitmqConn';
import 'dotenv/config';

async function GetUbileV1() {
  const v2URL: string = 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json';
  const res = await axios.get(v2URL);
  return res.data;
}

async function InsertQueue() {
  const channel = await ch();
  await channel.assertQueue('UbikeV2');
  const task = async () => {
    const data = JSON.stringify(await GetUbileV1());
    channel.sendToQueue('UbikeV2', Buffer.from(data));
    console.log(new Date().toLocaleString(), 'insert!');
    return;
  };
  task();
  setInterval(() => {
    task();
  }, 1000 * 60);
}
InsertQueue();
