/**
 * Created by Thomas on 1/07/2017.
 */
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import StudentListTest from './StudentListTest'

const setVisibilityFilter = filter => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter))
        }
    }
}


const FilterStudents = connect(
    mapStateToProps,
    mapDispatchToProps
)(StudentListTest)

export default FilterStudents