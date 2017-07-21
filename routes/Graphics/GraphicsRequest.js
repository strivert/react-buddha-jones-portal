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
import IconArrowLeftYellow from './../../components/Icons/IconArrowLeftYellow';
import Select from './../../components/Form/Select';
import ProjectPicker from './../../components/Buddha/ProjectPicker';
import IconSendSubmit from './../../components/Icons/IconSendSubmit';
import Toggle from './../../components/Form/Toggle';

const ESTIMATE_PER_PAGE = 10;

class PageGraphicsRequest extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            requestId: null,
            requestStatus: undefined,
            requestTypeOptions: [],
            requestTypeOptionsLoading: false,
            requestTypeSelected: 1,
            selectedProject: {
                projectId: null,
                campaignId: null,
                spotId: null,
                versionId: null
            },
            defaultProject: undefined,
            associatedPeople:[
            ],
            isFinal: false,
            isEstimateUploading: false,
            isRequestLoading: false
        };

        this.handleSelectProject = this.handleSelectProject.bind(this);
    }

    componentDidMount() {
        /*
        this.setState({
            requestTypeOptionsLoading: true
        }, () => {
            // API.get(API.ESTIMATE_TYPE+ '?active=1', {})
            API.get(API.ESTIMATE_TYPE, {})
            .then(response => {
                //console.log(response);
                this.setState({
                    requestTypeOptionsLoading: false,
                    requestTypeOptions: response.map((item, index)=>{
                        return {
                            value: item.id,
                            label: item.name
                        };
                    })
                });
            }).catch(error => {
                this.setState({
                    requestTypeOptionsLoading: false
                });
            });
        });
        */
        this.setState({
            requestTypeOptionsLoading: true,
            requestTypeOptions: [
                {
                    value: 1,
                    label: 'Design work'
                },
                {
                    value: 2,
                    label: 'Finishing'
                }
            ]
        });

        setTimeout(()=>{
            this.setState({
                requestTypeOptionsLoading: false
            });
        }, 1000);


        let headerElements = [];

        headerElements.push(
            <Button
                onClick={e => this.handleGoingBack(e)}
                label={{
                    text: 'Back to all requests',
                    color: 'white',
                    size: 'large',
                    onLeft: false
                }}
                icon={{
                    background: 'none-alt',
                    size: 'small',
                    element:
                        <IconArrowLeftYellow
                            width={15}
                            height={11}
                            marginTop={-5}
                            marginLeft={-7}
                        />
                }}
            />
        );

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Graphics request',
                elements: headerElements
            }
        });


        this.fetchEstimate();
    }

    fetchEstimate(requestId) {
        this.setState({
            isRequestLoading: true
        });

        this.setState(
            Object.assign({}, this.state, {                
                isRequestLoading: false,
                isFinal: false
            })
        );
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

    handleRequestTypeChange() {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                requestTypeSelected: e.target.value
            });
        }
    }

    handleSelectProject(selected) {
        if (typeof selected !== 'undefined') {            
            this.setState({
                selectedProject: {
                    projectId: selected.project.selectedId,
                    campaignId: selected.campaign.selectedId,
                    spotId: selected.spot.selectedId,
                    versionId: selected.version.selectedId
                }
            }, ()=>{
                if( selected.campaign.selectedId !== null && this.state.associatedPeople.length === 0 ) {

                    this.setState({
                        associatedPeople:[
                            {
                                role: 'Producer',
                                name: 'Producer1'
                            },
                            {
                                role: 'Art Director',
                                name: 'Art Director1'
                            },
                            {
                                role: 'Editor',
                                name: 'Editor1'
                            }
                        ]
                    });

                }
            });
        }
    }

    handleRequestSubmission() {

        this.setState({
            isEstimateUploading: true
        });

        setTimeout(()=>{
            this.setState({
                requestId: 10,
                isEstimateUploading: false
            });
        }, 1000)

    }

    render() {
        const isNotDraftEstimate =
            this.props.requestId &&
            typeof this.state.requestStatus !== 'undefined' && this.state.requestStatus !== 'Draft'
                ? true
                : false;

        return (
            <Layout>
                <Section title="Graphics Request type" noSeparator={true}>
                    <Row alignContent="center" alignItems="center">
                        <Col size={9}>
                            <Select
                                value={this.state.requestTypeSelected}
                                onChange={this.handleRequestTypeChange.bind(this)}
                                options={
                                    this.state.requestTypeOptionsLoading || this.state.requestTypeOptions.length <= 0
                                        ? [{ value: 1, label: 'Loading...' }]
                                        : this.state.requestTypeOptions
                                }
                            />
                        </Col>
                        <Col size={3}>
                        </Col>
                    </Row>
                    <br />
                    <br />
                </Section>

                {(() => {
                    // Mount ProjectPicker if new, if not, then if defaultProject is given from api
                    if (!this.props.requestId || this.props.requestId && this.state.defaultProject) {
                        return (
                            <ProjectPicker
                                ref="projectPicker"
                                noSeparator={true}
                                showVersion={true}
                                levelRequired={2}
                                title="Select project"
                                defaultToOpenProjects={true}
                                defaultValue={this.state.defaultProject}
                                onChange={this.handleSelectProject}
                                readOnly={isNotDraftEstimate}
                            />
                        );
                    }
                })()}

                {
                    this.state.associatedPeople.length > 0 &&
                    <Section
                        title="Associated People"
                    >
                        {(() => {
                            // Set workers table header
                            let workersTableHeader = [
                                { title: 'Role', align: 'left' },
                                { title: 'Name', align: 'left' }
                            ];
                             // Set workers table columns widths
                            let workersTableColumnsWidth = [
                                '50%',
                                '50%'
                            ];

                            // Render workers table
                            return (
                                <Table
                                    ref="workersTable"
                                    header={workersTableHeader}
                                    columnsWidths={workersTableColumnsWidth}
                                >
                                    {(() => {
                                        let associatedPeople;
                                        associatedPeople = this.state.associatedPeople;

                                        let peopleRows;
                                        peopleRows = associatedPeople.map((item, index) => {
                                            // Render
                                            return (
                                                <TableRow key={`sample list ${index}`}>

                                                    <TableCell>
                                                        <Paragraph>{item.role}</Paragraph>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Paragraph>{item.name}</Paragraph>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        });
                                        return peopleRows;
                                    })()}
                                </Table>
                            );
                        })()}

                    </Section>
                }

                 <Section title="Summary" noSeparator={true}>
                    <Row removeGutter={true}>
                        <Col size={6}>
                            <Toggle
                                onChange={e => {}}
                                defaultRight={isNotDraftEstimate}
                                disabled={isNotDraftEstimate}
                                align="left"
                                left={{
                                    label: 'Draft',
                                    value: 'draft'
                                }}
                                right={{
                                    label: 'Final',
                                    value: 'final'
                                }}
                            />
                        </Col>
                        
                            <Col size={6}>
                                <Button
                                    onClick={e => this.handleRequestSubmission(e)}
                                    icon={{
                                        size: 'large',
                                        background: 'orange',
                                        element:
                                            <IconSendSubmit
                                                width={25}
                                                height={26}
                                                marginLeft={-13}
                                                marginTop={-13}
                                            />
                                    }}
                                    label={{
                                        text: this.state.isEstimateUploading
                                            ? 'Saving...'
                                            : this.state.isFinal ? 'Submit estimate for review' : 'Save estimate\'s draft',
                                        size: 'small',
                                        color: 'orange',
                                        onLeft: true
                                    }}
                                    disabled={this.state.isEstimateUploading}
                                />
                            </Col>
                        
                    </Row>
                </Section>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageGraphicsRequest);
