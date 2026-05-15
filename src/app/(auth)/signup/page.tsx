"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signup, type SignupState } from "./actions";
import { TurnstileWidget } from "@/components/turnstile";
import styles from "../login/login.module.css";

const initialState: SignupState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div className={styles.page}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 420 }}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <span className={styles.brandName}>propaily</span>
            <span className={styles.brandSub}>portafolios</span>
          </div>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.sub}>Acceso por invitación.</p>

          {state?.needsConfirmation ? (
            <p className={styles.sub}>
              Te enviamos un correo de confirmación. Ábrelo para activar la cuenta.
            </p>
          ) : (
            <form action={formAction} className={styles.form}>
              <label className={styles.label}>
                <span>Nombre</span>
                <input name="name" type="text" required autoFocus className={styles.input} />
              </label>
              <label className={styles.label}>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                <span>Contraseña</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className={styles.input}
                />
              </label>

              {state?.error ? <p className={styles.error}>{state.error}</p> : null}

              <TurnstileWidget pending={pending} />

              <button type="submit" disabled={pending} className={styles.button}>
                {pending ? "Creando…" : "Crear cuenta"}
              </button>
            </form>
          )}

          <p className={styles.footer}>
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
          </p>
        </div>
        <p className={styles.endoso}>BY GF CONSULTORÍA</p>
      </div>
    </div>
  );
}
