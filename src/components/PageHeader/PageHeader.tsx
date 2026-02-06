import * as React from "react";
import * as styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showPriceLegend?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children, showPriceLegend = false }) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>
          <span className={styles.prompt}>{">"}</span> {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {showPriceLegend && (
          <p className={styles.legend}>
            * Reference retail price = official LEGO MSRP
          </p>
        )}
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
};

export default PageHeader;
