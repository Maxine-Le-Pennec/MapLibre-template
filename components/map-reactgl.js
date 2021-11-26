import {useState, useEffect, useCallback} from 'react'
import ReactMapGL, {Source, Layer, Popup, NavigationControl} from 'react-map-gl'

import {regionsContour, regionFill} from '../style/map-styles'

let hoveredStateId = null

export default function MapReactGL() {
  const [map, setMap] = useState(null)
  const [allData, setAllData] = useState(null)
  const [hoverInfo, setHoverInfo] = useState(null)
  const [error, setError] = useState(null)
  const [viewport, setViewport] = useState({
    longitude: 1.85,
    latitude: 46.6167,
    zoom: 5.3,
    bearing: 0,
    pitch: 0
  })

  const isOutsideFrance = !(hoverInfo && hoverInfo.name)

  // Create a ref to access mapbox map object
  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [setMap])

  // Fetch geojson
  const fetchData = async () => {
    let error = null
    try {
      const res = await fetch('https://france-geojson.gregoiredavid.fr/repo/departements.geojson')
      const data = await res.json()
      setAllData(data)
    } catch {
      error = 'Data cannot be fetched'
    }

    setError(error)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onHover = useCallback(event => {
    const {features, lngLat} = event
    const hoveredFeature = features && features[0]

    if (hoveredFeature) { // DOM need to be mount !
      setHoverInfo(
        {
          name: hoveredFeature.properties.nom,
          code: hoveredFeature.properties.code,
          // Get longitude and latitude for popup
          x: lngLat[0],
          y: lngLat[1]
        }
      )

      // Change style if not hovered anymore
      if (hoveredStateId && hoveredFeature.id !== hoveredStateId) {
        map.setFeatureState(
          {source: 'regions', id: hoveredStateId},
          {hover: false}
        )
      }

      // Change style if hover
      hoveredStateId = hoveredFeature.id
      map.setFeatureState(
        {source: 'regions', id: hoveredStateId},
        {hover: true}
      )
    }
  }, [map])

  const onMouseLeave = () => {
    // When mouse leave the geojson delimited zone, empty data to undisplay popup
    map.setFeatureState(
      {source: 'regions', id: hoveredStateId},
      {hover: false}
    )
    setHoverInfo(null)
  }

  return error ? <div>{error}</div> : (
    <ReactMapGL
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPGL_API_KEY}
      {...viewport}
      width='auto'
      height='100vh'
      onViewportChange={setViewport}
      mapStyle='mapbox://styles/mapbox/light-v9'
      onHover={onHover}
      onMouseLeave={onMouseLeave}
      ref={mapRef}
      interactiveLayerIds={['regionFill']}
    >
      <Source type='geojson' data={allData} id='regions' generateId>
        <NavigationControl />
        <Layer {...regionsContour} />
        <Layer {...regionFill} />
      </Source>

      {!isOutsideFrance && (
        <Popup
          latitude={hoverInfo.y}
          longitude={hoverInfo.x}
          closeButton={false}
          anchor='bottom'
        >
          <div className='tooltip' style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>Département: {hoverInfo.name}</div>
            <div>Code : {hoverInfo.code}</div>

            <style jsx>{`
              .tooltip {
                background: #343332;
                color: white;
                padding: 1em;
                margin: -1em;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                gap: 1em;
              }
            `}</style>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  )
}

