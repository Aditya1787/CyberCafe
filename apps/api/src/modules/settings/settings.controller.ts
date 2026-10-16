import { Request, Response, NextFunction } from 'express';
import * as settingsService from './settings.service.js';

export async function getPublicSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await settingsService.getPublicSettings();
    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
}

export async function getAllSettingsAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await settingsService.getAllSettingsAdmin();
    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
}

export async function updateSettingAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { key } = req.params;
    const updated = await settingsService.updateSettingAdmin(key, req.body, req.user?.id);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}
