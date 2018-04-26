import * as _ from 'lodash';
import alteredTargetColumns,
{
    specialColumnTypes,
    dateColumnTypes,
    decimalColumnTypes,
    numberColumnTypes
} from '../targetColumnTypes/alteredColumns';
import helper from '../helper';

interface ISourceLayout {
    content?: any[];
    sha?: string;
    name?: string;
}

interface IContent {
    filters?: IFilter[];
}

export interface IConfig {
    path?: string;
    name?: string;
    sha?: string;
    content?: IContent;
    type?: string;
    size?: number;
    url?: string;
    git_url?: string;
    html_url?: string;
    download_url?: string;
    toJSON?: () => any;
    buildContent?: () => void;
    dataPartner?: string;
    feedType?: string;
    subType?: string;
    layoutType?: string;
    delimiter?: string;
    layoutConfiguration?: any;
    sourceLayout?: ISourceLayout;
    targetColumns?: any;
    uniqTargetColumns?: any[];
    uniqDateColumns?: any[];
    uniqStringColumns?: any[];
    directMapping?: any[];
    targetTables?: string[];
    allTargetTables?: string[];
    sqlExpressions?: ISQLExpression[];
    pivotConfigs?: IPivotConfig[];
    businessRules?: any;
    updateFeedInfo?: (dataPartner: string, feedType: string, subType: string) => void;
    getUnMappedTargetColumns?: (filterName: string) => any[];
    getTableColumns?: (tableName: string) => any[];
    steps?: IStep[];
    getFilter?: (filter, index) => any[];
    setFilter?: (filter, index, params) => void;
    addFilter?: (filterName) => void;
    removeFilter?: (filterName, index) => void;
    getUnmappedColumns?: (filterName: string, index: number) => any[];
    getMappedValues?: (filterName: string, index: number) => string[];
    mappedTargetColumns?: any[];
    getMappedTargets?: () => string[];
    publishUrl?: string;
    readyToDeploy?: boolean;
    processLogs?: any;
}

interface IPivotConfig {
    table_name?: string;
    field_mapping: any[];
}

interface IFilter {
    filter_name: string;
    params: any;
}

interface ISQLExpression {
    expr: string;
    targetfieldname: string;
}

interface ISplitByPositionParams {
    name: string;
    start: number;
    end: number;
    default?: string;
}

interface IStep {
    title: string;
    type: string;
    id: string;
    index?: number;
    disabled?: boolean;
    removable?: boolean;
}

interface IConcatenationFilter {
    method: "get_concatenated_field";
    params:
    {
        fields: string[];
        delimiter?: string;
        target_field: string;
    };
}

interface IDateTransform {
    method: "get_validated_date";
    params:
    {
        sourcefieldname: string;
        sourceformat: string;
        targetformat: string;
        targetfieldname: string;
    };
}

interface ISplitByDelimiterParams {
    name: string;
    position: number;
    default?: string;
}

export default class Config {
    private _dataPartner: string;
    private _feedType: string;
    private _subType: string;
    private _layoutType: string;
    private _delimiter: string;
    private _sourceLayout: ISourceLayout;
    private _targetColumns: any[];
    private _allTargetTables: string[];
    private _publishUrl: string;
    private _readyToDeploy: boolean;
    private _logs: any;
    public name: string;
    public content: any;
    constructor(config: IConfig) {
        for (const name in config) {
            if (config.hasOwnProperty(name)) {
                this[name] = config[name];
            }
        }
        if (this.layoutConfiguration) {
            this.dataPartner = this.layoutConfiguration.common.data_partner_name;
            this.feedType = this.layoutConfiguration.common.feed_name;
        }
        if (config.name) {
            const fileInfo = config.name.split('_');
            // first word before underscore
            const dataPartner = fileInfo.shift();
            this._dataPartner = this._dataPartner || dataPartner;
            // join all word after first underscope to file extension
            const feedType = fileInfo.shift();
            this._feedType = this._feedType || feedType;
            this._feedType = (this._feedType.includes('.cfg') ? this._feedType.replace('.cfg', '') : this._feedType);

            if (fileInfo.length > 0) {
                const subType = fileInfo.shift();
                this._subType = this._subType || subType;
                this._subType = (this._subType.includes('.cfg') ? this._subType.replace('.cfg', '') : this._subType);
            }
        }
    }

    public buildContent() {
        if (this.content) {
            return this.content;
        }

        this.content = {};
        this.content.filters = [];
        if (this.dataPartner && this.feedType) {
            this.content.filters.push(this.buildBaseConfiguration());
        }
    }

    private buildBaseConfiguration() {
        const feedName = this.subType ? `${this.feedType}_${this.subType}` : this.feedType;
        return {
            "filter_name": "get_configurations",
            "params": {
                "common": {
                    "feed_name": feedName,
                    "data_partner_name": this.dataPartner
                }
            }
        };
    }

    public updateFeedInfo(dataPartner: string, feedType: string, subType: string) {
        const feedName = subType ? `${feedType}_${subType}` : feedType;
        this._dataPartner = dataPartner;
        this._feedType = feedType;
        this._subType = subType;
        this.layoutConfiguration = (_.assign(
            {}, (this.layoutConfiguration || {}), {
                common: {
                    feed_name: feedName,
                    data_partner_name: dataPartner
                }
            }));
    }

    public get dataPartner() {
        return this._dataPartner;
    }

    public set dataPartner(partner) {
        this._dataPartner = partner;
    }

    public get feedType() {
        return _.includes(this._feedType, '_') ? this._feedType.split('_')[0] : this._feedType;
    }

    public set feedType(feed) {
        this._feedType = feed;
    }

    public get subType() {
        return this._subType;
    }

    public set subType(subType) {
        this._subType = subType;
    }

    public get fileName() {
        return this.name;
    }

    public get splitByPosition() {
        if (!this.content) {
            return null;
        }
        const mapping: any = _.find(this.content.filters, { filter_name: "split_by_position" });

        return mapping ? mapping.params.fields : [];
    }

    public set splitByPosition(mapping: ISplitByPositionParams[]) {
        const filter: any = _.find(this.content.filters, { filter_name: "split_by_position" });

        if (filter) {
            // update the filters
            filter.params.fields = mapping;
        } else {
            this.content.filters.push({
                filter_name: "split_by_position",
                params: {
                    fields: mapping
                }
            });
        }
    }

    public get splitByDelimiter() {
        if (!this.content) {
            return null;
        }
        const mapping: any = _.find(this.content.filters, { filter_name: "split_by_delimiter" });

        return mapping ? mapping.params.fields : [];
    }

    public set splitByDelimiter(mapping: ISplitByDelimiterParams[]) {
        const filter: any = _.find(this.content.filters, { filter_name: "split_by_delimiter" });

        if (filter) {
            // update the filters
            filter.params.delimiter = filter.params.delimiter || this.delimiter;
            filter.params.fields = mapping;
        } else {
            this.content.filters.push({
                filter_name: "split_by_delimiter",
                params: {
                    delimiter: this.delimiter,
                    fields: mapping
                }
            });
        }
    }

    public get directMapping() {
        if (!this.layoutType) {
            return [];
        }

        return this.layoutType === 'fixedWidth' ? this.splitByPosition : this.splitByDelimiter;
    }

    public set directMapping(mapping: any[]) {
        if (!this.layoutType) {
            return;
        }

        if (this.layoutType === 'fixedWidth') {
            this.splitByPosition = mapping;
        } else if (this.layoutType === 'delimited') {
            this.splitByDelimiter = mapping;
        }

        if (this.sourceLayout.content.length > 0) {
            // Auto-populate date transforms if any
            this.populateDateTransforms(mapping);

            // Auto-populate overpunch filters
            this.populateOverpunchFilters(mapping);

            // Auto-populate SQL expressions
            this.populateSqlExpressions(mapping);
        }
    }

    private populateSqlExpressions(mappings: any[]) {
        const newSqlExpressions = _.reduce(mappings, (result: any[], mapping: any) => {
            let source: any;

            if (this._layoutType === 'fixedWidth') {
                source = _.find(this.sourceLayout.content, { start: mapping.start, end: mapping.end });
            } else if (this._layoutType === 'delimited') {
                source = _.find(this.sourceLayout.content, { position: mapping.position });
            }

            if (source && source.format) {
                const format1 = /d9\(\d\)v9\((\d)\)/;
                const format2 = /d9\(\d\)v(9+)/;
                let decimalPlaces: number;
                if (format1.test(source.format)) {
                    decimalPlaces = parseInt(source.format.match(format1)[1], 10);
                } else if (format2.test(source.format)) {
                    decimalPlaces = source.format.match(format2)[1].length;
                }
                const divident = !isNaN(decimalPlaces) ? Math.pow(10, decimalPlaces) : NaN;

                if (!isNaN(divident)) {
                    result.push({
                        expr: `CASE WHEN length(trim(${mapping.name})) == 0 THEN '0.00' ELSE CAST(${mapping.name} as integer)/${divident} END`,
                        targetfieldname: mapping.name
                    });
                }
            }
            return result;
        }, []);

        if (newSqlExpressions.length > 0) {
            this.addSqlExpressions(newSqlExpressions);
        }
    }

    private addSqlExpressions(expressions) {
        const existingFilters = _.filter(this.content.filters, { filter_name: 'sql_expression' });

        if (existingFilters.length <= 0) {
            const filterInfo = this.addFilter('sql_expression');
            this.setFilter('sql_expression', filterInfo.index, expressions);
        } else {
            const mappedTargets = _.reduce(existingFilters, (result: string[], filter: any) => {
                const targetColumns = filter.params.map(param => param.targetfieldname);
                result = result.concat(targetColumns);
                return result;
            }, []);

            // filter expressions ignore target columns sql expression already has for
            expressions = _.filter(expressions, expression => !_.includes(mappedTargets, expression.targetfieldname));

            if (expressions.length > 0) {
                const filterIndex = _.findIndex(this.content.filters, { filter_name: 'sql_expression' });
                let params = this.getFilter('sql_expression', filterIndex);
                params = params.concat(expressions);
                this.setFilter('sql_expression', filterIndex, params);
            }
        }
    }

    private populateOverpunchFilters(mappings) {
        const newOverpunchFilters = _.reduce(mappings, (result: any, mapping: any) => {
            let source: any;

            if (this._layoutType === 'fixedWidth') {
                source = _.find(this.sourceLayout.content, { start: mapping.start, end: mapping.end });
            } else if (this._layoutType === 'delimited') {
                source = _.find(this.sourceLayout.content, { position: mapping.position });
            }

            if (source && source.format) {
                result.targetfieldname = result.targetfieldname || [];
                result.sourcefieldname = result.sourcefieldname || [];
                result.decimalplaces = result.decimalplaces || [];

                const format1 = /o9\(\d\)v9\((\d)\)/;
                const format2 = /o9\(\d\)v(9+)/;
                let decimalPlaces: number;
                if (format1.test(source.format)) {
                    decimalPlaces = parseInt(source.format.match(format1)[1], 10);
                } else if (format2.test(source.format)) {
                    decimalPlaces = source.format.match(format2)[1].length;
                }

                if (!isNaN(decimalPlaces)) {
                    result.targetfieldname.push(mapping.name);
                    result.sourcefieldname.push(mapping.name);
                    result.decimalplaces.push(decimalPlaces);
                }
            }
            return result;
        }, {});

        if (newOverpunchFilters.targetfieldname.length > 0) {
            this.addOverpunchFilters(newOverpunchFilters);
        }
    }

    private get overpunchFilters() {
        return this.filters.reduce((result: any[], filterInfo: any) => {
            const { filter, index } = filterInfo;

            if (filter.filter_name === 'multiparam') {
                filter.params.forEach((section: any, sectionIndex: number) => {
                    if (section.method === 'convert_overpunch_to_decimal_format') {
                        result.push({
                            filterIndex: index,
                            sectionIndex,
                            params: section.params
                        });
                    }
                });
            }
            return result;
        }, []);
    }

    private addOverpunchFilters(newFilters: any) {
        if (!(newFilters.targetfieldname && (newFilters.targetfieldname.length > 0))) {
            return;
        }

        const existingFilter = this.filters.find(filterInfo => filterInfo.filter.filter_name === 'multiparam');

        const filter = existingFilter ? existingFilter.filter :
            {
                filter_name: 'multiparam',
                params: []
            };

        const overpunchSection = {
            method: 'convert_overpunch_to_decimal_format',
            params: {
                sourcefieldname: [],
                targetfieldname: [],
                decimalplaces: []
            }
        };

        // Ignore the columns for which overpunch filter alreadt present
        const existingOverpunchFilters = this.overpunchFilters.reduce((result: string[], overpunch: any) => {
            result = result.concat(overpunch.params.targetfieldname);
            return result;
        }, []);
        newFilters.targetfieldname.forEach((field: string, index: number) => {
            if (existingOverpunchFilters.indexOf(field) >= 0) {
                newFilters.targetfieldname.splice(index, 1);
                newFilters.sourcefieldname.splice(index, 1);
                newFilters.decimalplaces.splice(index, 1);
            }
        });

        if (newFilters.targetfieldname.length <= 0) {
            return;
        }

        newFilters.targetfieldname.forEach((field: string, index: number) => {
            overpunchSection.params.targetfieldname.push(field);
            overpunchSection.params.sourcefieldname.push(newFilters.sourcefieldname[index]);
            overpunchSection.params.decimalplaces.push(newFilters.decimalplaces[index]);
        });

        filter.params.push(overpunchSection);

        if (existingFilter) {
            this.setFilter('multiparam', existingFilter.index, filter.params);
        } else {
            const { filterName, index } = this.addFilter('multiparam');
            this.setFilter('multiparam', index, filter.params);
        }
    }

    // translated direct mapping to date transforms
    private populateDateTransforms(mapping) {
        const dateColumns = _.map(this.uniqDateColumns, column => column.name);
        const mappedDateColumns = _.filter(mapping, (map) => _.includes(dateColumns, map.name));
        const defaultSourceFormat = '%Y%m%d';
        const targetFormat = '%Y-%m-%d';
        const dateTransforms = this.dateTransforms;
        const newTransforms = _.reduce(mappedDateColumns, (result: any[], map: any) => {
            // find source for the mapping
            let source: any;

            // Ignore if date transform already present for the column
            if (_.find(dateTransforms, transform => transform.params.targetfieldname === map.name)) {
                return result;
            }

            if (this._layoutType === 'fixedWidth') {
                source = _.find(this.sourceLayout.content, { start: map.start, end: map.end });
            } else if (this._layoutType === 'delimited') {
                source = _.find(this.sourceLayout.content, { position: map.position });
            }

            if (source) {
                if (source.format !== targetFormat) {
                    result.push({
                        sourcefieldname: map.name,
                        sourceformat: source.format || defaultSourceFormat,
                        targetformat: targetFormat,
                        targetfieldname: map.name
                    });
                }
            }

            return result;

        }, []);

        this.addDateTransforms(newTransforms);
    }

    private addDateTransforms(newTransforms: any[]) {
        if (newTransforms.length <= 0) {
            return;
        }

        const existingFilter = this.filters.find(filterInfo => filterInfo.filter.filter_name === 'multiparam');

        const filter = existingFilter ? existingFilter.filter :
            {
                filter_name: 'multiparam',
                params: []
            };

        newTransforms.forEach(transform => {
            filter.params.push({
                method: 'get_validated_date',
                params: transform
            });
        });

        if (existingFilter) {
            this.setFilter('multiparam', existingFilter.index, filter.params);
        } else {
            this.content.filters.push(filter);
        }
    }

    public get dateTransforms() {
        return this.filters.reduce((result: any[], filterInfo: any) => {
            const { filter, index } = filterInfo;

            if (filter.filter_name === 'multiparam') {
                filter.params.forEach((section: any, sectionIndex: number) => {
                    if (section.method === 'get_validated_date') {
                        result.push({
                            filterIndex: index,
                            sectionIndex,
                            params: section.params
                        });
                    }
                });
            }
            return result;
        }, []);
    }

    public get businessRules(): any {
        if (!this.content) {
            return null;
        }
        const businessRule: any = _.find(this.content.filters, { filter_name: "get_business_rule_configurations" });

        return businessRule ? businessRule.params : {};
    }

    public set businessRules(rules: any) {
        if (!this.content) {
            return;
        }
        const filter: any = _.find(this.content.filters, { filter_name: "get_business_rule_configurations" });

        if (filter) {
            // update the filters
            filter.params = rules;
        } else {
            this.content.filters.push({
                filter_name: "get_business_rule_configurations",
                params: rules
            });
        }
    }

    public get pivotConfigs(): IPivotConfig[] {
        if (!this.content) {
            return null;
        }
        const mapping: any = _.find(this.content.filters, { filter_name: "get_pivot_configurations" });

        return mapping ? mapping.params : [];
    }

    public set pivotConfigs(configs: IPivotConfig[]) {
        const filter: any = _.find(this.content.filters, { filter_name: "get_pivot_configurations" });

        if (filter) {
            // update the filters
            filter.params = configs;
        } else {
            this.content.filters.push({
                filter_name: "get_pivot_configurations",
                params: configs
            });
        }
    }

    public get layoutConfiguration() {
        if (!this.content) {
            return null;
        }

        const layoutConfig: any = _.find(this.content.filters, { filter_name: "get_configurations" });

        return layoutConfig ? layoutConfig.params : null;
    }

    public set layoutConfiguration(config) {
        if (this.layoutConfiguration) {
            const layoutConfig: any = _.find(this.content.filters, { filter_name: "get_configurations" });
            layoutConfig.params = config;
        } else {
            if (this.dataPartner && this.feedType) {
                const layoutConfig = this.buildBaseConfiguration();
                this.content = this.content || {};
                this.content.filters = this.content.filters || [];
                this.content.filters.push(layoutConfig);
            }
        }
    }

    public get sourceLayout() {
        if (this._sourceLayout) {
            return this._sourceLayout;
        }

        const sourceLayoutName = (this.name || '').split('.').join('_source.');
        return { name: sourceLayoutName, content: [], sha: '' };
    }

    public set sourceLayout(layout: ISourceLayout) {
        this._sourceLayout = layout;
        // assign name if not present
        if (!this._sourceLayout.name) {
            this._sourceLayout.name = (this.name || '').split('.').join('_source.');
        }
        // convert start, end and position values into numbers
        _.forEach(this._sourceLayout.content, source => {
            if (source.start) {
                source.start = parseInt(source.start, 10);
            }

            if (source.end) {
                source.end = parseInt(source.end, 10);
            }

            if (source.position) {
                source.position = parseInt(source.position, 10);
            }
        });
    }

    public get targetColumns() {
        return this._targetColumns || {};
    }

    public set targetColumns(columns: any) {
        this._targetColumns = columns;
    }

    public getTableColumns(tableName): any[] {
        if (!this.targetColumns[tableName]) {
            return [];
        }

        return _.reduce(this.targetColumns[tableName], (targetColumns: any[], column: any) => {
            const alteredColumn: any = _.find(alteredTargetColumns, (alteredCol) => helper.compare(alteredCol.name, column.name));

            // remove auto populated columns
            if (alteredColumn && alteredColumn.autoPopulated) {
                return targetColumns;
            }

            alteredColumn ? targetColumns.push(_.assign({}, column, alteredColumn)) : targetColumns.push(column);
            return targetColumns;
        }, []);
    }

    public get uniqTargetColumns() {
        const uniqColumns = _.uniqBy(_.flatten(_.values(this._targetColumns)), 'name');

        return _.reduce(uniqColumns, (targetColumns: any[], column: any) => {
            const alteredColumn: any = _.find(alteredTargetColumns, (alteredCol) => helper.compare(alteredCol.name, column.name));

            // remove auto populated columns
            if (alteredColumn && alteredColumn.autoPopulated) {
                return targetColumns;
            }

            alteredColumn ? targetColumns.push(_.assign({}, column, alteredColumn)) : targetColumns.push(column);
            return targetColumns;
        }, []);
    }

    public get uniqDateColumns() {
        return _.filter(this.uniqTargetColumns, column => {
            return _.includes(dateColumnTypes, column.type);
        });
    }

    public get uniqDecimalColumns() {
        return _.filter(this.uniqTargetColumns, column => {
            return _.includes(decimalColumnTypes, column.type);
        });
    }

    public get uniqStringColumns() {
        return _.filter(this.uniqTargetColumns, column => {
            return !column.type || !_.includes(specialColumnTypes, column.type.toLowerCase());
        });
    }

    public get uniqNumberColumns() {
        return _.filter(this.uniqTargetColumns, column => {
            return _.includes(numberColumnTypes, column.type.toLowerCase());
        });
    }

    public getUnMappedTargetColumns(filterName: string) {
        const mappedColumns: string[] = this.getMappedTargets(filterName);
        return this.uniqTargetColumns.filter(column => {
            return mappedColumns.indexOf(column.name) < 0 && !column.autoPopulated;
        });
    }

    private mappedIn(filterName: string) {
        switch (filterName) {
            case 'direct_mapping':
                return this.directMapping ? _.map(this.directMapping, mapping => mapping.name) : [];

            case 'filters':
                return this.filters.reduce((result: string[], filterInfo: any) => {
                    const { filter } = filterInfo;
                    switch (filter.filter_name) {
                        case 'default_value':
                            result = result.concat(_.keys(filter.params));
                            break;

                        case 'multiparam':
                            result.concat(_.map(filter.params, (param: any) => {
                                if (param.method === 'get_concatenated_field') {
                                    return param.params.target_field;
                                } else if (param.method === 'get_validated_date') {
                                    return param.params.targetfieldname;
                                }
                            }));
                            break;

                        case 'sql_expression':
                            result = result.concat(_.map(filter.params, (param: any) => param.targetfieldname));
                            break;
                    }

                    return result;
                }, []);

            default:
                return [];
        }
    }

    public getMappedTargets(filterName: string = '') {
        let mappedColumns: string[] = [];

        if (filterName !== 'direct_mapping') {
            mappedColumns = mappedColumns.concat(this.mappedIn('direct_mapping'));
        }

        if (filterName !== 'filters') {
            mappedColumns = mappedColumns.concat(this.mappedIn('filters'));
        }

        return mappedColumns;
    }

    public get mappedTargetColumns() {
        const allColumns = this.uniqTargetColumns;
        const allMappedColumns: string[] = this.getMappedTargets();

        return _.reduce(allMappedColumns, (result, column) => {
            const targetColumn = _.find(allColumns, { name: column });

            if (targetColumn) {
                result.push(targetColumn);
            } else {
                result.push({ name: column, type: 'string' });
            }

            return result;
        }, []);
    }

    public get allTargetTables() {
        return this._allTargetTables || [];
    }

    public set allTargetTables(tables: string[]) {
        this._allTargetTables = tables;
    }

    public get targetTables() {
        if (this.layoutConfiguration) {
            return this.layoutConfiguration.target_tables || [];
        } else {
            return [];
        }
    }

    public set targetTables(tables) {
        this.layoutConfiguration = this.layoutConfiguration ?
            _.assign({}, this.layoutConfiguration, { 'target_tables': tables }) :
            { 'target_tables': tables };
    }

    public get publishUrl() {
        return this._publishUrl;
    }

    public set publishUrl(url: string) {
        this._publishUrl = url;
    }

    public get layoutType() {
        if (this._layoutType) {
            return this._layoutType;
        } else if (this.splitByPosition && this.splitByPosition.length > 0) {
            this._layoutType = 'fixedWidth';
            return 'fixedWidth';
        } else if (this.splitByDelimiter && this.splitByDelimiter.length > 0) {
            this._layoutType = 'delimited';
            return 'delimited';
        } else {
            return '';
        }
    }

    public set layoutType(layoutType) {
        this._layoutType = layoutType;
    }

    public get delimiter() {
        if (this._delimiter) {
            return this._delimiter;
        }

        // Compute delimiter from split by delimiter filter
        if (this.content) {
            const filter: any = _.find(this.content.filters, { filter_name: "split_by_delimiter" });
            if (filter) {
                this._delimiter = filter.params.delimiter;
            }
        } else {
            this._delimiter = '';
        }

        return this._delimiter;
    }

    public set delimiter(delimiter) {
        this._delimiter = delimiter;

        // set the delimiter in the split by delimiter filter
        if (this.content) {
            const filter: any = _.find(this.content.filters, { filter_name: "split_by_delimiter" });
            if (filter) {
                filter.params.delimiter = delimiter;
            }
        }
    }

    public getUnmappedColumns(filterName: string, index: number) {
        const allColumns = this.uniqTargetColumns;

        const mappedColumns = this.getMappedValues(filterName, index);

        return _.filter(allColumns, column => !_.includes(mappedColumns, column.name));
    }

    public getMappedValues(filterName: string, index: number) {
        // get mapped columns  in direct mapping
        const mappedInDirectMapping = this.directMapping.map(mapping => mapping.name);

        const mappedInFilters = this.filters.reduce((result, filterInfo) => {
            const { filter } = filterInfo;
            if (filter.filter_name === filterName && filterInfo.index === index) {
                return result;
            }

            switch (filter.filter_name) {
                case 'default_value':
                    result.push(_.keys(filter.params));
                    return result;

                case 'multiparam':
                    result.push(_.map(filter.params, (param: any) => {
                        if (param.method === 'get_concatenated_field') {
                            return param.params.target_field;
                        } else if (param.method === 'get_validated_date') {
                            return param.params.targetfieldname;
                        }
                    }));
                    return result;


                case 'sql_expression':
                    result.push(_.map(filter.params, (param: any) => param.targetfieldname));
                    return result;

                default:
                    return result;
            }


        }, []);

        return (_.flatten(_.concat(mappedInDirectMapping, mappedInFilters)));
    }

    public setFilter(filterName, index, params) {
        if (!this.content || !isFinite(index) || isNaN(parseInt(index, 10))) {
            return;
        }

        const filter = this.content.filters[index];
        if (filter) {
            filter.params = params;
        } else {
            this.content.filters[index] = {
                filter_name: filterName,
                params
            };
        }
    }

    public removeFilter(filterName: string, index: number) {
        if (!this.content) {
            return;
        }

        const filter: IFilter = this.content.filters[index];
        if (filter && filter.filter_name === filterName) {
            this.content.filters.splice(index, 1);
        }
    }

    public addFilter(filterName) {
        if (!this.content) {
            return;
        }

        const newFilter: IFilter = {
            filter_name: filterName,
            params: []
        };

        // build params according to filtername
        switch (filterName) {
            case 'default_value':
                newFilter.params = {};
                break;

            case 'multiparam':
            case 'sql_expression':
                newFilter.params = [];
                break;

            default:
                newFilter.params = [];
                break;
        }

        this.content.filters.push(newFilter);
        return {
            filterName,
            index: (this.content.filters.length - 1)
        };
    }

    public getFilter(filterName, index = null) {
        if (!this.content || index === null) {
            return [];
        }

        const filter = this.content.filters[index];
        return filter && (filter.filter_name === filterName) ? filter.params : [];
    }

    public get filters() {
        const filterNames = ['default_value', 'multiparam', 'sql_expression'];

        if (!this.content) {
            return [];
        }

        return _.compact(_.map(this.content.filters, (filter: IFilter, index: number) => {
            if (_.includes(filterNames, filter.filter_name)) {
                return { index, filter };
            }
        }));
    }

    public get steps(): IStep[] {
        const fixedSteps: IStep[] = [{
            title: 'Configuration',
            type: 'layout-configuration',
            id: 'layout-configuration'
        }, {
            title: 'Target Tables',
            type: 'target-tables',
            id: 'target-tables'
        }, {
            title: 'Source Layout',
            type: 'source-layout',
            id: 'source-layout'
        }, {
            title: 'Direct Mapping',
            type: 'direct-mapping',
            id: 'direct-mapping',
            disabled: this.targetTables.length <= 0
        }, {
            title: 'Pivot Config',
            type: 'pivot-config',
            id: 'pivot-config',
            disabled: this.directMapping.length <= 0
        }, {
            title: 'Business Rules',
            type: 'business-rules',
            id: 'business-rules',
            disabled: this.targetTables.length <= 0
        }];

        const fluidFilters = { 'default_value': 'Default Value', 'multiparam': 'Multiparam', 'sql_expression': 'SQL Expression' };
        const filters = this.filters;

        const fluidSteps = _.map(filters, (filterInfo: any) => {
            const { index, filter } = filterInfo;
            return {
                title: fluidFilters[filter.filter_name],
                type: filter.filter_name,
                id: `${filter.filter_name}_${index}`,
                index,
                disabled: this.directMapping.length <= 0,
                removable: true
            };
        });

        return _.concat(fixedSteps, fluidSteps);
    }

    public get readyToDeploy() {
        return this._readyToDeploy || false;
    }

    public set readyToDeploy(state) {
        this._readyToDeploy = state;
    }

    public get processLogs(): any {
        return this._logs || null;
    }

    public set processLogs(logs: any) {
        this._logs = logs;
    }
 
    public toJSON() {
        // convert into json structure
        return JSON.parse(JSON.stringify(this));
    }
}

