import {
  scalePoint, range, select,
  deviation as getDeviation, mean as getMean
} from 'd3'
import { noop, isNaN, min } from 'lodash-es'
import { default as Plot } from './plot'

export default class HeatBubblePlot extends Plot {
  constructor(options = {}) {
    super(options)
    this.margin = options.margin || {
      top: 10,
      bottom: 10
    }
    this.handlers = options.handlers || {}

    this.colours = options.colours || {
      overlay: {
        selected: '#3333330f'
      },
      value: {
        outlierAbove: '#00ff33',
        outlierBelow: '#ff0000',
        mean: '#eeeeee'
      }
    }
  }

  renderLabels(group, id, units, labels, explorer) {
    const height = explorer.getUnitSize() * units
    const { labels: { offset: labelsOffset, margin: labelsMargin } } = explorer.parameters

    const yScale = scalePoint()
      .domain(range(labels.length))
      .rangeRound([this.margin.top, height - this.margin.bottom])
      .padding(.5)

    group.selectAll('text')
      .data(d => d.data)
      .join('text')
      .attr('transform', (d, i) => `translate(0, ${yScale(i)})`)
      .attr('dy', '0.35em')
      .attr('x', labelsOffset - labelsMargin)
      .attr('text-anchor', 'end')
      .style('cursor', 'pointer')
      .text(d => d)
      .on('click', function(data, index) {
        const { onLabelClicked = noop } = explorer.parameters.handlers
        onLabelClicked(id, index)
      })
      .on('mouseover', function () {
        select(this).attr('font-weight', 'bold')
      })
      .on('mouseout', function () {
        select(this).attr('font-weight', undefined)
      })
  }

  renderStep(group, id, units, data, stepIndex, explorer) {
    const height = explorer.getUnitSize() * units
    const usableHeight = height - this.margin.top - this.margin.bottom
    const itemsCount = (data[stepIndex] || []).length
    const itemHeight = usableHeight / itemsCount
    const binWidth = explorer.getBinWidth()
    const maxCircleDiameter = min([itemHeight, binWidth])
    const maxCircleRadius = (maxCircleDiameter / 2) * 0.95

    const yScale = scalePoint()
      .domain(range(itemsCount))
      .rangeRound([this.margin.top, height - this.margin.bottom])
      .padding(.5)

    // value circle
    group
      .selectAll('g.values')
      .data(d => [d.data || []])
      .join('g')
      .attr('class', 'values')
      .attr('transform', `translate(${binWidth/2}, 0)`)
      .selectAll('circle')
      .data(d => {
        const std = getDeviation(d)
        const mean = getMean(d)
        return d.map(val => ({ val, mean, std }))
      })
      .join('circle')
      .attr('cx', 0)
      .attr('cy', (d, i) => yScale(i))
      .attr('fill', d => this._getColour(d))
      .attr('r', d => (parseFloat(d.val) > 0 ? d.val * maxCircleRadius : 0))

    const colours = this.colours
    // overlay mouse event catching circle
    group
      .selectAll('g.hotspots')
      .data(d => [d.data || []])
      .join('g')
      .attr('class', 'hotspots')
      .attr('transform', `translate(${binWidth/2}, 0)`)
      .selectAll('circle')
      .data((d, stepIndex) => d.map(value => ({ value, stepIndex })))
      .join('circle')
      .attr('cy', (d, i) => yScale(i))
      .attr('fill', 'none')
      .attr('r', maxCircleRadius)
      .on('mouseover', function() {
        select(this).style('fill', colours.overlay.selected)
      })
      .on('mouseout', function() {
        select(this).style('fill', 'none')
      })
      .on('click', (data, index) => {
        const { onValueClicked = noop } = this.handlers
        onValueClicked(id, index, stepIndex)
      })

  }

  _getColour(d) {
    if (isNaN(d.val)) return 'none'
    const {
      outlierAbove: colourAbove,
      outlierBelow: colourBelow,
      mean: colourNeutral
    } = this.colours.value
    const colour = (() => {
      if (d.val > d.mean + d.std) return colourAbove
      if (d.val < d.mean - d.std) return colourBelow
      return colourNeutral
    })()
    let sval = Math.abs(d.val - d.mean) * 2
    if (sval > 1) sval = 1.0
    if (sval < 0) sval = 0.0
    const opacity = (55 + Math.round(sval * 200)).toString(16)
    return colour + (opacity.length === 1 ? `0${opacity}` : opacity)
  }
}