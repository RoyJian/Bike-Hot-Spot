import amqplib from 'amqplib';
import 'dotenv/config';
const { RABBITMQ_HOST, RABBITMQ_PORT, NODE_ENV } = process.env;

export default async function connect() {
  const host = NODE_ENV === 'Deployment' ? RABBITMQ_HOST : '127.0.0.1';
  const connection = await amqplib.connect(`amqp://${host}:${RABBITMQ_PORT}`);
  // const channel = await connection.createChannel();
  return connection;
}
