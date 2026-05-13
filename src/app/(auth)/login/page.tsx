"use client";

import { useActionState } from "react";
import Link from "next/link";

import { login, type LoginState } from "./actions";
import styles from "./login.module.css";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className={styles.page}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 420 }}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <span className={styles.brandName}>propaily</span>
            <span className={styles.brandSub}>portafolios</span>
          </div>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.sub}>Bienvenido de vuelta.</p>

          <form action={formAction} className={styles.form}>
            <label className={styles.label}>
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
                autoFocus
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              <span>Contraseña</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={styles.input}
              />
            </label>

            {state?.error ? <p className={styles.error}>{state.error}</p> : null}

            <button type="submit" disabled={pending} className={styles.button}>
              {pending ? "Validando…" : "Entrar"}
            </button>
          </form>

          <p className={styles.footer}>
            ¿No tienes cuenta? <Link href="/signup">Regístrate</Link>
          </p>
        </div>
        <p className={styles.endoso}>BY GF CONSULTORÍA</p>
      </div>
    </div>
  );
}
