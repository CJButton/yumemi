const API_KEY = 'xYEnhEhFcvudNNKwrmCqRKcJkRA4xN3LJiHdPJVw'

const HTTP_HEADER = { 'Content-Type': 'text/html',
                      'Accept-Charset' : 'utf-8',
                      'X-API-KEY' : API_KEY,
                    };
const RESAS_URL = 'https://opendata.resas-portal.go.jp'

/*
  This fetches all prefectures in Japan, 
  upon initial loading of the app  
*/
export const fetchPrefectures = () => {
  const method = 'GET'
  const url = 'api/v1/prefectures'
  return request(url, { method })
}

export const fetchPrefecturePopulation = (prefCode, cityCode = '-') => {
  const method = 'GET'
  const params = `?cityCode${cityCode}&prefCode=${prefCode}`
  const url = `api/v1/population/composition/perYear`.concat(params)
  return request(url, { method })
}

export const request = async (endpoint, options = {}) => {
  const { method } = options
  const url = `${RESAS_URL}/${endpoint}`
  try {
    const res = await fetch(url, { method, headers: HTTP_HEADER })
    return res.json()
  }
  catch(err) {
    console.error('request error')
  }
}