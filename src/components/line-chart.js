import * as d3 from 'd3'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      chartData: [],
      fileName: 'sample.txt',
      search: 'Lorem',
      maxY: 0,
      lineGen: null,
      x: null,
      y: null,
      xAxisG: null,
      yAxisG: null,
      line: null
    }
  },
  mounted () {
    // this.createLineChart()
  },
  methods: {
    createLineChart (data) {
      // Set the dimensions of the canvas / graph
      var margin = {top: 30, right: 20, bottom: 30, left: 50}
      var width = 600 - margin.left - margin.right
      var height = 270 - margin.top - margin.bottom

        // Set the ranges
      this.x = d3.scaleLinear().range([0, width])
      this.y = d3.scaleLinear().range([height, 0])
      var self = this
      // Define the line
      this.lineGen = d3.line()
        .x(function (d) {
          console.log(d)
          return self.x(d.char)
        })
        .y(function (d) {
          return self.y(d.occ)
        })

          // Adds the svg canvas
      let svg = d3.select(this.$refs.visualisation)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Add the X Axis
      this.xAxisG = svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
      // Add the Y Axis
      this.yAxisG = svg.append('g')
          .attr('class', 'y axis')

      this.line = svg.append('path')
    },
    updateLineChart () {
       // Scale the range of the data
      this.x.domain([ this.chartData[0].char, this.chartData[this.chartData.length - 1].char ])
      this.y.domain([0, this.maxY])
        // transistion axis
      this.xAxisG
      .transition()
      .duration(0)
        .call(d3.axisBottom(this.x))

      this.yAxisG
      .transition()
      .duration(0)
        .call(d3.axisLeft(this.y))

      // change the line
      this.line
        .attr('d', this.lineGen(this.chartData))
    },
    searchString () {
      d3.select(this.$refs.visualisation).selectAll('path').remove()
      d3.select(this.$refs.visualisation).selectAll('g').remove()
      this.chartData = []
      var self = this
      self.createLineChart()

      if (global.socket) {
        global.socket.on('searchResult', function (data) {
          self.chartData.push({
            char: Object.keys(data)[0],
            occ: data[Object.keys(data)[0]]
          })
          if (self.maxY === 0) {
            self.minY = data[Object.keys(data)[0]]
          }
          if (self.maxY < data[Object.keys(data)[0]]) {
            self.maxY = data[Object.keys(data)[0]]
          }
          self.updateLineChart()
        })
        global.socket.on('errorReading', function (data) {
          alert('Error', data)
        })
        global.socket.emit('readFile', { filename: this.fileName, searchString: this.search })
      }
    }
  }
}
