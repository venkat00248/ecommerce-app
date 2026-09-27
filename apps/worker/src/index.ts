import 'dotenv/config';
import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';
import { KAFKA_TOPICS } from '@ecommerce/shared';

async function start() {
  if (process.env.MONGO_URI) await mongoose.connect(process.env.MONGO_URI);
  const kafka = new Kafka({ clientId: 'ecommerce-worker', brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',') });
  const consumer = kafka.consumer({ groupId: 'ecommerce-order-workers' });
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPICS.orderCreated, fromBeginning: false });
  await consumer.run({ eachMessage: async ({ message }) => console.log('Order event received:', message.value?.toString()) });
}
start().catch((error) => { console.error('Worker stopped:', error); process.exit(1); });