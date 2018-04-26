import * as React from 'react';
import * as _ from 'lodash';
import { IConfig } from '../../configs/config';

import {
    RadioButton,
    RadioButtonGroup,
    TextField,
    SelectField,
    MenuItem,
    AutoComplete,
    Chip
} from 'material-ui';

import * as layoutConfigurationActions from './layoutConfigurationActions';
import ActionButtons from '../editableConfigActionButtons';
import style from './layoutConfigurationStyle';

interface IEditConfigProps {
    config: IConfig;
    onSave: (any) => void;
}

interface ILayoutConfigState {
    layoutType: string;
    delimiter: string;
    otherDelimiter: string;
    headerRowCount: number;
    trailerRowCount: number;
    errors: any;
    filterRows: any[];
}
export default class LayoutConfiguration extends React.Component<IEditConfigProps, ILayoutConfigState> {
    private delimiterOptions: { title: string, value: string }[];
    constructor(props, context) {
        super(props, context);

        this.getDefaultState = this.getDefaultState.bind(this);
        this.setDelimiter = this.setDelimiter.bind(this);
        this.setLayoutType = this.setLayoutType.bind(this);
        this.setHeaderRow = this.setHeaderRow.bind(this);
        this.setTrailerRow = this.setTrailerRow.bind(this);
        this.onSave = this.onSave.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.shouldShowOtherDelimiter = this.shouldShowOtherDelimiter.bind(this);
        this.setOtherDelimiter = this.setOtherDelimiter.bind(this);
        this.directMappingPresent = this.directMappingPresent.bind(this);

        this.delimiterOptions = [{
            title: 'Pipe',
            value: '|'
        }, {
            title: 'Tab',
            value: '\t'
        }, {
            title: 'Comma',
            value: ','
        }, {
            title: 'Semicolon',
            value: ';'
        }, {
            title: 'Other',
            value: 'other'
        }];
        this.state = this.getDefaultState(this.props.config || {});
    }
    public componentWillReceiveProps(nextProps) {
        if (nextProps.config.layoutConfiguration && !this.props.config.layoutConfiguration) {
            this.setState(this.getDefaultState(nextProps.config));
        }
    }
    private getDefaultState(config: IConfig) {
        if (!config.content) {
            return {
                layoutType: '',
                delimiter: '',
                otherDelimiter: '',
                headerRowCount: 0,
                trailerRowCount: 0,
                filterRows: [],
                errors: {},
            };
        } else {
            const layoutConfiguration: any = config.layoutConfiguration;
            const layoutType = config.layoutType || '';
            const delimiter = config.delimiter ? (_.includes(['|', ',', '\t', ';'], config.delimiter) ? config.delimiter : 'other') : '';
            const otherDelimiter = delimiter === 'other' ? config.delimiter : '';
            const headerRowCount = layoutConfiguration.ignore_lines ? layoutConfiguration.ignore_lines.params.header_row_count : 0;
            const trailerRowCount = layoutConfiguration.ignore_lines ? layoutConfiguration.ignore_lines.params.trailer_row_count : 0;

            return {
                layoutType,
                delimiter,
                otherDelimiter,
                showCustomDelimiter: false,
                headerRowCount,
                trailerRowCount,
                filterRows: [],
                errors: {}
            };
        }
    }
    private setDelimiter(event, delimiter) {
        this.setState({ delimiter });
    }
    private setLayoutType(event, layoutType) {
        this.setState({ layoutType });
    }
    private setHeaderRow(event, index, headerRowCount) {
        this.setState({ headerRowCount });
    }
    private setTrailerRow(event, index, trailerRowCount) {
        this.setState({ trailerRowCount });
    }
    private validateFields() {
        let { errors } = this.state;
        const mandatoryFields = ['layoutType', 'headerRowCount', 'trailerRowCount'];
        const numericFields = ['headerRowCount', 'trailerRowCount'];
        // reset errors
        errors = {};
        _.forEach(mandatoryFields, field => {
            if (_.includes(numericFields, field)) {
                if (this.state[field] === undefined) {
                    errors[field] = 'required';
                }
            } else if (!this.state[field]) {
                errors[field] = 'required';
            }
        });

        if (this.state.layoutType === 'delimited' && !this.state.delimiter) {
            errors.delimiter = 'required';
        }

        if (this.shouldShowOtherDelimiter() && !this.state.otherDelimiter) {
            errors.otherDelimiter = 'required';
        }

        return errors;
    }
    private constructLayoutConfig() {
        const layoutConfiguration = this.props.config.layoutConfiguration;
        if (layoutConfiguration.ignore_lines) {
            layoutConfiguration.ignore_lines.params.header_row_count = this.state.headerRowCount;
            layoutConfiguration.ignore_lines.params.trailer_row_count = this.state.trailerRowCount;
        } else {
            layoutConfiguration.ignore_lines = {
                params: {
                    header_row_count: this.state.headerRowCount,
                    trailer_row_count: this.state.trailerRowCount
                }
            };
        }

        return layoutConfiguration;
    }
    private shouldShowOtherDelimiter() {
        return (this.state.delimiter === 'other' && this.state.layoutType === 'delimited');
    }
    private setOtherDelimiter(event, otherDelimiter) {
        this.setState({ otherDelimiter });
    }
    public onSave(event) {
        const errors = this.validateFields();
        this.setState({ errors });
        if (_.values(errors).length > 0) {
            return false;
        }

        const delimiter = this.state.delimiter === 'other' ? this.state.otherDelimiter : this.state.delimiter;
        layoutConfigurationActions.setLayoutConfiguration(
            this.props.config,
            this.state.layoutType,
            delimiter,
            this.constructLayoutConfig()
        );
        this.props.onSave(this.props.config);
    }
    private directMappingPresent(): boolean {
        return this.props.config.directMapping.length > 0;
    }
    public render() {
        return (<div style={style.container}>
            <form className={'col-md-12'}>
                <div style={style.formContent}>
                    <div>
                        <label style={style.radioLabel}>Layout Type</label>
                        {this.state.errors.layoutType && <div style={style.error}>{this.state.errors.layoutType}</div>}
                        <RadioButtonGroup name="layoutType" valueSelected={this.state.layoutType} onChange={this.setLayoutType} >
                            <RadioButton
                                value="fixedWidth"
                                label="Fixed Width"
                                disabled={this.directMappingPresent()}
                                style={style.radioButton}
                            />
                            <RadioButton
                                value="delimited"
                                label="Delimited"
                                disabled={this.directMappingPresent()}
                                style={style.radioButton}
                            />
                        </RadioButtonGroup>
                    </div>

                    <div>
                        <label style={style.radioLabel}>Delimiter</label>
                        {this.state.errors.delimiter && <div style={style.error}>{this.state.errors.delimiter}</div>}
                        <RadioButtonGroup name="delimiter" valueSelected={this.state.delimiter} onChange={this.setDelimiter} errorText={this.state.errors.delimiter}>
                            {_.map(this.delimiterOptions, delimiter => {
                                return (
                                    <RadioButton
                                        key={delimiter.value}
                                        value={delimiter.value}
                                        label={delimiter.title}
                                        disabled={this.state.layoutType === 'fixedWidth'}
                                        style={style.radioButton}
                                    />
                                );
                            })}
                        </RadioButtonGroup>
                    </div>
                    {this.shouldShowOtherDelimiter() && <TextField
                        floatingLabelText={'Other Delimiter'}
                        value={this.state.otherDelimiter}
                        onChange={this.setOtherDelimiter}
                        errorText={this.state.errors.otherDelimiter}
                    />}
                    <div>
                        <SelectField
                            floatingLabelText="Header Row"
                            value={this.state.headerRowCount}
                            errorText={this.state.errors.headerRowCount}
                            onChange={this.setHeaderRow}
                        >
                            {_.times(9, count => {
                                return <MenuItem key={count} value={count} primaryText={`${count}`} />;
                            })}
                        </SelectField>
                    </div>
                    <div>
                        <SelectField
                            floatingLabelText="Trailer Row"
                            value={this.state.trailerRowCount}
                            errorText={this.state.errors.trailerRowCount}
                            onChange={this.setTrailerRow}
                        >
                            {_.times(9, count => {
                                return <MenuItem key={count} value={count} primaryText={`${count}`} />;
                            })}
                        </SelectField>
                    </div>
                </div>
                <ActionButtons
                    onSave={this.onSave}
                />
            </form>
        </div>);
    }
}
