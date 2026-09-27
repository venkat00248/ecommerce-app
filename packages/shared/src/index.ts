export type Product = { id: string; name: string; description: string; price: number; category: string; imageUrl: string; inventory: number };
export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled';
export type OrderCreatedEvent = { orderId: string; userId: string; total: number; createdAt: string };
export const KAFKA_TOPICS = { orderCreated: 'orders.created' } as const;