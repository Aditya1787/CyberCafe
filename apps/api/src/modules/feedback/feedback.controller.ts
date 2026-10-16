import { Request, Response, NextFunction } from 'express';
import {
  adminFeedbackQuerySchema,
  submitFeedbackSchema,
  updateFeedbackModerationSchema,
  updateFeedbackNotesSchema,
} from './feedback.schemas.js';
import * as feedbackService from './feedback.service.js';

export async function submitFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = submitFeedbackSchema.parse(req.body);
    const feedback = await feedbackService.submitFeedback(input);
    res.status(201).json({
      data: feedback,
      message: 'Thank you for your valuable feedback! It has been submitted for review.',
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicApprovedFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const feedback = await feedbackService.getPublicApprovedFeedback();
    res.json({ data: feedback });
  } catch (err) {
    next(err);
  }
}

export async function getAdminFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = adminFeedbackQuerySchema.parse(req.query);
    const result = await feedbackService.getAdminFeedback(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateFeedbackModeration(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateFeedbackModerationSchema.parse(req.body);
    const updated = await feedbackService.updateFeedbackModeration(id, input, req.user?.id);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function updateFeedbackNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateFeedbackNotesSchema.parse(req.body);
    const updated = await feedbackService.updateFeedbackInternalNotes(id, input.internal_notes, req.user?.id);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteFeedbackAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await feedbackService.deleteFeedbackAdmin(id, req.user?.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
