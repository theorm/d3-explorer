import { reverse, clone, isArray, isFinite, round } from 'lodash-es'
import { scaleLinear, scalePoint, range, max, min } from 'd3'
import { default as Plot } from './plot'

const getDisplayValue = d => d // isArray(d) ? d[0] : d
const getReferenceValue = d => d // isArray(d) ? d[1] : undefined

const getDataDomain = (data, maxValue) => {
  if (data.length === 0) return [0, 1]

  const calculatedMaxValue = max(data.map(d => isArray(d) ? max(d) : d))
  const minValue = min(data.map(d => isArray(d) ? min(d) : d))

  return [
    minValue < 0 ? minValue : 0,
    isFinite(maxValue) ? maxValue : calculatedMaxValue
  ]
}

/**
 * Data Format:
 * 
 * Every bin is a 1 or 2 elements list where every element represents a bar.
 * 
 * A. Two bars:
 *  `[0.3, 0.7]`
 * B. One bar:
 *  `[0.3]`
 * C. One bar:
 *  `0.3`
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
      bubble: '#bbbbbbcc',
      bubbleStroke: '#bbbbbbff'
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

  renderStep(group, id, units, data, stepIndex, explorer, binOffset, maxValue) {
    const height = explorer.getUnitSize() * units
    const binWidth = explorer.getBinWidth()
    const barWidth = binWidth * 0.9
    const xOffset = (binWidth - barWidth) / 2
    const usableHeight = height - this.margin.bottom - this.margin.top

    data = data.map(d => isArray(d) ? d : [d])

    const yScale = scaleLinear()
      .domain(getDataDomain(data, maxValue))
      .range([usableHeight, 0])

    group
      .on('mouseover', (d) => {
        const overlay = explorer.getOverlayForPlot(id)
        const { data } = d
        overlay
          .selectAll('g.hotspot')
          .attr('opacity', 1)
          // .attr('transform', `translate(${binOffset}, ${-this.fontSize * 2.5})`)
          .attr('transform', `translate(${binOffset}, ${usableHeight-this.fontSize*3.5})`)
          .selectAll('text')
          .data(reverse(clone(data)))
          .join('text')
          .attr('transform', `translate(${ - binWidth}, 0)`)
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
      .selectAll('line')
      .data(d => [d])
      .join('line')
      .attr('transform', `translate(${-binWidth / 2 + 1}, ${rectSize/2})`)
      .attr('x1', rectSize/2)
      .attr('y1', 0)
      .attr('x2', binWidth)
      .attr('y2', 0)
      .attr('stroke', this.colours.bubbleStroke)

    hotspot
      .selectAll('rect')
      .attr('transform', `translate(${ - binWidth}, 0)`)
      .data(d => [d])
      .join('rect')
      .attr('fill', this.colours.bubble)
      .attr('stroke', this.colours.bubbleStroke)
      .attr('width', rectSize)
      .attr('height', rectSize)
      .attr('x',  - rectSize / 2 + binWidth / 2)
  }

}