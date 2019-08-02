import { reverse, clone } from 'lodash-es'
import { scaleLinear } from 'd3'
import { default as Plot } from './plot'

export default class BarPlot extends Plot {
  constructor(options = {}) {
    super(options)
    this.margin = options.margin || {
      top: 10,
      bottom: 1,
      left: 2,
      right: 2,
    }
    this.handlers = options.handlers || {}

    this.colours = options.colours || {
      bars: ['#99999955', '#999999']
    }
  }

  renderStep(group, id, units, data, stepIndex, explorer) {
    const height = explorer.getUnitSize() * units
    const binWidth = explorer.getBinWidth()
    const barWidth = binWidth * 0.9
    const xOffset = (binWidth - barWidth) / 2
    const usableHeight = height - this.margin.bottom - this.margin.top

    const yScale = scaleLinear()
      .domain([0, 1])
      .range([usableHeight, 0])

    group
      .selectAll('rect')
      .data(d => reverse(clone(d.data || [])))
      .join('rect')
      .attr('x', xOffset)
      .attr('y', d => this.margin.top + yScale(d || 0))
      .attr('width', barWidth)
      .attr('height', d => usableHeight - yScale(d || 0))
      .attr('fill', (d, i) => this.colours.bars[i])
  }
}