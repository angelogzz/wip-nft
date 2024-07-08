// Navigation.js
import { useState, useEffect } from "react";
import logo from "../assets/Logo.png";

const Navigation = ({ account, setAccount }) => {
  const [theme, setTheme] = useState("light"); // Estado para el tema

  useEffect(() => {
    document.body.className = theme; // Cambia la clase del body cuando el tema cambia
  }, [theme]);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light"); // Alterna el tema
  };

  return (
    <nav>
      <ul className="nav__links">
        <li>
          <a href="#">Buy</a>
        </li>
        <li>
          <a href="#">Sell</a>
        </li>
      </ul>

      <div className="nav__brand">
        <img src={logo} alt="Logo" />
        <h1>George Brown Huskies DEMO</h1>
      </div>

      <ul className="nav_buttons">
        <li>
          {account ? (
            <button type="button" className="nav__connect">
              {account.slice(0, 6) + "..." + account.slice(38, 42)}
            </button>
          ) : (
            <button
              type="button"
              className="nav__connect"
              onClick={connectHandler}
            >
              Connect
            </button>
          )}
        </li>

        <li>
          <button onClick={toggleTheme} className="nav__theme-toggle">
            {theme === "light" ? "🌞" : "🌜"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
