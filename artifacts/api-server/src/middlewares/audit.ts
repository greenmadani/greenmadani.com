import type { Request, Response, NextFunction } from "express";
import { supabase } from "@workspace/db";

export async function logAudit(
  action: string,
  entityType: string,
  entityId?: number,
  changes?: Record<string, unknown>,
) {
  await supabase!.from("audit_log").insert({
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    changes: changes ?? null,
  }).select();
}

export function auditMiddleware(action: string, entityType: string, entityId?: (req: Request) => number | undefined, changes?: (req: Request) => Record<string, unknown> | undefined) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const id = entityId ? entityId(req) : undefined;
      const changeData = changes ? changes(req) : undefined;
      await logAudit(action, entityType, id, changeData);
    } catch (err) {
      console.error("Audit log error:", err);
    }
    next();
  };
}
