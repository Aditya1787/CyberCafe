import { Request, Response, NextFunction } from 'express';
import {
  adminAppointmentsQuerySchema,
  createAppointmentSchema,
  lookupAppointmentSchema,
  updateStatusSchema,
} from './appointments.schemas.js';
import * as appointmentsService from './appointments.service.js';

export async function createAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createAppointmentSchema.parse(req.body);
    const appointment = await appointmentsService.createAppointment(input);
    res.status(201).json({
      data: appointment,
      message: 'Appointment booked successfully. Please arrive on time with the required documents.',
    });
  } catch (err) {
    next(err);
  }
}

export async function lookupAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = lookupAppointmentSchema.parse(req.body);
    const appointment = await appointmentsService.lookupAppointment(input);
    res.json({ data: appointment });
  } catch (err) {
    next(err);
  }
}

export async function getAdminAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = adminAppointmentsQuerySchema.parse(req.query);
    const result = await appointmentsService.getAdminAppointments(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getAdminAppointmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const appointment = await appointmentsService.getAdminAppointmentById(id);
    if (!appointment) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Appointment not found' },
      });
      return;
    }
    res.json({ data: appointment });
  } catch (err) {
    next(err);
  }
}

export async function updateAppointmentStatusAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateStatusSchema.parse(req.body);
    const updated = await appointmentsService.updateAppointmentStatusAdmin(id, input, req.user?.id);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function cancelAppointmentAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await appointmentsService.updateAppointmentStatusAdmin(
      id,
      { status: 'cancelled', notes: req.body?.notes || 'Cancelled by administrator' },
      req.user?.id
    );
    res.json({ data: updated, message: 'Appointment cancelled successfully' });
  } catch (err) {
    next(err);
  }
}

export async function exportAppointmentsCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const csvData = await appointmentsService.exportAppointmentsCSV({
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      status: req.query.status as string,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=appointments-${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csvData);
  } catch (err) {
    next(err);
  }
}
