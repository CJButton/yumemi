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
import HighChartsOptions from './HighChartsOptions'
import ModalBase from './ModalBase'

const App = () => {
  const [chartOptions, updateChart] = useState({})
  const [isLoading, updateLoader] = useState(false)
  const [checkedPrefs, updateCheckedPrefs] = useState({}) // { prefName: bool }
  const [prefArray, updatePrefArray] = useState([])       // [ { prefName: str, prefCode: num } ]
  const [initialLoad, updateInitialLoad] = useState(true)
  const [modalOpen, updateModal] = useState(false)
  const [errorMessage, updateErrorMessage] = useState('initial')
  const chartRef = useRef();
  //   text: 'Prefecture Population',

  const verifyIfPrefectureIsDisplayed = (prefCode) => {
    return chartOptions.series.findIndex(el => el.prefCode === prefCode)
  }

  const removeFromChart = (idx, prefName) => {
    updateLoader(true)
    const updatedChartOptions = JSON.parse(JSON.stringify(chartOptions))
    updatedChartOptions.series.splice(idx, 1)

    updateCheckedPrefs({ ...checkedPrefs, [prefName]: false })
    updateChart(updatedChartOptions)
    updateLoader(false)
  }

  const togglePrefecturePopulation = async ({prefName, prefCode}) => {
    updateLoader(true)
    const prefStatus = verifyIfPrefectureIsDisplayed(prefCode)
    if(prefStatus > -1) return removeFromChart(prefStatus, prefName)

    try {
      const res = await fetchPrefecturePopulation(prefCode)
      // if(res.statusCode) throw new Error(res)
      if(true) throw new Error(res)

      const additionalSeries = {
        prefCode,
        name: prefName,
        data: res.result.data[0].data.map(el => el.value) 
      }
      const updatedChartOptions = JSON.parse(JSON.stringify(chartOptions))
      updatedChartOptions.series.push(additionalSeries)

      updateChart(updatedChartOptions)
      updateCheckedPrefs({...checkedPrefs, [prefName]: true })
      updateLoader(false)
    }
    catch(err) {
      errorHandler(err, 'fetchPrefecture')
    }
  }

  const errorHandler = (err, errorOrigin) => {
    console.error(err)
    updateErrorMessage(errorOrigin)
    updateModal(true)
  }

  const closeModal = () => {
    updateModal(false)
    updateLoader(false)
  }

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const res = await fetchPrefectures()
        if(res.statusCode) throw new Error(res)

        const randPref = Math.floor(Math.random() * Math.floor(res.result.length))
        const { prefCode, prefName } = res.result[randPref]

        // we randomly fetch one of the prefecures data using the random prefCode
        const popData = await fetchPrefecturePopulation(prefCode)
        if(popData.statusCode) throw new Error()
        
        const prefNames = res.result.reduce((acc, pref) => ({ ...acc, [pref.prefName]: false}), {})
        updateInitialLoad(false)
        updateCheckedPrefs({ ...prefNames, [prefName]: true })
        updatePrefArray(res.result)

        const initialChart = JSON.parse(JSON.stringify(HighChartsOptions))
        initialChart.yAxis = { title: { text: '総人口' }}
        initialChart.xAxis = { categories: popData.result.data[0].data.map(el => el.year) }
        initialChart.series.push(
          { prefCode, 
            name: prefName,
            data: popData.result.data[0].data.map(el => el.value) } )
        updateChart(initialChart)

        const container = chartRef.current.container.current
        container.style.width = "100%";
        chartRef.current.chart.reflow();
      }
      catch(err) {
        errorHandler(err, 'initial')
      }
    }
    initialFetch()
  }, [])
    console.log(errorMessage)
    return(
      <div className="App">
        <ModalBase 
          openStatus={modalOpen}
          errorType={errorMessage}
          callback={closeModal}
          updateLoader={updateLoader} />
        <header className="App-header">
        { (isLoading || initialLoad) && <img src={logo} className="App-logo" alt="logo" /> }

        { initialLoad ? null :
          (<React.Fragment>
            <div className='checkbox-wrapper'>
              <RenderCheckboxes
                elementsArr={prefArray}
                checkedObj={checkedPrefs}
                callback={togglePrefecturePopulation}
                elementKey={'prefName'}
              />
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              ref={chartRef}
            />
          </React.Fragment>)
        }
        </header>
      </div>
    )
}

export default App;
