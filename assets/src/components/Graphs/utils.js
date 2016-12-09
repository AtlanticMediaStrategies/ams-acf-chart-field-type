import moment from 'moment'

/**
 *  Parses a date that's formatted as '01/09'
 *  @return {Moment Object} the moment object
 */
export function parse_date(date, i) {
  if(i == 0 ) {
    return
  }
  const parsed_date = date.replace('/', '/20');
  const moment_date = new moment(parsed_date, 'M/YYYY')
  return moment_date
}

export const sort_by_index = (x, y) => (x > y) ? 1 : -1;
