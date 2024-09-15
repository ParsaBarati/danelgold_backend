import 'express-session';

declare module 'express-session' {
  interface SessionData {
    tokens: string[];
    phone: string;
  }
}
