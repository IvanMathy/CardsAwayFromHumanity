import redis from "redis"

export const redisClient = redis.createClient({ host: 'localhost', port: 6379 });
export const redisPublisher = redisClient.duplicate()
export const redisSubscriber = redisClient.duplicate()