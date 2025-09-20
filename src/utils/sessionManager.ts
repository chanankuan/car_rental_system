import type { Request } from "express";

export class SessionManager {
  static regenerate(req: Request): Promise<void> {
    return new Promise((resolve, reject): void => {
      req.session.regenerate(err => {
        if (err) reject(err);

        resolve();
      });
    });
  }

  static save(req: Request): Promise<void> {
    return new Promise((resolve, reject): void => {
      req.session.save(err => {
        if (err) reject(err);

        resolve();
      });
    });
  }

  static destroy(req: Request): Promise<void> {
    return new Promise((resolve, reject): void => {
      req.session.destroy(err => {
        if (err) reject(err);

        resolve();
      });
    });
  }
}
