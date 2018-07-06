import deepFreeze from 'deep-freeze'
import renderer from 'react-test-renderer'
import {shallow} from 'enzyme'
import {renderDefaultButton}  from '../../src/components/'

describe("Test shared component functions",() => {

    it("Test renderDefaultButton", () => {
        const params = {
            width: "100px",
            disabled: true,
            text: "bonjour", 
            backgroundColor: "red",
            className: "test1", 
            onClickFunc: ""
        }
        deepFreeze(params)
        const wrapper = shallow(renderDefaultButton(params))
        const div = wrapper.find('.test1 > .react-google-oauth-button-border > .react-google-oauth-button-iconWrapper > .react-google-oauth-button-icon')
        expect(div.length).toEqual(1)
        const div2 = wrapper.find('.test1')
        expect(div2.prop('onClick')).toBeNull()
        const span = wrapper.find(".test1 > .react-google-oauth-button-border > .react-google-oauth-button-span")
        expect(span.text()).toEqual("bonjour")
        


        //console.log(div)
        //expect(div.hasClass('test1')).toEqual(true)
    })
})