import {useRef, useEffect, useState} from 'react'
import maplibregl from 'maplibre-gl'

import vector from '../vector.json'

maplibregl.accessToken = process.env.NEXT_PUBLIC_MAPGL_API_KEY
let hoveredStateId = null
let map = null

export default function MapLibre() {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const mapContainer = useRef(null)

  useEffect(() => {
    map = new maplibregl.Map({
      container: mapContainer.current,
      style: vector,
      center: [1.85, 46.6167],
      zoom: 5.3,
    })

    const onMouseMove = e => {
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            {source: 'regions', id: hoveredStateId},
            {hover: false}
          )
        }

        hoveredStateId = e.features[0].id
        map.setFeatureState(
          {source: 'regions', id: hoveredStateId},
          {hover: true}
        )
      }
    }

    const onMouseLeave = () => {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          {source: 'regions', id: hoveredStateId},
          {hover: false}
        )
      }

      hoveredStateId = null
    }

    map.on('mousemove', 'departements', onMouseMove)
    map.on('mouseleave', 'departements', onMouseLeave)

    // Removes previously registered event listeners to avoid memory leaks
    return () => {
      map.off('mousemove', 'departements', onMouseMove)
      map.off('mouseleave', 'departements', onMouseLeave)
    }
  }, [])

  // Fetch geojson
  const fetchData = async () => {
    const res = await fetch('https://france-geojson.gregoiredavid.fr/repo/departements.geojson')
    const data = await res.json()

    map.addSource('regions', {
      type: 'geojson',
      data,
      generateId: true
    })

    map.addLayer({
      id: 'france',
      type: 'line',
      source: 'regions',
      paint: {
        'line-color': '#376663',
        'line-width': 1
      }
    })

    map.addLayer({
      id: 'departements',
      type: 'fill',
      source: 'regions',
      paint: {
        'fill-color': '#088',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.5
        ]
      }
    })

    setIsDataLoaded(true)
  }

  useEffect(() => {
    try {
      // If map is created and data aren't loaded, fetch datas and set souces and layers to the map
      if (map && !isDataLoaded) {
        fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  }, [isDataLoaded])

  return (
    <div>
      <div ref={mapContainer} className='map-container' />

      <style jsx>{`
        .map-container {
          height: 100vh;
          width: 100vw;
        }
      `}</style>
    </div>
  )
}
