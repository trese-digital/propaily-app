import { IcShield } from "@/components/icons";
import {
  Avatar,
  Badge,
  type BadgeTone,
  Card,
  CardHeader,
  EmptyState,
  initialsFrom,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui";
import { appScope, requireContext } from "@/server/auth/context";
import { can } from "@/server/auth/can";
import { roleLabel } from "@/server/auth/roles";
import { withAppScope } from "@/server/db/scoped";
import { InviteUserButton, MemberActions, type UserScope } from "./users-actions";

const numFmt = new Intl.NumberFormat("es-MX");

function statusBadge(invited: boolean, suspended: boolean): {
  label: string;
  tone: BadgeTone;
} {
  if (suspended) return { label: "Suspendido", tone: "bad" };
  if (invited) return { label: "Invitado", tone: "info" };
  return { label: "Activo", tone: "ok" };
}

export default async function UsuariosPage() {
  const ctx = await requireContext();

  const memberships = await withAppScope(appScope(ctx), (tx) =>
    tx.membership.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true, status: true } },
        client: { select: { name: true } },
      },
    }),
  );

  const canManage = can(ctx, "user.manage");
  const scope: UserScope = ctx.accessScope === "gf" ? "gf" : "client";

  const rows = memberships.map((m) => ({
    id: m.id,
    userId: m.userId,
    name: m.user.name ?? m.user.email,
    email: m.user.email,
    role: m.role,
    roleLabel: roleLabel(m.role),
    scopeLabel: m.client?.name ?? "Operador GF",
    invited: m.user.status === "invited",
    suspended: m.status === "suspended",
    isSelf: m.userId === ctx.user.id,
  }));

  const activos = rows.filter((r) => !r.suspended && !r.invited).length;
  const invitados = rows.filter((r) => r.invited).length;

  return (
    <section className="mx-auto flex max-w-[1100px] flex-col gap-6 px-8 py-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono-label">Equipo y permisos</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.015em]">Usuarios</h1>
          <p className="mt-1 text-sm text-ink-500">
            {scope === "gf"
              ? "Operadores con acceso al backoffice de GF."
              : "Personas con acceso al portal de esta cuenta."}{" "}
            {numFmt.format(activos)} activo{activos === 1 ? "" : "s"}
            {invitados > 0 ? ` · ${numFmt.format(invitados)} invitado${invitados === 1 ? "" : "s"}` : ""}.
          </p>
        </div>
        {canManage && <InviteUserButton scope={scope} />}
      </header>

      <Card>
        <CardHeader
          title="Miembros"
          action={<span className="text-xs text-ink-500">{rows.length} en total</span>}
        />
        {rows.length === 0 ? (
          <EmptyState
            icon={IcShield}
            title="Sin usuarios"
            description="Invita a tu equipo para que accedan al portal."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Usuario</TH>
                <TH>Rol</TH>
                <TH>Alcance</TH>
                <TH>Estado</TH>
                {canManage && <TH align="right">Acciones</TH>}
              </TR>
            </THead>
            <TBody>
              {rows.map((r) => {
                const st = statusBadge(r.invited, r.suspended);
                return (
                  <TR key={r.id}>
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={initialsFrom(r.name)} size={32} />
                        <div className="min-w-0">
                          <div className="font-medium text-ink-900">{r.name}</div>
                          <div className="mono text-[11px] text-ink-500">{r.email}</div>
                        </div>
                      </div>
                    </TD>
                    <TD>{r.roleLabel}</TD>
                    <TD>{r.scopeLabel}</TD>
                    <TD>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </TD>
                    {canManage && (
                      <TD align="right">
                        <MemberActions
                          membershipId={r.id}
                          currentRole={r.role}
                          currentRoleLabel={r.roleLabel}
                          scope={scope}
                          suspended={r.suspended}
                          isSelf={r.isSelf}
                        />
                      </TD>
                    )}
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>

      <p className="mono text-[11px] leading-relaxed text-ink-400">
        El rol define qué puede hacer cada usuario. Los permisos por propiedad o
        portafolio (granulares) llegan en una fase posterior.
      </p>
    </section>
  );
}
