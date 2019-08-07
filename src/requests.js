// import { request } from "https";

const API_KEY = 'xYEnhEhFcvudNNKwrmCqRKcJkRA4xN3LJiHdPJVw'

// 'text/html',
const HTTP_HEADER = { 'Content-Type': 'text/html',
                      'Accept-Charset' : 'utf-8',
                      'X-API-KEY' : API_KEY,
                    };
const RESAS_URL = 'https://opendata.resas-portal.go.jp'
// xYEnhEhFcvudNNKwrmCqRKcJkRA4xN3LJiHdPJVw
// 403 is returned if no key or key is invalid

/*
  This fetches all prefectures in Japan, 
  upon initial loading of the app  
*/
export const fetchPrefectures = () => {
  const method = 'GET'
  const url = 'api/v1/prefectures'
  return request(url, { method })
}

// GET https://opendata.resas-portal.go.jp/api/v1/
// population/composition/perYear?cityCode=11362&prefCode=11
// ?cityCode=-&prefCode=11 if we want all the population
export const fetchPrefecturePopulation = (prefCode, cityCode = '-') => {
  const method = 'GET'
  const params = `?cityCode${cityCode}&prefCode=${prefCode}`
  const url = `api/v1/population/composition/perYear`.concat(params)
  return request(url, { method })
}

// do we need 'same-origin here?'
// body goes in the options if we have one to send
export const request = async (endpoint, options = {}) => {
  const { method } = options
  const url = `${RESAS_URL}/${endpoint}`
  try {
    const res = await fetch(url, { method, headers: HTTP_HEADER })
    return res.json()
  }
  catch(err) {
    console.log(err, 'err------')
  }
  // const results = await fetch(url, { method, headers: HTTP_HEADER })
  // .then(res => ( res.json() ))
}