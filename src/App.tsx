import { useEffect, useState } from "react";
import "./App.css";

type Screen =
  | "welcome"
  | "phone"
  | "verify"
  | "home"
  | "platform"
  | "minesweeper";

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handlePhone(value: string) {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
    setError("");
  }

  function sendCode() {
    if (phone.length !== 10) {
      setError("Ingresa un número de 10 dígitos.");
      return;
    }

    if (!phone.endsWith("777")) {
      setError("Para la prueba el número debe terminar en 777.");
      return;
    }

    setError("");
    setScreen("verify");
  }

  function login() {
    if (code !== "777777") {
      setError("Código incorrecto. Usa 777777.");
      return;
    }

    setError("");
    setScreen("home");
  }

  return (
    <main className="app">
      {screen === "welcome" && (
        <section className="loginCard center">
          <div className="logo">♪</div>

          <h1>JTikTok</h1>

          <h2>Bienvenido</h2>

          <p>
            Juega minijuegos rápidos directamente desde tu navegador.
            Vincula tu cuenta para comenzar.
          </p>

          <button
            className="primaryButton"
            onClick={() => setScreen("phone")}
          >
            ♪ Iniciar sesión con TikTok
          </button>

          <small>Versión de prueba</small>
        </section>
      )}

      {screen === "phone" && (
        <section className="loginCard">
          <button
            className="back"
            onClick={() => setScreen("welcome")}
          >
            ←
          </button>

          <div className="miniLogo">♪</div>

          <h2>Iniciar sesión</h2>

          <p>Ingresa tu número de teléfono.</p>

          <div className="phoneBox">
            <span>🇨🇴 +57</span>

            <input
              value={phone}
              onChange={(e) => handlePhone(e.target.value)}
              placeholder="3000000000"
            />
          </div>

          <div className="counter">
            {phone.length}/10
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="primaryButton"
            onClick={sendCode}
          >
            Enviar código
          </button>

          <small>Prueba: usa un número terminado en 777.</small>
        </section>
      )}

      {screen === "verify" && (
        <section className="loginCard center">
          <div className="loader"></div>

          <h2>Solicitando código...</h2>

          <p>
            Ingresa el código cuando lo recibas.
          </p>

          <input
            className="codeInput"
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            placeholder="000000"
          />

          {error && <div className="error">{error}</div>}

          <button
            className="primaryButton"
            onClick={login}
          >
            Ingresar
          </button>

          <small>Código de prueba: 777777</small>
        </section>
      )}

      {screen === "home" && (
        <section className="home">
          <header>
            <div className="brand">
              <span>♪</span>
              JTikTok
            </div>

            <div className="profile">
              +57 {phone}
            </div>
          </header>

          <div className="homeContent">
            <div className="hero">
              <p>JTIKTOK GAMES</p>
              <h1>Elige un juego</h1>
              <span>
                Minijuegos rápidos para jugar cuando quieras.
              </span>
            </div>

            <div className="gamesGrid">
              <button
                className="gameCard"
                onClick={() => setScreen("platform")}
              >
                <div className="gamePreview platformPreview">
                  <div className="previewPlayer"></div>
                  <div className="previewPlatform one"></div>
                  <div className="previewPlatform two"></div>
                  <div className="previewPlatform three"></div>
                </div>

                <div className="gameInfo">
                  <h3>Jump Up</h3>
                  <p>Salta de plataforma en plataforma.</p>
                  <span>Jugar →</span>
                </div>
              </button>

              <button
                className="gameCard"
                onClick={() => setScreen("minesweeper")}
              >
                <div className="gamePreview minePreview">
                  <span>1</span>
                  <span>💣</span>
                  <span>2</span>
                  <span></span>
                  <span>1</span>
                  <span></span>
                  <span>2</span>
                  <span></span>
                  <span>1</span>
                </div>

                <div className="gameInfo">
                  <h3>MineTap</h3>
                  <p>Encuentra las casillas seguras.</p>
                  <span>Jugar →</span>
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === "platform" && (
        <PlatformGame onBack={() => setScreen("home")} />
      )}

      {screen === "minesweeper" && (
        <Minesweeper onBack={() => setScreen("home")} />
      )}
    </main>
  );
}

function PlatformGame({ onBack }: { onBack: () => void }) {
  const [playerX, setPlayerX] = useState(45);
  const [playerY, setPlayerY] = useState(82);
  const [velocity, setVelocity] = useState(0);
  const [score, setScore] = useState(0);

  const platforms = [
    { x: 35, y: 90, width: 28 },
    { x: 12, y: 72, width: 25 },
    { x: 55, y: 55, width: 26 },
    { x: 20, y: 37, width: 23 },
    { x: 58, y: 20, width: 25 },
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPlayerX((x) => Math.max(2, x - 5));
      }

      if (e.key === "ArrowRight") {
        setPlayerX((x) => Math.min(93, x + 5));
      }

      if (e.key === "ArrowUp" || e.key === " ") {
        setVelocity(-4);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const loop = setInterval(() => {
      setPlayerY((y) => {
        let nextY = y + velocity;

        setVelocity((v) => v + 0.35);

        platforms.forEach((platform) => {
          const onPlatform =
            playerX + 5 > platform.x &&
            playerX < platform.x + platform.width &&
            y < platform.y &&
            nextY >= platform.y - 5 &&
            velocity > 0;

          if (onPlatform) {
            nextY = platform.y - 6;
            setVelocity(-5.5);
            setScore((s) => s + 1);
          }
        });

        if (nextY > 95) {
          setPlayerX(45);
          setVelocity(0);
          setScore(0);
          return 82;
        }

        return nextY;
      });
    }, 30);

    return () => clearInterval(loop);
  }, [velocity, playerX]);

  return (
    <section className="gamePage">
      <GameHeader
        title="Jump Up"
        score={score}
        onBack={onBack}
      />

      <div className="platformGame">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="platform"
            style={{
              left: `${platform.x}%`,
              top: `${platform.y}%`,
              width: `${platform.width}%`,
            }}
          />
        ))}

        <div
          className="player"
          style={{
            left: `${playerX}%`,
            top: `${playerY}%`,
          }}
        />
      </div>

      <div className="mobileControls">
        <button
          onClick={() =>
            setPlayerX((x) => Math.max(2, x - 6))
          }
        >
          ←
        </button>

        <button onClick={() => setVelocity(-5)}>
          ↑
        </button>

        <button
          onClick={() =>
            setPlayerX((x) => Math.min(93, x + 6))
          }
        >
          →
        </button>
      </div>
    </section>
  );
}

const minePositions = [2, 7, 11, 18, 23];

function Minesweeper({ onBack }: { onBack: () => void }) {
  const [opened, setOpened] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);

  function getNearbyMines(index: number) {
    const row = Math.floor(index / 5);
    const col = index % 5;

    let count = 0;

    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = row + r;
        const newCol = col + c;

        if (
          newRow >= 0 &&
          newRow < 5 &&
          newCol >= 0 &&
          newCol < 5
        ) {
          const pos = newRow * 5 + newCol;

          if (minePositions.includes(pos)) {
            count++;
          }
        }
      }
    }

    return count;
  }

  function openCell(index: number) {
    if (gameOver || opened.includes(index)) return;

    setOpened([...opened, index]);

    if (minePositions.includes(index)) {
      setGameOver(true);
    }
  }

  function restart() {
    setOpened([]);
    setGameOver(false);
  }

  return (
    <section className="gamePage">
      <GameHeader
        title="MineTap"
        score={opened.length}
        onBack={onBack}
      />

      <div className="mineGame">
        <div className="mineStatus">
          {gameOver
            ? "💥 Perdiste"
            : "Encuentra las casillas seguras"}
        </div>

        <div className="mineBoard">
          {Array.from({ length: 25 }).map((_, index) => {
            const isOpen =
              opened.includes(index) || gameOver;

            const isMine =
              minePositions.includes(index);

            return (
              <button
                key={index}
                className={`mineCell ${
                  isOpen ? "open" : ""
                }`}
                onClick={() => openCell(index)}
              >
                {isOpen &&
                  (isMine
                    ? "💣"
                    : getNearbyMines(index) || "")}
              </button>
            );
          })}
        </div>

        <button
          className="primaryButton restart"
          onClick={restart}
        >
          Reiniciar
        </button>
      </div>
    </section>
  );
}

function GameHeader({
  title,
  score,
  onBack,
}: {
  title: string;
  score: number;
  onBack: () => void;
}) {
  return (
    <header className="gameHeader">
      <button onClick={onBack}>←</button>

      <strong>{title}</strong>

      <span>{score}</span>
    </header>
  );
}

export default App;