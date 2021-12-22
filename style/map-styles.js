export const regionsContour = {
  id: 'map',
  source: 'regions',
  type: 'line',
  paint: {
    'line-color': '#2053B3'
  }
}

export const regionFill = {
  id: 'regionFill',
  type: 'fill',
  source: 'regions',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#2053B3',
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0.5
    ]
  }
}
