import { redis } from '~/server/redis';
const config = {
  maxRequestsPerDay: 20,
} as const;

export const getKey = (ip: string) => {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const key = `rate_limit:${ip}:${today}`;
  return key;
};
/// return true if the user need to be limited
export const rateLimiter = async (ip: string) => {
  const key = getKey(ip);

  try {
    const initialCount = parseInt(await redis.get(key) || '0');
    if (isNaN(initialCount)) throw new Error('Invalid value');
    await redis.set(key, initialCount + 1);

    if (initialCount >= 20) return true;
    if (initialCount == 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const secondsUntilMidnight = Math.ceil(
        (tomorrow.getTime() - Date.now()) / 1000,
      );

      await redis.expire(key, secondsUntilMidnight);
    }
    return initialCount + 1 >= config.maxRequestsPerDay;
  } catch (error) {
    console.error(error);
    return true;
  }
};
