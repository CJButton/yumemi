import React from 'react';
import './App.css';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { fetchPrefectures, fetchPrefecturePopulation } from './requests'
import { prefectures, population } from  './testData'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prefCodes: {},
      chartOptions: {
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        xAxis: {
          categories: [],
        },
        series: [
          { data: [] }
        ],
      },
    };

    this.fetchPrefecturePopulation = this.fetchPrefecturePopulation.bind(this)
  }

  fetchPrefecturePopulation(e) {
    // const res = await fetchPrefecturePopulation(1)
    // console.log(res, 'did mount results')
  }

  async componentDidMount() {
    try {
      // const res = await fetchPrefectures()
      const res = prefectures
      const randPref = Math.floor(Math.random() * Math.floor(res.result.length))
      const { prefCode, prefName } = res.result[randPref]

      // we randomly fetch one of the prefecures data using their prefCode
      // const popData = await fetchPrefecturePopulation(prefCode)
      const popData = population
      const prefGeneralPop = popData.result.data[0].data.map(el => el.value)
      const years = popData.result.data[0].data.map(el => el.year)

      this.setState({
        prefCodes: res.result.reduce((acc, pref) => ({ ...acc, [pref.prefName]: pref.prefCode}), {}),
        chartOptions: {
          ...this.state.chartOptions,
          xAxis: {
            categories: years,
          },
          series: [
            { name: prefName, data: prefGeneralPop }
          ],
        }
      })
    }
    catch(err) {
      console.log(err, 'oh no! error!')
    }
  }

// position: absolute;
// z-index: 100;
// margin-top: 3rem;

  render() {
    const { chartOptions } = this.state
    console.log(this.state)

    const checkboxGrid = {
      'display': 'grid',
      'gridTemplateColumns': 'repeat(10, 1fr)',
      'gridGap': '10px',
    }

    const displayPrefectureCheckboxes = () => {
      return prefectures.result.map(pref => (
        <label key={`prefCheckbox-${pref.prefName}`}>
          <input
            name="isGoing"
            type="checkbox"
            checked
            onChange={() => this.fetchPrefecturePopulation(pref.prefCode) } />
            { pref.prefName }
        </label>
      ))
    }

    return(
      <div className="App">
        <div style={checkboxGrid}>{ displayPrefectureCheckboxes() }</div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    )
  }
}

export default App;
