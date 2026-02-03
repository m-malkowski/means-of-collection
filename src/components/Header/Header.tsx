import * as React from "react";
import { Link } from "gatsby";
import ThemeToggle from "../ThemeToggle";
import * as styles from "./Header.module.css";

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <span className={styles.prompt}>$</span> means-of-collection
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/wishlist/"
            className={`${styles.navLink} ${
              currentPage === "Wishlist" ? styles.active : ""
            }`}
          >
            [wishlist]
          </Link>
          <Link
            to="/collection/"
            className={`${styles.navLink} ${
              currentPage === "Collection" ? styles.active : ""
            }`}
          >
            [collection]
          </Link>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
