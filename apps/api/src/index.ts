import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import { Kafka } from 'kafkajs';
import { KAFKA_TOPICS, Product } from '@ecommerce/shared';

const products: Product[] = [
  { id: 'p-1', name: 'Everyday Carry Tote', description: 'A structured canvas tote for work and weekends.', price: 68, category: 'Bags', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', inventory: 12 },
  { id: 'p-2', name: 'Studio Headphones', description: 'Warm sound, all-day comfort, no distractions.', price: 129, category: 'Audio', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', inventory: 7 },
  { id: 'p-3', name: 'Ceramic Pour Over', description: 'Slow mornings, better coffee, beautifully made.', price: 42, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80', inventory: 19 }
];

const typeDefs = `#graphql
  type Product { id: ID!, name: String!, description: String!, price: Float!, category: String!, imageUrl: String!, inventory: Int! }
  type Query { products: [Product!]!, product(id: ID!): Product }
`;
const resolvers = { Query: { products: () => products, product: (_: unknown, { id }: { id: string }) => products.find((product) => product.id === id) } };
const port = Number(process.env.PORT ?? 4000);

async function start() {
  const app = express();
  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();
  app.use(cors(), express.json());
  app.get('/health', (_request, response) => response.json({ status: 'ok', service: 'api' }));
  app.use('/graphql', expressMiddleware(apollo));
  app.listen(port, () => console.log(`API listening on http://localhost:${port}/graphql`));
  if (process.env.MONGO_URI) await mongoose.connect(process.env.MONGO_URI).catch((error) => console.warn('Mongo unavailable:', error.message));
  if (process.env.KAFKA_BROKERS) { new Kafka({ clientId: 'ecommerce-api', brokers: process.env.KAFKA_BROKERS.split(',') }); console.log(`Kafka topic ready: ${KAFKA_TOPICS.orderCreated}`); }
}
start().catch((error) => { console.error(error); process.exit(1); });