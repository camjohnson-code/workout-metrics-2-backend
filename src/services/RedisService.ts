import { redisClient } from '../redisClient';
import { randomUUID } from 'crypto';

export class RedisService {
  private readonly SESSION_TTL = 14 * 24 * 60 * 60; // 14 days in seconds

  async createSession(userId: string) {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + this.SESSION_TTL * 1000).toISOString();

    const sessionData = {
      userId,
      sessionId,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    // Store session in Redis with TTL
    await redisClient.setex(`session:${sessionId}`, this.SESSION_TTL, JSON.stringify(sessionData));

    return {
      sessionId,
      expiresAt,
    };
  }

  async updateOrCreateSession(userId: string) {
    // First, try to find an existing session for this user
    const existingSession = await this.findSessionByUserId(userId);

    if (existingSession) {
      // Update the existing session with new expiration
      const expiresAt = new Date(Date.now() + this.SESSION_TTL * 1000).toISOString();
      const updatedSessionData = {
        ...existingSession,
        expiresAt,
      };

      // Update the session in Redis with new TTL
      await redisClient.setex(
        `session:${existingSession.sessionId}`,
        this.SESSION_TTL,
        JSON.stringify(updatedSessionData)
      );

      return {
        sessionId: existingSession.sessionId,
        expiresAt,
      };
    } else {
      // Create a new session if none exists
      return this.createSession(userId);
    }
  }

  private async findSessionByUserId(userId: string) {
    // Scan all session keys to find one for this user
    const keys = await redisClient.keys('session:*');

    for (const key of keys) {
      const sessionData = await redisClient.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData as string);
        if (session.userId === userId) {
          return session;
        }
      }
    }

    return null;
  }

  async getSession(sessionId: string) {
    const sessionData = await redisClient.get(`session:${sessionId}`);
    return sessionData ? JSON.parse(sessionData as string) : null;
  }

  async deleteSession(sessionId: string) {
    await redisClient.del(`session:${sessionId}`);
  }

  async refreshSession(sessionId: string) {
    const sessionData = await this.getSession(sessionId);
    if (!sessionData) return null;

    // Create new session with same user
    return this.createSession(sessionData.userId);
  }
}

export default RedisService;
