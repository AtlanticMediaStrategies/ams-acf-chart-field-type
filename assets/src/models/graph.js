export const initialGraph = {
  /**
   *  Active rows {Array<Boolean>}
   *
   *  Mapping of rows
   */
  active_rows: [],
  /*
   *  Active columns {Array<Boolean>}
   *
   *  Mapping of which columns to pull in
   */
  active_columns: [],
  /**
   *  Mapping of rows to graph color
   */
  colors: [],
  /**
   *  Label for the x axis
   */
  x_axis: "",
  /**
   * Label for the y axis
   */
  y_axis: "",
  /**
   *  Type for the graph (valid: line, pie, bar)
   */
  type: "pie",
}
