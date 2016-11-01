export const chart_colors = [
  '#DE2183',
  '#4EC2B1',
  '#8B88C8',
  '#FED130',
  '#0E3EC6',
  '#97D429',
];

const gray = '#D2D9DE'
const grayDark = '#A5B3BE'
const textPrimary = '#2f353e'

export const axis_styles = {
  axis: {
    stroke: gray,
    strokeWidth: 1
  },
  tickLabels: {
    fontFamily: "allstate-sans, sans-serif",
    fill: '#505A6A',
    fontSize: 14,
    fontWeight: 100
  },
  ticks: {
    stroke: gray,
    strokeWidth: 1
  },
  axisLabel: {
    fontFamily: "allstate-sans, sans-serif",
    fill: '#505A6A',
    fontSize: 14,
    textTransform: 'uppercase'
  },
  grid: {
    strokeWidth: 1,
    stroke: gray
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
