import redis from "redis"

var port = 6379

if (process.env.REDIS_PORT !== undefined) {
    port = parseInt(process.env.REDIS_PORT)
}

export const redisSettings = { host: process.env.REDIS_IP ?? 'localhost', port: port}

export const redisClient = redis.createClient(redisSettings);
export const redisPublisher = redisClient.duplicate()
export const redisSubscriber = redisClient.duplicate()