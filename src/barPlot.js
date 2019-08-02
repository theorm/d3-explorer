import { reverse, clone, isArray, isFinite, round } from 'lodash-es'
import { scaleLinear, scalePoint, range } from 'd3'
import { default as Plot } from './plot'

const getDisplayValue = d => isArray(d) ? d[0] : d
const getReferenceValue = d => isArray(d) ? d[1] : undefined

/**
 * Data Format:
 * 
 * Every bin is a 1 or 2 elements list where every element represents a bar.
 * Value of a row can be either the display value between [0, 1]
 * or a tuple of values: display value and reference value. The reference
 * value is optional. It is the actual value that has been used to 
 * create the display value.
 * 
 * A. Two bars with display values:
 *  `[0.3, 0.7]`
 * B. Two bars with display and actual values:
 *  `[[0.3, 30], [0.75, 75]]`
 */
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
      bars: ['#99999955', '#999999'],
      font: '#550',
      bubble: '#ddddddaa'
    }
    this.fontSize = options.fontSize || 10
  }

  renderLabels(group, id, units, labels, explorer) {
    const height = explorer.getUnitSize() * units
    const { labels: { offset: labelsOffset, margin: labelsMargin } } = explorer.parameters

    const yScale = scalePoint()
      .domain(range(labels.length))
      .rangeRound([this.margin.top, height - this.margin.bottom])
      .padding(.5)
      
    const g = group.selectAll('g.label')
      .data(d => reverse(clone(d.data)))
      .join('g')
      .attr('class', 'label')
      .attr('transform', (d, i) => `translate(${labelsOffset - labelsMargin - 5}, ${yScale(i)})`)
      .attr('dy', '0.35em')

    g.selectAll('text')
      .data(d => [d])
      .join('text')
      .attr('text-anchor', 'end')
      .text(d => d)

    const hintSize = 10
    g.selectAll('rect')
      .data((d, idx) => [idx])
      .join('rect')
      .attr('x', 4)
      .attr('y', -hintSize)
      .attr('width', hintSize)
      .attr('height', hintSize)
      .attr('fill', d => this.colours.bars[d])
  }

  renderStep(group, id, units, data, stepIndex, explorer, binOffset) {
    const height = explorer.getUnitSize() * units
    const binWidth = explorer.getBinWidth()
    const barWidth = binWidth * 0.9
    const xOffset = (binWidth - barWidth) / 2
    const usableHeight = height - this.margin.bottom - this.margin.top

    const yScale = scaleLinear()
      .domain([0, 1])
      .range([usableHeight, 0])

    group
      .on('mouseover', (d) => {
        const overlay = explorer.getOverlayForPlot(id)
        const { data } = d
        overlay
          .selectAll('g.hotspot')
          .attr('opacity', 1)
          .attr('transform', `translate(${binOffset}, ${-this.fontSize * 1.5})`)
          .selectAll('text')
          .data(data)
          .join('text')
          .attr('text-anchor', 'middle')
          .attr('dy', (d, idx) => this.fontSize * (idx + 1) + this.fontSize / 2)
          .attr('dx', binWidth / 2)
          .style('font-size', `${this.fontSize}px`)
          .style('font-weight', 'bold')
          .text(d => {
            const ref = getReferenceValue(d)
            const disp = getDisplayValue(d)
            return round(isFinite(ref) ? ref : disp, 2)
          })
          .attr('fill', this.colours.text)
          .style('cursor', 'default')
      })
      .on('mouseout', () => {
        const overlay = explorer.getOverlayForPlot(id)
        overlay.selectAll('g.hotspot').attr('opacity', 0)
      })

    group
      .selectAll('rect')
      .data(d => reverse(clone(d.data || [])))
      .join('rect')
      .attr('x', xOffset)
      .attr('y', d => this.margin.top + yScale(getDisplayValue(d) || 0))
      .attr('width', barWidth)
      .attr('height', d => usableHeight - yScale(getDisplayValue(d) || 0))
      .attr('fill', (d, i) => this.colours.bars[i])

  }

  renderOverlay(group, id, units, explorer) {
    const binWidth = explorer.getBinWidth()
    const height = explorer.getUnitSize() * units

    if (!isFinite(binWidth)) return

    const hotspot = group
      .selectAll('g.hotspot')
      .data([null])
      .join('g')
      .attr('class', 'hotspot')
      .attr('transform', `translate(${binWidth / 2 + 1}, ${height})`)
      .attr('opacity', 0)

    const rectSize = this.fontSize * 3

    hotspot
      .selectAll('rect')
      .data(d => [d])
      .join('rect')
      .attr('fill', this.colours.bubble)
      .attr('width', rectSize)
      .attr('height', rectSize)
      .attr('x',  - rectSize / 2 + binWidth / 2)
      .attr('rx', rectSize / 2.4)
  }

}