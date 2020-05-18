import redis from "redis"

var port = 6379

if (process.env.REDIS_PORT !== undefined) {
    port = parseInt(process.env.REDIS_PORT)
}

let tempRedisSettings: object = { host: process.env.REDIS_IP ?? 'localhost', port: port}

if(process.env.REDIS_URL !== undefined) {

    // Running on Heroku, no need for a port
    tempRedisSettings = { host: process.env.REDIS_URL}
}

export const redisSettings = tempRedisSettings

export const redisClient = redis.createClient(redisSettings);
export const redisPublisher = redisClient.duplicate()
export const redisSubscriber = redisClient.duplicate()