import { get } from 'lodash-es'

export default class Plot {
  constructor(options = {}) {
    this.title = get(options, 'title', '')
  }

  getTitle() { return this.title }

  // eslint-disable-next-line no-unused-vars
  renderLabels(group, id, units, labels, explorer) {}

  // eslint-disable-next-line no-unused-vars
  renderStep(group, id, units, data, stepIndex, explorer) {}

}
