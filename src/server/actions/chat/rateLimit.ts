'use server';
import { headers } from 'next/headers';
import { getKey } from '~/app/api/chat/utils';
import { redis } from '~/server/redis';

export const getRateLimitAction = async () => {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || '';
  const key = getKey(ip);
  try {
    const currentCount = parseInt(await redis.get(key) || '20');
    return currentCount;
  } catch (error) {
    error = error as Error;
    console.log(error);
    return 20;
  }
};
