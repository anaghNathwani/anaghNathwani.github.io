import Nav from "./Nav";
import Footer from "./Footer";
import Tour from "./Tour";
import styles from "./PageLayout.module.css";

/**
 * Wrap any page with this to get the Nav + Footer automatically.
 * Usage:
 *   <PageLayout>
 *     <YourPageContent />
 *   </PageLayout>
 */
export default function PageLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
      <Tour />
    </div>
  );
}
