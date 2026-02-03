import * as React from "react";
import Header from "../Header";
import Footer from "../Footer";
import "../../styles/global.css";
import * as styles from "./Layout.module.css";

interface FooterStats {
  owned?: number;
  wishlist?: number;
  collectionValue?: number;
  wishlistValue?: number;
}

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  stats?: FooterStats;
}

const Layout: React.FC<LayoutProps> = ({ children, title, stats }) => {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header currentPage={title} />
      <main id="main-content" className={styles.main} role="main">
        <div className={styles.container}>{children}</div>
      </main>
      <Footer stats={stats} />
    </div>
  );
};

export default Layout;
