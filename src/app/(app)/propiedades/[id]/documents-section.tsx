"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import {
  uploadDocument,
  editDocument,
  getDocumentSignedUrl,
  deleteDocument,
  type UploadDocumentState,
  type EditDocumentState,
} from "@/server/documents/actions";

const CATEGORY_LABEL: Record<string, string> = {
  deed: "Escritura",
  purchase_contract: "Contrato de compraventa",
  lease_contract: "Contrato de arrendamiento",
  commercial_valuation: "Avalúo comercial",
  fiscal_valuation: "Avalúo fiscal",
  identification: "Identificación",
  power_of_attorney: "Poder notarial",
  bank_statement: "Estado de cuenta",
  tax: "Predial / impuestos",
  insurance: "Seguro",
  floor_plan: "Plano",
  maintenance: "Mantenimiento",
  payment_proof: "Comprobante de pago",
  legal: "Legal (otro)",
  other: "Otro",
};

export type DocumentRow = {
  id: string;
  name: string;
  category: string;
  sensitivity: string;
  createdAt: string;
  versions: {
    fileName: string;
    sizeBytes: number;
    contentType: string;
  }[];
};

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const initialUpload: UploadDocumentState = {};

export function DocumentsSection({
  propertyId,
  documents,
}: {
  propertyId: string;
  documents: DocumentRow[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [state, action, pending] = useActionState(uploadDocument, initialUpload);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Reset del form después de cada subida exitosa (sin cerrarlo)
  useEffect(() => {
    if (state.ok && state.ts) {
      formRef.current?.reset();
    }
  }, [state.ts, state.ok]);

  async function onDownload(id: string) {
    const r = await getDocumentSignedUrl(id);
    if (r.url) window.open(r.url, "_blank", "noopener,noreferrer");
    else alert(r.error ?? "Error");
  }

  function onDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Queda en historial pero deja de aparecer.`)) return;
    startTransition(async () => {
      const r = await deleteDocument(id);
      if (r.error) alert(r.error);
    });
  }

  return (
    <div className="bg-white border border-black/8 rounded-xl p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-medium m-0">
          Documentos <span className="text-slate font-mono text-sm">({documents.length})</span>
        </h2>
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-teal text-navy px-4 py-2 rounded-md text-sm font-semibold border border-teal hover:bg-teal-bright transition-colors"
          >
            + Subir documento
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-slate text-sm hover:text-navy"
          >
            Cerrar
          </button>
        )}
      </div>

      {showForm ? (
        <form
          ref={formRef}
          action={action}
          className="space-y-4 mb-6 pb-6 border-b border-black/8"
        >
          <input type="hidden" name="propertyId" value={propertyId} />

          <Field label="Nombre del documento *">
            <input name="name" required className="doc-input" autoFocus />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoría *">
              <select name="category" required defaultValue="deed" className="doc-input">
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sensibilidad">
              <select name="sensitivity" defaultValue="normal" className="doc-input">
                <option value="normal">Normal</option>
                <option value="sensitive">Sensible</option>
              </select>
            </Field>
          </div>

          <Field label="Archivo (máx 25 MB) *">
            <input
              name="file"
              type="file"
              required
              className="doc-input"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt"
            />
          </Field>

          {state.error ? <p className="text-magenta text-sm font-medium">{state.error}</p> : null}
          {state.ok && state.ts ? (
            <p className="text-teal-deep text-sm font-medium">
              ✓ Subido. Puedes subir otro o cerrar.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="bg-teal text-navy px-5 py-2.5 rounded-md text-sm font-semibold border border-teal hover:bg-teal-bright transition-colors disabled:opacity-50"
          >
            {pending ? "Subiendo…" : "Subir"}
          </button>

          <style>{`
            .doc-input {
              width: 100%;
              padding: 10px 12px;
              border: 1px solid rgba(7, 11, 31, 0.2);
              border-radius: 6px;
              background: #FFFFFF;
              font-family: var(--font-sans);
              font-size: 14px;
              color: var(--color-navy);
              outline: none;
              transition: border-color 0.12s, box-shadow 0.12s;
            }
            .doc-input:focus {
              border-color: var(--color-navy);
              box-shadow: 0 0 0 3px rgba(7, 11, 31, 0.08);
            }
          `}</style>
        </form>
      ) : null}

      {documents.length === 0 ? (
        <p className="text-slate text-sm text-center py-6">
          Sin documentos. Sube el primero (escrituras, avalúos, identificaciones).
        </p>
      ) : (
        <ul className="space-y-1">
          {documents.map((d) => (
            <DocumentRow
              key={d.id}
              doc={d}
              editing={editingId === d.id}
              onEdit={() => setEditingId(d.id)}
              onCancelEdit={() => setEditingId(null)}
              onDownload={() => onDownload(d.id)}
              onDelete={() => onDelete(d.id, d.name)}
              onSaved={() => setEditingId(null)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const initialEdit: EditDocumentState = {};

function DocumentRow({
  doc,
  editing,
  onEdit,
  onCancelEdit,
  onDownload,
  onDelete,
  onSaved,
}: {
  doc: DocumentRow;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const action = editDocument.bind(null, doc.id);
  const [state, formAction, pending] = useActionState(action, initialEdit);

  useEffect(() => {
    if (state.ok && state.ts) onSaved();
  }, [state.ts, state.ok, onSaved]);

  const v = doc.versions[0];

  if (editing) {
    return (
      <li className="py-3 px-3 rounded-md bg-paper-2 border border-teal/40">
        <form action={formAction} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Nombre">
              <input name="name" required defaultValue={doc.name} className="doc-input" autoFocus />
            </Field>
            <Field label="Categoría">
              <select name="category" required defaultValue={doc.category} className="doc-input">
                {Object.entries(CATEGORY_LABEL).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sensibilidad">
              <select name="sensitivity" defaultValue={doc.sensitivity} className="doc-input">
                <option value="normal">Normal</option>
                <option value="sensitive">Sensible</option>
              </select>
            </Field>
          </div>
          {state.error ? <p className="text-magenta text-xs">{state.error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="bg-teal text-navy text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-teal-bright disabled:opacity-50"
            >
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-slate text-xs hover:text-navy px-2 py-1.5"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-4 py-2 px-3 rounded-md hover:bg-paper-2 transition-colors">
      <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-navy text-white shrink-0 w-[140px] text-center">
        {CATEGORY_LABEL[doc.category] ?? doc.category}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-navy truncate text-sm">{doc.name}</p>
        <p className="font-mono text-[11px] text-slate">
          {v ? `${v.fileName} · ${fmtSize(v.sizeBytes)}` : "(sin archivo)"}
          {doc.sensitivity === "sensitive" ? " · 🔒 sensible" : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-slate text-sm hover:text-navy transition-colors"
        title="Editar metadata"
      >
        ✎
      </button>
      <button
        type="button"
        onClick={onDownload}
        className="text-teal-deep text-sm hover:text-teal transition-colors"
      >
        Descargar
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-slate hover:text-magenta text-sm transition-colors"
        title="Eliminar"
      >
        ✕
      </button>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] text-slate tracking-wider uppercase">{label}</span>
      {children}
    </label>
  );
}
