import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: 'admin' | 'staff';
  displayName: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication token missing or invalid',
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured()) {
      // In development if Supabase credentials are not set, return clear error
      res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Supabase authentication service is not configured. Please supply SUPABASE_URL and keys.',
        },
      });
      return;
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'The session has expired or the token is invalid',
        },
      });
      return;
    }

    // Verify role and active status in public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, role, is_active')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      res.status(403).json({
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Administrator profile record does not exist for this account',
        },
      });
      return;
    }

    if (!profile.is_active) {
      res.status(403).json({
        error: {
          code: 'ACCOUNT_DEACTIVATED',
          message: 'This administrative account has been deactivated',
        },
      });
      return;
    }

    if (profile.role !== 'admin' && profile.role !== 'staff') {
      res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have administrative permissions to perform this action',
        },
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role,
      displayName: profile.display_name,
    };

    next();
  } catch (error) {
    next(error);
  }
}
