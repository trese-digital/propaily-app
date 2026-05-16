/**
 * Lecturas de avisos (Notification). Server-only, NO es un módulo de acciones.
 *
 * RLS aísla por ManagementCompany; cada query filtra además por `userId` para
 * que un usuario sólo vea sus propios avisos.
 */
import { withAppScope } from "@/server/db/scoped";

type Scope = { managementCompanyId: string; clientId: string | null };

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
};

export async function getUnreadCount(
  scope: Scope,
  userId: string,
): Promise<number> {
  return withAppScope(scope, (tx) =>
    tx.notification.count({
      where: { userId, channel: "in_app", readAt: null },
    }),
  );
}

export async function listNotifications(
  scope: Scope,
  userId: string,
): Promise<NotificationRow[]> {
  return withAppScope(scope, (tx) =>
    tx.notification.findMany({
      where: { userId, channel: "in_app" },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        readAt: true,
        createdAt: true,
      },
    }),
  );
}
