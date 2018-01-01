import * as d3 from 'd3'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      chartData: [],
      fileName: 'sample.txt',
      search: 'Lorem'
    }
  },
  methods: {
    createLineChart (data) {
      this.chartData = []
      // var test = data[Object.keys(data)[Object.keys(data).length - 1]]
      // console.log(test)
      this.chartData.push({
        char: Object.keys(data)[0],
        occ: data[Object.keys(data)[0]]
      })

      var minY = 0
      var maxY = 0
      // console.log('this.temp', this.temp)
      var myNode = document.getElementById('visualisation')
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild)
      }
      const vis = d3.select(this.$refs.visualisation)
      const WIDTH = 1000
      const HEIGHT = 500
      const MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      }
      const xScale = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([this.chartData[0].occ, this.chartData[this.chartData.length - 1].occ])
      const yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([ Math.min(...Object.values(data)), Math.max(...Object.values(data))])
      // const xScale = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([Object.keys(data)[0], Object.keys(data)[Object.keys(data).length - 1]])
      // const yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([ Math.min(...Object.values(data)), Math.max(...Object.values(data))])
      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)

      vis.append('svg:g').attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')').call(xAxis)
      vis.append('svg:g').attr('transform', 'translate(' + (MARGINS.left) + ',0)').call(yAxis)
      let lineGen = d3.line()
      .x(function (d) {
        return xScale(d.char)
      })
      .y(function (d) {
        return yScale(d.occ)
      })
      vis.append('svg:path').attr('d', lineGen(this.chartData)).attr('stroke', 'green').attr('stroke-width', 2).attr('fill', 'none')
    },
    searchString () {
      var self = this
      if (global.socket) {
        global.socket.on('searchResult', function (data) {
          self.createLineChart(data)
        })
        global.socket.emit('readFile', { filename: this.fileName, searchString: this.search })
      }
    }
  }
}
