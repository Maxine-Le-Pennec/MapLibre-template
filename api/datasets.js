export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.adresse.data.gouv.fr'

async function _fetch(url, method, body) {
  const options = {
    method,
    mode: 'cors'
  }

  if (method === 'POST') {
    options.headers = {'Content-Type': 'application/json'}
    if (body) {
      options.body = JSON.stringify(body)
    }
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    const {message} = await response.json()
    throw new Error(message)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export async function getDatasets() {
  return _fetch('https://france-geojson.gregoiredavid.fr/repo/departements.geojson', 'GET')
}
