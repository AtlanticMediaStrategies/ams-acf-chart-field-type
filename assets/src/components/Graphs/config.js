export const chart_colors = [
  '#DE2183',
  '#4EC2B1',
  '#8B88C8',
  '#FED130',
  '#0E3EC6',
  '#97D429',
];

const gray = '#A5B3BE'
const textPrimary = '#2f353e'

export const axis_styles = {
  axis: {
    stroke: gray,
    strokeWidth: 1
  },
  tickLabels: {
    fontFamily: "allstate-sans, sans-serif",
    fill: gray,
    fontSize: 14
  },
  ticks: {
    stroke: gray,
    strokeWidth: 1
  },
  axisLabel: {
    fill: textPrimary,
    fontFamily: "allstate-sans, sans-serif",
    fontSize: 18
  },
  grid: {
    strokeWidth: 1,
    stroke: gray,
  }
}

export const y_axis_styles =
  Object.assign({},
    axis_styles, {
      axis: {
        strokeWidth: 0
      }
    }
  )

export const date_format = 'MMM \'YY'

export const DESKTOP_WIDTH = 768
