export const chart_colors = [
  '#DE2183',
  '#4EC2B1',
  '#8B88C8',
  '#FED130',
  '#0E3EC6',
  '#97D429',
];

const gray = '#A5B3BE'

export const axis_styles = {
  axis: {
    stroke: '#D2D8DD',
    strokeWidth: 1
  },
  tickLabels: {
    fontFamily: "allstate-sans, sans-serif",
    fill: '#A5B3BE',
    fontSize: 14
  },
  ticks: {
    stroke: '#D2D8DD',
    strokeWidth: 1
  },
  axisLabels: {
    stroke: '#A5B3BE',
    fontFamily: "allstate-sans, sans-serif",
    fontSize: 18
  },
  grid: {
    strokeWidth: 1,
    stroke: '#D2D8DD',
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
