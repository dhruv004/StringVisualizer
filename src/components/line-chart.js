import * as d3 from 'd3'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      temp: [{
        'sale': '202',
        'year': '2000'
      }, {
        'sale': '215',
        'year': '2001'
      }, {
        'sale': '179',
        'year': '2002'
      }, {
        'sale': '199',
        'year': '2003'
      }, {
        'sale': '134',
        'year': '2003'
      }, {
        'sale': '176',
        'year': '2010'
      }],
      line: ''
    }
  },
  mounted () {
    console.log(this.$refs.visualisation)
    const vis = d3.select(this.$refs.visualisation)
    const WIDTH = 1000
    const HEIGHT = 500
    const MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    }
    const xScale = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000, 2010])
    const yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([134, 215])
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    vis.append('svg:g').attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')').call(xAxis)
    vis.append('svg:g').attr('transform', 'translate(' + (MARGINS.left) + ',0)').call(yAxis)
    let lineGen = d3.line()
      .x(function (d) {
        console.log(d)
        console.log(xScale(d.year))
        return xScale(d.year)
      })
      .y(function (d) {
        return yScale(d.sale)
      })
    vis.append('svg:path').attr('d', lineGen(this.temp)).attr('stroke', 'green').attr('stroke-width', 2).attr('fill', 'none')
  }
}
