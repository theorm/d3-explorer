import { isNil, assignIn, noop, get, includes, isArray, first } from 'lodash-es'
import { select, scaleLinear, range, zip } from 'd3'
import { assert, warn } from './util'
import { default as Plot } from './plot'

const DefaultParameters = {
  labels: {
    offset: 150,
    margin: 5
  },
  margin: {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10
  },
  colours: {
    bin: {
      highlight: '#dddddd22',
      selected: '#ffff0033',
      midline: '#eaeaea'
    },
    separator: {
      line: '#bbb',
      textBackground: '#ffffffbb',
    }
  },
  handlers: {
    
  }
}

const TopLevelClasses = [
  'labels',
  'bins',
  'separators',
  'overlays',
]

export default class Explorer {
  constructor(rootElement, options = {}) {
    assert(!isNil(options), 'Options must be an object')

    this.container = select(rootElement)
    this.svg = this.container.append('svg')

    if (options.class) this.svg.attr('class', options.class)

    const { width, height } = this.container.node().getBoundingClientRect()
    if (width === 0) warn(`Width of the SVG container is ${width}`)
    if (height === 0) warn(`Height of the SVG container is ${height}`)

    this.parameters = assignIn({}, DefaultParameters, options.parameters)

    this.plots = []
    this.data = {}
  }

  _getWH() {
    const { width, height } = this.container.node().getBoundingClientRect()
    return { width, height }
  }

  render() {
    const { width, height } = this._getWH()
    const binsCount = this.getBinsCount()

    this.svg
      .attr('width', width)
      .attr('height', height)

    const data = [
      this.getLabelsGroupsData(), // labels
      range(binsCount), // bins
      this.getPlotsTitlesData(), // separators / titles
      range(this.plots.length), // overlays
    ]

    this.svg.selectAll('g.toplevel')
      .data(data)
      .join('g')
      .attr('class', (d, idx) => `toplevel ${TopLevelClasses[idx]}`)
      .each((data, index, group) => {
        const g = select(group[index])
        if (index === 0) return this._renderLabels(g)
        if (index === 1) return this._renderBins(g)
        if (index === 2) return this._renderSeparators(g)
        if (index === 3) return this._renderOverlay(g)
      })
  }

  getBinWidth() {
    const { width } = this._getWH()
    const binsCount = this.getBinsCount()
    const { margin, labels } = this.parameters

    return (width - margin.left - margin.right - labels.offset) / binsCount
  }

  getBinsCount() {
    return this.plots.reduce((acc, [id]) => {
      const len = get(this.data[id], 'data', []).length
      return len > acc ? len : acc
    }, 0)
  }

  getMaximumOptimalBinsCount() {
    const { width } = this._getWH()
    const { margin, labels } = this.parameters
    const binsPaneWidth = width - labels.offset - margin.left - margin.right
    const minBinWidth = 20

    const val = Math.floor(binsPaneWidth / minBinWidth)
    return val > 0 ? val : 0
  }

  getGroupsData() {
    return this.plots.map(([id]) => get(this.data[id], 'data', []))
  }

  getDataForGroup(groupId) {
    return get(this.data[groupId], 'data', [])
  }

  getLabelsGroupsData() {
    return this.plots.map(([id]) => get(this.data[id], 'labels', []))
  }

  getPlotsTitlesData() {
    return this.plots.map(([,p]) => p.getTitle())
  }

  getUnitSize() {
    const { height } = this._getWH()
    const { margin } = this.parameters
    const actualHeight = height - margin.top - margin.bottom

    const reservedUnits = this.plots.reduce((acc, [,, units]) => acc + units, 0)

    return actualHeight / (reservedUnits || 1)
  }

  _renderLabels(selection) {
    const { margin } = this.parameters

    const g = selection
      .selectAll('g.label-group')
      .data(this._dataWithRenderMeta.bind(this))
      .join('g')
      .attr('class', ({ id }) => `label-group ${id.replace(' ', '-')}`)
      .attr('transform', ({ unitsOffset }) => `translate(0, ${unitsOffset * this.getUnitSize() + margin.top})`)

    const explorer = this
    g.each(function(d) {
      const { id, units, data, plot } = d
      plot.renderLabels(select(this), id, units, data, explorer)
    })
  }

  _renderBins(selection) {
    const { width, height } = this._getWH()
    const params = this.parameters
    const binWidth = this.getBinWidth()
    const { margin, labels } = this.parameters

    const xScale = scaleLinear()
      .domain([0, selection.data()[0].length])
      .rangeRound([0, width - margin.right - margin.left - labels.offset])

    const filterOutSelectedHighlight = function () { return !this.classList.contains('selected') }

    const bin = selection
      .style('pointer-events', 'all')
      .attr('transform', `translate(${this.parameters.labels.offset + margin.left}, 0)`)
      .selectAll('g.step')
      .data(d => d)
      .join('g')
      .attr('class', 'step')
      .attr('transform', (d, i) => `translate(${xScale(i)}, 0)`)
      .on('mouseover', function () {
        select(this).select('.highlight').filter(filterOutSelectedHighlight).style('fill', params.colours.bin.highlight)
      })
      .on('mouseout', function () {
        select(this).select('.highlight').filter(filterOutSelectedHighlight).style('fill', 'none')
      })
      .on('click', (d, index) => {
        this.selectedBin = index
        const { onBinSelected = noop } = params.handlers
        onBinSelected(index)
        this.render()
      })

    bin.selectAll('line.midline')
      .data([null])
      .join('line')
      .attr('class', 'midline')
      .attr('stroke', params.colours.bin.midline)
      .attr('x1', binWidth / 2)
      .attr('x2', binWidth / 2)
      .attr('y1', margin.top)
      .attr('y2', height - margin.top - margin.bottom)

    bin.selectAll('rect.highlight')
      .data((d, stepIndex) => [{ stepIndex }])
      .join('rect')
      .attr('class', d => (d.stepIndex === this.selectedBin ? 'highlight selected' : 'highlight'))
      .style('fill', d => (d.stepIndex === this.selectedBin ? params.colours.bin.selected : 'none'))
      .attr('x', 0)
      .attr('y', margin.top)
      .attr('width', binWidth)
      .attr('height', height - margin.top - margin.bottom)

    const plots = bin
      .selectAll('g.plots')
      .data(d => [d])
      .join('g')
      .attr('class', 'plots')

    const explorer = this

    plots.selectAll('g.plot')
      .data((d, stepIndex) => {
        const data = this.getGroupsData().map(items => get(items, stepIndex))
        return this._dataWithRenderMeta.bind(this)(data).map(v => {
          v.stepIndex = stepIndex
          return v
        })
      })
      .join('g')
      .attr('class', ({ id }) => `plot ${id.replace(' ', '-')}`)
      .attr('transform', ({ unitsOffset }) => `translate(0, ${unitsOffset * this.getUnitSize() + margin.top})`)
      .each(function (d) {
        const { id, plot, units, stepIndex } = d
        plot.renderStep(select(this), id, units, get(explorer.data[id], 'data', []), stepIndex, explorer, xScale(stepIndex))
      })
  }

  _renderSeparators(selection) {
    const { margin, colours } = this.parameters
    const { width } = this._getWH()

    const g = selection
      .selectAll('g.separator')
      .data(this._dataWithRenderMeta.bind(this))
      .join('g')
      .attr('class', ({ id }) => `separator ${id.replace(' ', '-')}`)
      .attr('transform', ({ unitsOffset }) => `translate(0, ${unitsOffset * this.getUnitSize() + margin.top})`)

    g.selectAll('line')
      .data(d => [d])
      .join('line')
      .attr('stroke', colours.separator.line)
      .attr('stroke-dasharray', 4)
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)

    const textOffset = margin.left + (width - margin.left - margin.right) / 2
    const yMargin = 4
    const xMargin = 8

    g.selectAll('rect')
      .data(d => [d])
      .join('rect')
      .attr('fill', colours.separator.textBackground)
      .attr('x', textOffset - xMargin)
      .attr('y', -yMargin * 2)
      .attr('width', 100)
      .attr('height', 20)
      
    g.selectAll('text')
      .data(d => [d])
      .join('text')
      .attr('dy', yMargin)
      .attr('x', textOffset)
      .text(({ data }) => data)

    zip(
      g.selectAll('rect').nodes(),
      g.selectAll('text').nodes(),
    ).forEach(([rect, text]) => {
      const { width } = text.getBoundingClientRect()
      select(rect).attr('width', width + xMargin * 2)
    })
  }

  _renderOverlay(selection) {
    const { margin } = this.parameters

    const g = selection
      .style('pointer-events', 'all')
      .attr('transform', `translate(${this.parameters.labels.offset + margin.left}, 0)`)
      .selectAll('g.overlay')
      .data(this._dataWithRenderMeta.bind(this))
      .join('g')
      .attr('class', ({ id }) => `overlay ${id.replace(' ', '-')}`)
      .attr('transform', ({ unitsOffset }) => `translate(0, ${unitsOffset * this.getUnitSize() + margin.top})`)

    const explorer = this
    g.each(function(d) {
      const { id, units, plot } = d
      plot.renderOverlay(select(this), id, units, explorer)
    })
  }

  _dataWithRenderMeta(d) {
    return d.map((data, idx) => {
      const previousPlots = this.plots.slice(0, idx)
      const unitsOffset = previousPlots.reduce((acc, [,,units]) => acc + units, 0)
  
      const [id, plot, units] = this.plots[idx]
      return { data, id, plot, units, unitsOffset }
    })
  }

  getOverlayForPlot(plotId) {
    const index = this.plots.map(([id]) => id).indexOf(plotId)
    return this.svg.selectAll(`g.overlay:nth-child(${index + 1})`)
  }

  addPlot(plot, options = {}) {
    assert(!isNil(options), 'Options must be an object')
    assert(plot instanceof Plot, `Plot is not a "Plot" instance: ${plot}`)
    const numAddedPlots = this.plots.length 

    const { units = 1, id = `plot-${numAddedPlots}`} = options
    
    assert(this.plots.filter(p => p[0] === id).length === 0, `Plot with ID "${id}" already exists`)

    this.plots.push([
      id,
      plot,
      units
    ])
    this.render()
  }

  getPlotIds() {
    return this.plots.map(([id]) => id)
  }

  setLabels(plotId, labels) {
    assert(includes(this.getPlotIds(), plotId), `Unknown plot ID: "${plotId}"`)
    assert(isArray(labels), `Labels must be an array but is: ${labels}`)

    const plotData = get(this.data, plotId, {})
    plotData.labels = labels
    this.data[plotId] = plotData

    this.render()
  }

  setData(plotId, data) {
    assert(includes(this.getPlotIds(), plotId), `Unknown plot ID: "${plotId}"`)
    assert(isArray(data), `Data must be an array but is: ${data}`)

    const plotData = get(this.data, plotId, {})
    plotData.data = data
    this.data[plotId] = plotData

    this.render()
  }
}
