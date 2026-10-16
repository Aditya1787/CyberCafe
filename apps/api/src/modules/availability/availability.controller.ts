import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as availabilityService from './availability.service.js';

const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  serviceId: z.string().uuid().optional(),
});

const blockedDateSchema = z.object({
  blocked_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
});

export async function getAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = availabilityQuerySchema.parse(req.query);
    const availability = await availabilityService.getAvailabilityForDate(query.date);
    res.json({ data: availability });
  } catch (err) {
    next(err);
  }
}

export async function getBusinessHoursAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const hours = await availabilityService.getBusinessHoursAdmin();
    res.json({ data: hours });
  } catch (err) {
    next(err);
  }
}

export async function updateBusinessHoursAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const weekday = parseInt(req.params.weekday, 10);
    const updated = await availabilityService.updateBusinessHoursAdmin(weekday, req.body, req.user?.id);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function getBlockedDatesAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dates = await availabilityService.getBlockedDatesAdmin();
    res.json({ data: dates });
  } catch (err) {
    next(err);
  }
}

export async function createBlockedDateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = blockedDateSchema.parse(req.body);
    const created = await availabilityService.createBlockedDateAdmin(input.blocked_date, input.reason, req.user?.id);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

export async function deleteBlockedDateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await availabilityService.deleteBlockedDateAdmin(id, req.user?.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
