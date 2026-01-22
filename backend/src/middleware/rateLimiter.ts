import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'), // 5 reports per hour per IP
  message: {
    error: 'Too many reports submitted. Please wait before submitting another report.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for police endpoints
  skip: (req) => {
    return req.path.includes('/police/') || req.method === 'GET';
  }
});