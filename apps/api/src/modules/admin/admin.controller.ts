import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service.js';

export async function getDashboardOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const metrics = await adminService.getDashboardMetrics();
    res.json({ data: metrics });
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const logs = await adminService.getAuditLogs(limit);
    res.json({ data: logs });
  } catch (err) {
    next(err);
  }
}
