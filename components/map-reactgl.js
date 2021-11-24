import {useState, useEffect, useCallback} from 'react'
import ReactMapGL, {Source, Layer} from 'react-map-gl'

import {regionsContour, regionFill} from '../style/map-styles'

let hoveredStateId = null

export default function MapReactGL() {
  const [map, setMap] = useState(null)
  const [allData, setAllData] = useState(null)
  const [hoverInfo, setHoverInfo] = useState(null)
  const [viewport, setViewport] = useState({
    longitude: 1.85,
    latitude: 46.6167,
    zoom: 5.3,
    bearing: 0,
    pitch: 0
  })

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [setMap])

  const fetchData = async () => {
    const res = await fetch('https://france-geojson.gregoiredavid.fr/repo/departements.geojson')
    const data = await res.json()
    setAllData(data)
  }

  useEffect(() => {
    try {
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const onHover = useCallback(event => {
    const {features} = event
    const hoveredFeature = features && features[0]
    const name = hoveredFeature ? hoveredFeature.properties.nom : null
    setHoverInfo({name})

    if (hoveredFeature) {
      if (hoveredFeature.id !== hoveredStateId) {
        map.setFeatureState(
          {source: 'regions', id: hoveredStateId},
          {hover: false}
        )
      }

      hoveredStateId = hoveredFeature.id
      map.setFeatureState(
        {source: 'regions', id: hoveredStateId},
        {hover: true}
      )
    }
  }, [map])

  const onMouseLeave = () => {
    map.setFeatureState(
      {source: 'regions', id: hoveredStateId},
      {hover: false}
    )
  }

  return (
    <ReactMapGL
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPGL_API_KEY}
      {...viewport}
      width='100vw'
      height='100vh'
      onViewportChange={setViewport}
      mapStyle='mapbox://styles/mapbox/light-v9'
      onHover={onHover}
      onMouseLeave={onMouseLeave}
      ref={mapRef}
      interactiveLayerIds={['regionFill']}
    >
      <Source type='geojson' data={allData} id='regions' generateId>
        <Layer {...regionsContour} />
        <Layer {...regionFill} />
      </Source>

      {hoverInfo && (
        <div className='tooltip' style={{left: hoverInfo.x, top: hoverInfo.y}}>
          <div>Département: {hoverInfo.name}</div>
        </div>
      )}
    </ReactMapGL>
  )
}

