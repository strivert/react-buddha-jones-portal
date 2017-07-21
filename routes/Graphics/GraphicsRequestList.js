import React from 'react';
import { connect } from 'react-redux';
import { debounce, toNumber } from 'lodash';
import * as API from './../../actions/api';
import * as actions from './../../actions/ActionTypes';
import history from './../../core/history';
import Layout from './../../components/Layout/Layout';
import Section from './../../components/Section/Section';
import Row from './../../components/Section/Row';
import Col from './../../components/Section/Col';
import Table from './../../components/Table/Table';
import TableRow from './../../components/Table/TableRow';
import TableCell from './../../components/Table/TableCell';
import Pagination from './../../components/Pagination/Pagination';
import Paragraph from './../../components/Content/Paragraph';
import Money from './../../components/Content/Money';
import Number from './../../components/Content/Number';
import Date from './../../components/Content/Date';
import Button from './../../components/Button/Button';
import Input from './../../components/Form/Input';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';
import ClientsFilter from './../../components/Buddha/ClientsFilter';
import IconArrowRight from './../../components/Icons/IconArrowRight';
import IconSearchLoupe from './../../components/Icons/IconSearchLoupe';
import IconPlusWhite from './../../components/Icons/IconPlusWhite';
import LoadingShade from './../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../components/Loaders/LoadingSpinner';

const ESTIMATE_PER_PAGE = 10;

class PageGraphicsRequestList extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'All graphics requests',
                elements: [
                    <Button
                        onClick={e => this.handleCreateNewEstimateClick(e)}
                        label={{
                            text: 'Create new graphics request',
                            color: 'white',
                            size: 'large',
                            onLeft: true
                        }}
                        icon={{
                            background: 'yellow',
                            size: 'small',
                            element:
                                <IconPlusWhite
                                    width={12}
                                    height={12}
                                    marginTop={-6}
                                    marginLeft={-6}
                                />
                        }}
                    />
                ]
            }
        });
    }

    componentWillUmount() {
        // Remove header
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    handleCreateNewEstimateClick(e) {
        history.push('/graphic/graphics-request');
    }

    render() {
        return (
            <Layout>
                <div>
                    Hi, List page
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageGraphicsRequestList);
