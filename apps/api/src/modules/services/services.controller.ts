import { Request, Response, NextFunction } from 'express';
import { serviceCreateSchema, serviceQuerySchema, serviceUpdateSchema } from './services.schemas.js';
import * as servicesService from './services.service.js';

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await servicesService.getActiveCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
}

export async function getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = serviceQuerySchema.parse(req.query);
    const result = await servicesService.getPublicServices(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getServiceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const service = await servicesService.getServiceBySlug(slug);
    if (!service) {
      res.status(404).json({
        error: {
          code: 'SERVICE_NOT_FOUND',
          message: `Service with slug '${slug}' not found`,
        },
      });
      return;
    }
    res.json({ data: service });
  } catch (err) {
    next(err);
  }
}

export async function getAllServicesAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const services = await servicesService.getAllServicesAdmin();
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
}

export async function createServiceAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = serviceCreateSchema.parse(req.body);
    const service = await servicesService.createServiceAdmin(input, req.user?.id);
    res.status(201).json({ data: service });
  } catch (err) {
    next(err);
  }
}

export async function updateServiceAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const input = serviceUpdateSchema.parse(req.body);
    const service = await servicesService.updateServiceAdmin(id, input, req.user?.id);
    res.json({ data: service });
  } catch (err) {
    next(err);
  }
}

export async function deleteServiceAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const service = await servicesService.deactivateServiceAdmin(id, req.user?.id);
    res.json({
      data: service,
      message: 'Service deactivated successfully to preserve historical appointments',
    });
  } catch (err) {
    next(err);
  }
}
