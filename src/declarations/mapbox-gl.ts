// import the package to augment its types rather than replace them
import 'mapbox-gl';

declare module 'mapbox-gl' {
  interface MarkerOptions {
    className?: string | undefined
  }
}
