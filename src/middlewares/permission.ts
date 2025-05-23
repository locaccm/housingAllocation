import { Request, Response, NextFunction } from "express";

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Authorization token missing" });
      return;
    }

    (req as any).permission = permission;
    next();
  };
};
