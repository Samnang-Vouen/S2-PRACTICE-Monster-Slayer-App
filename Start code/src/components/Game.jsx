import React, { useState } from "react";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createLogAttack(isPlayer, damage) {
  return {
    type: "attack",
    text: `${isPlayer ? "Player" : "Monster"} takes ${damage} damage`,
    isPlayer,
    damage
  };
}

function createLogHeal(healing) {
  return {
    type: "heal",
    text: `Player heals for ${healing} life points`,
    healing
  };
}

function createLogSpecialAttack(isPlayer, damage) {
  return {
    type: "specialAttack",
    text: `${isPlayer ? "Player" : "Monster"} uses a special attack and deals ${damage} damage`,
    isPlayer,
    damage
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [logs, setLogs] = useState([]);
  const [turns, setTurns] = useState(0);  // Track turns

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  function attackHandler() {
    let damage = getRandomValue(5, 15);

    // Normal attack
    setLogs((prevLogs) => [...prevLogs, createLogAttack(true, damage)]);
    setMonsterHealth((prev) => Math.max(prev - damage, 0));

    if (monsterHealth - damage > 0) {
      const monsterDamage = getRandomValue(5, 15);
      setPlayerHealth((prev) => Math.max(prev - monsterDamage, 0));
      setLogs((prevLogs) => [...prevLogs, createLogAttack(false, monsterDamage)]);
    }

    setTurns((prevTurns) => prevTurns + 1); // Increment turns
  }

  function specialAttackHandler() {
    if (turns % 3 === 0) {
      let damage = getRandomValue(15, 30);

      // Special attack (always available for player)
      setLogs((prevLogs) => [...prevLogs, createLogSpecialAttack(true, damage)]);
      setMonsterHealth((prev) => Math.max(prev - damage, 0));

      if (monsterHealth > 0) {
        const monsterDamage = getRandomValue(5, 15);
        setPlayerHealth((prev) => Math.max(prev - monsterDamage, 0));
        setLogs((prevLogs) => [...prevLogs, createLogAttack(false, monsterDamage)]);
      }
    } else {
      alert("Special attack can only be used every 3 turns!");
    }

    setTurns((prevTurns) => prevTurns + 1); // Increment turns
  }

  function healHandler() {
    const heal = getRandomValue(10, 20);
    setPlayerHealth((prev) => Math.min(prev + heal, 100));
    setLogs((prevLogs) => [...prevLogs, createLogHeal(heal)]);

    const monsterDamage = getRandomValue(5, 15);
    setPlayerHealth((prev) => Math.max(prev - monsterDamage, 0));
    setLogs((prevLogs) => [...prevLogs, createLogAttack(false, monsterDamage)]);
  }

  function selfKillHandler() {
    setPlayerHealth(0);
    setLogs((prevLogs) => [...prevLogs, "Player chooses to kill themselves!"]);
  }

  function restartGame() {
    setPlayerHealth(100);
    setMonsterHealth(100);
    setLogs([]);
    setTurns(0); // Reset turns
  }

  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  function Entity({ name, health }) {
    return (
      <section className="container">
        <h2>{name}</h2>
        <div className="healthbar">
          <div className="healthbar__value" style={{ width: `${health}%` }}></div>
        </div>
      </section>
    );
  }

  function Log({ logs }) {
    const renderLog = (log) => {
      if (log.type === "attack") {
        return (
          <li key={log.text} className="log--damage">
            <span className={log.isPlayer ? "log--player" : "log--monster"}>
              {log.isPlayer ? "Player" : "Monster"}
            </span>
            <span className="log--damage"> takes {log.damage} damage</span>
          </li>
        );
      }

      if (log.type === "heal") {
        return (
          <li key={log.text} className="log--heal">
            <span className="log--player">Player</span> heals for <span className="log--heal">{log.healing} life points</span>
          </li>
        );
      }

      if (log.type === "specialAttack") {
        return (
          <li key={log.text} className="log--damage">
            <span className={log.isPlayer ? "log--player" : "log--monster"}>
              {log.isPlayer ? "Player" : "Monster"}
            </span>
          </li>
        );
      }

      return <li key={log.text}>{log.text}</li>;
    };

    return (
      <section id="log" className="container">
        <h3>Battle Log</h3>
        <ul>
          {logs.map((log) => renderLog(log))}
        </ul>
      </section>
    );
  }

  function GameOver({ winner, onRestart }) {
    return (
      <section className="container">
        <h2>Game Over!</h2>
        <h2>{winner} Wins!</h2>
        <button onClick={onRestart}>New Game</button>
      </section>
    );
  }

  // ----------------------------------------------------------------------------------------------------------
  // MAIN TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <div>
      <Entity name="Your Health" health={playerHealth} className="container" />
      <Entity name="Monster Health" health={monsterHealth} className="container" />

      {/* Conditionally render controls or GameOver */}
      {playerHealth === 0 || monsterHealth === 0 ? (
        <GameOver winner={playerHealth === 0 ? "Monster" : "Player"} onRestart={restartGame} />
      ) : (
        <section id="controls">
          <button onClick={attackHandler}>ATTACK</button>
          <button
            onClick={specialAttackHandler}
            disabled={turns % 3 !== 0}
          >
            SPECIAL!
          </button>

          <button onClick={healHandler}>HEAL</button>
          <button onClick={selfKillHandler}>KILL YOURSELF</button>
        </section>
      )}

      <Log logs={logs} />
      console.log(turn);
    </div>
  );
}

export default Game;
