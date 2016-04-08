import AxisForm from '../../components/Form/AxisForm.js'
import { mount, shallow } from 'enzyme'
import should from 'should'

describe('<AxisForm/>', () => {
  it('should be ok', () => {
    const wrapper = mount(<AxisForm></AxisForm>)
    wrapper.should.be.ok()
  })
})
