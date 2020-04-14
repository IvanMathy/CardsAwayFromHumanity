import redis from "redis"

export const redisClient = redis.createClient({ host: 'localhost', port: 6379 });
export const redisPublisher = redis.createClient({ host: 'localhost', port: 6379 });