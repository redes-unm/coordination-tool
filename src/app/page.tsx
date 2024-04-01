import Map from '@/components/map/Map';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles['main']}>
      <div style={{ height: '800px' }}>
        <Map annotations={[]} />
      </div>
    </main>
  );
}
