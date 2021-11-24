import {useRef, useEffect, useState, useCallback} from 'react'
import maplibregl from 'maplibre-gl'

export default function Map() {
  const map = useRef(null)
  const mapContainer = useRef(null)
  useEffect(() => {
    if (map.current) {
      return
    } // Initialize map only once

    map.current = new maplibregl.Map({
      container: 'mapContainer.current',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [46.6167, 1.85],
      zoom: 5.3,
      token: 'pk.eyJ1Ijoib2N0bzU2IiwiYSI6ImNrd2FzdnhhNTNlNWIydXJvOHRlOTd1a3kifQ.dQXSiz-mZ1fIRX5hmvOFsQ'
    })
  })

  return (
    <div>
      <div id='maplibre' ref={mapContainer} />

      <style jsx>{`
        .map-wrap {
          position: relative;
          width: 100%;
          height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
        }

        .map {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
