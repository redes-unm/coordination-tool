import styles from './page.module.css';
import Map from '../components/Map';

export default function Home() {
  return (
    <main className={styles.main}>
      <div style={{ height: '800px' }}>
        <Map />
      </div>
    </main>
  );
}
