import {useRef, useEffect, useState} from 'react'
import maplibregl from '!maplibre-gl' // eslint-disable-line import/no-webpack-loader-syntax

import vector from '../vector.json'
maplibregl.accessToken = process.env.NEXT_PUBLIC_MAPGL_API_KEY

let hoveredStateId = null

export default function MapLibre() {
  const [data, setData] = useState(null)
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) {
      map.current.addSource('regions', {
        type: 'geojson',
        data,
        generateId: true
      })

      map.current.addLayer({
        id: 'france',
        type: 'line',
        source: 'regions',
        paint: {
          'line-color': '#376663',
          'line-width': 1
        }
      })

      map.current.addLayer({
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

      map.current.on('mousemove', 'departements', e => {
        console.log(e)
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              {source: 'region', id: hoveredStateId},
              {hover: false}
            )
          }

          hoveredStateId = e.features[0].id
          map.current.setFeatureState(
            {source: 'regions', id: hoveredStateId},
            {hover: true}
          )
        }
      })

      map.current.on('mouseleave', 'departements', () => {
        if (hoveredStateId !== null) {
          map.current.setFeatureState(
            {source: 'regions', id: hoveredStateId},
            {hover: false}
          )
        }

        hoveredStateId = null
      })
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: vector,
      center: [1.85, 46.6167],
      zoom: 5.3,
      source: {data}
    })
  })

  // Fetch geojson
  const fetchData = async () => {
    const res = await fetch('https://france-geojson.gregoiredavid.fr/repo/departements.geojson')
    const data = await res.json()
    setData(data)
  }

  useEffect(() => {
    try {
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }, [])

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
