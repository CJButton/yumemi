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
  const [title, updateTitle] = useState('')
  const chartRef = useRef();

  const verifyIfPrefectureIsDisplayed = (prefName) => {
    return chartOptions.series.findIndex(el => el.name === prefName)
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
    const prefStatus = verifyIfPrefectureIsDisplayed(prefName)
    if(prefStatus > -1) return removeFromChart(prefStatus, prefName)

    try {
      const res = await fetchPrefecturePopulation(prefCode)
      if(res.statusCode) throw new Error(res)

      const additionalSeries = {
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

        const randPrefIDX = Math.floor(Math.random() * Math.floor(res.result.length))
        const { prefCode, prefName: randomPref } = res.result[randPrefIDX]

        const prefRes = await fetchPrefecturePopulation(prefCode)
        if(prefRes.statusCode) throw new Error(prefRes)
        
        const prefNames = res.result.reduce((acc, pref) => ({ ...acc, [pref.prefName]: false}), {})
        updateInitialLoad(false)
        updateCheckedPrefs({ ...prefNames, [randomPref]: true })
        updatePrefArray(res.result)

        const title = prefRes.result.data[0].label
        updateTitle(title)
        const initialChart = JSON.parse(JSON.stringify(HighChartsOptions))
        initialChart.yAxis = { title: { text: title }}
        initialChart.xAxis = { categories: prefRes.result.data[0].data.map(el => el.year) }
        initialChart.series.push(
          { name: randomPref,
            data: prefRes.result.data[0].data.map(el => el.value) } )
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
            { title }
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
