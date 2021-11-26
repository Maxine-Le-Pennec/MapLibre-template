import MapReact from '../components/map-reactgl'
import MapLibre from '../components/map-maplibre'

function HomePage() {
  return (
    <div className='maps-container'>
      <div>
        <h2>React Map GL</h2>
        <MapReact />
      </div>
      <div>
        <h2>Maplibre</h2>
        <MapLibre />
      </div>

      <style jsx>{`
        .maps-container {
          display: flex;
          gap: 1em;
          height: 100vh;
          width: 100vw;
        }

        .maps-container div {
          flex: 1;
        }
      `}</style>
    </div>
  )
}

export default HomePage
