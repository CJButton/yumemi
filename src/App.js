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
          align: 'center',
          verticalAlign: 'top',
          floating: true,
          x: 0,
          y: 100
        },
        xAxis: {
          categories: [],
        },
        series: [
          { data: [] }
        ],
        plotOptions: {
          series: {
            showCheckbox: true,
            point: {
              events: {
                mouseOver: (e) => this.fetchPrefecturePopulation(e)
              }
            }
          }
        }
      },
      hoverData: null
    };

    this.fetchPrefecturePopulation = this.fetchPrefecturePopulation.bind(this)
  }

  fetchPrefecturePopulation(e) {
    // const res = await fetchPrefecturePopulation(1)
    // console.log(res, 'did mount results')

  //   series: [{
  //     name: 'Installation',
  //     data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
  // }, {
  //     name: 'Manufacturing',
  //     data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
  // }, {
  //     name: 'Sales & Distribution',
  //     data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
  // }, {
  //     name: 'Project Development',
  //     data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
  // }, {
  //     name: 'Other',
  //     data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
  // }],
  }

  async componentDidMount() {
    try {
      const res = await fetchPrefectures()
      const randPref = Math.floor(Math.random() * Math.floor(res.result.length))
      const { prefCode, prefName } = res.result[randPref]

      // we randomly fetch one of the prefecures data using their prefCode
      const popData = await fetchPrefecturePopulation(prefCode)
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

//   Highcharts.chart('container', {
//     plotOptions: {
        // series: {
        //     showCheckbox: true
        // }
//     },

//     series: [{
//         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
//         selected: true
//     }, {
//         data: [144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2]
//     }]
// });

  render() {
    const { chartOptions } = this.state
    console.log(this.state)
    return(
      <div className="App">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    )
  }
}

export default App;
