import { NavLink } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  return (
    <div className="header">
      <div className="header__container">
        <h1 className="header__title">Stream Track</h1>
        <nav className="header__nav">
          <ul className="header__list">
            <NavLink to={"/"} className="header__link header__link--all">
              All
            </NavLink>
            <NavLink
              to={"/twitch"}
              className="header__link header__link--twitch"
            >
              Twitch
            </NavLink>
            <NavLink
              to={"/youtube"}
              className="header__link header__link--youtube"
            >
              Youtube
            </NavLink>
          </ul>
        </nav>
      </div>
    </div>
  );
}
