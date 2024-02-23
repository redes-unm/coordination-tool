import Map from '@/components/map/Map';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles['main']}>
      <div style={{ height: '800px' }}>
        <Map initialLngLat={[-84.396, 33.777]} initialZoom={12} annotations={[]} />
      </div>
    </main>
  );
}
