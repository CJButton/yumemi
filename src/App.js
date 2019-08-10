import React, { 
      useState,
      useRef, 
      useEffect } from 'react';
import './App.css';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import logo from './logo.svg';
import { fetchPrefectures,
         fetchPrefecturePopulation } from './requests'
import RenderCheckboxes from './RenderCheckboxes'

// const defaultChartOptions = {
//       chartOptions: {
//         credits: {
//           enabled: true,
//           text: 'Created by Christopher Button 2019'
//           },
//           title: { text: '', align: 'center', },
//         legend: {
//           layout: 'vertical',
//           align: 'right',
//           verticalAlign: 'middle'
//         },
//         yAxis: { title: { text: '総人口' }},
//       }
// }

const App = () => {
  const [chartOptions, updateChart] = useState({})
  const [isLoading, updateLoader] = useState(true)
  const [checkedPrefs, updateCheckedPrefs] = useState({}) // { prefName: bool }
  const [prefArray, updatePrefArray] = useState([]) // [ { prefName: str, prefCode: num } ]
  const chartRef = useRef();

    // title: {
    //   text: 'Prefecture Population',
    //   align: 'center',
    //  },

  const verifyIfPrefectureIsDisplayed = (prefCode) => {
    return chartOptions.series.findIndex(el => el.prefCode === prefCode)
  }

  const removeFromChart = (idx, prefName) => {
    const series = JSON.parse(JSON.stringify(chartOptions.series))
    series.splice(idx, 1)
    const updatedChartOptions = {
      ...chartOptions,
      series: [ ...series ]
    }
    updateCheckedPrefs({...checkedPrefs, [prefName]: false })
    updateChart(updatedChartOptions)
  }

  const getPrefecturePopulation = async ({prefName, prefCode}) => {
    const prefStatus = verifyIfPrefectureIsDisplayed(prefCode)
    if(prefStatus > -1) return removeFromChart(prefStatus, prefName)

    const res = await fetchPrefecturePopulation(prefCode)
    const additionalSeries = {
      prefCode,
      name: prefName,
      data: res.result.data[0].data.map(el => el.value) 
    }
    const series = JSON.parse(JSON.stringify(chartOptions.series))
    const updatedChartOptions = {
        ...chartOptions,
        series: [
          ...series,
          additionalSeries
        ],
    }
    updateChart(updatedChartOptions)
    updateCheckedPrefs({...checkedPrefs, [prefName]: true })
  }

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const res = await fetchPrefectures()
        // if(res.status && res.status >= 300) 
        // description: ""
        // message: "Forbidden."
        // statusCode: "403"
          // const randPref = Math.floor(Math.random() * Math.floor(res.result.length))
          const { prefCode, prefName } = res.result[46]
          // we randomly fetch one of the prefecures data using their prefCode
          const popData = await fetchPrefecturePopulation(prefCode)
          const prefGeneralPop = popData.result.data[0].data.map(el => el.value)
          const years = popData.result.data[0].data.map(el => el.year)
          const prefCodes = res.result.reduce((acc, pref) => ({ ...acc, [pref.prefName]: false}), {})
          updateLoader(false)
          updateCheckedPrefs({ ...prefCodes, [prefName]: true })
          updatePrefArray(res.result)

          const updatedChartOptions = {
            credits: {
              enabled: true,
              text: 'Created by Christopher Button 2019'
              },
              title: { text: '', align: 'center', },
            legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle'
            },
            yAxis: { title: { text: '総人口' }},
            xAxis: { categories: years },
            series: [ 
              { prefCode, 
                name: prefName,
                data: prefGeneralPop } 
            ],
          }
          updateChart(updatedChartOptions)
  
          const container = chartRef.current.container.current
          container.style.width = "100%";
          chartRef.current.chart.reflow();
        }
        catch(err) {
          console.log(err, 'oh no! error!')
        }
    }
    initialFetch()
  }, [])
    return(
      <div className="App">
        <header className="App-header">
        { isLoading && <img src={logo} className="App-logo" alt="logo" /> }

        <div className='checkbox-wrapper'>
          <RenderCheckboxes
            elementsArr={prefArray}
            checkedObj={checkedPrefs}
            callback={getPrefecturePopulation}
            elementKey={'prefName'}
          />
        </div>

        {!isLoading && 
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartRef}
          />
        }
        </header>
      </div>
    )
}

export default App;
