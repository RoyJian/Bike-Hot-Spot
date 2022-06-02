import amqplib from 'amqplib';
import 'dotenv/config';
const { RABBITMQ_HOST, RABBITMQ_PORT } = process.env;

export default async function connect() {
  const connection = await amqplib.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`);
  const channel = await connection.createChannel();
  return channel;
}
