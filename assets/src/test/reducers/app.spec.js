import should from 'should'
import {app} from '../../reducers/app.js'

const initialState = {
  edit: false,
  graphs: {}
}

describe('App reducers', () => {
  it('should be ok', () => {
    app.should.be.ok
  })
});
