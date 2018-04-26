import * as expect from 'expect';
import Config, { IConfig } from '../../src/configs/config';

describe('Config', () => {
    let config: Config;
    beforeEach(() => {
        config = new Config({});
    });

    it('is defined', () => {
        expect(config).toBeDefined();
    });

    describe('#dataPartner', () => {
        it('should be empty by default', () => {
            expect(config.dataPartner).not.toBeDefined();
        });

        it('sets the data partner', () => {
            config.dataPartner = 'TEST_PARTNER';
            expect(config.dataPartner).toEqual('TEST_PARTNER');
        });
    });

    describe('when config is created with some initial data', () => {
        it('computes data partner and feed type from file name', () => {
            config = new Config({ name: 'Partner_feed.cfg' });
            expect(config.dataPartner).toEqual('Partner');
            expect(config.feedType).toEqual('feed');
            expect(config.subType).not.toBeDefined();
        });

        it('computes the sub type from the file name', () => {
            config = new Config({ name: 'Partner_feed_sub.cfg' });
            expect(config.dataPartner).toEqual('Partner');
            expect(config.feedType).toEqual('feed');
            expect(config.subType).toEqual('sub');
        });

        it('does not compute the data partner from file name if specified', () => {
            config = new Config({ dataPartner: 'Test_partner', name: 'Partner_feed_sub.cfg' });
            expect(config.dataPartner).toEqual('Test_partner');
            expect(config.feedType).toEqual('feed');
            expect(config.subType).toEqual('sub');
        });

        it('does not compute the feed type from file name if specified', () => {
            config = new Config({ dataPartner: 'Test_partner', feedType: 'Test', name: 'Partner_feed_sub.cfg' });
            expect(config.dataPartner).toEqual('Test_partner');
            expect(config.feedType).toEqual('Test');
            expect(config.subType).toEqual('sub');
        });
    });

    describe('#buildContent', () => {
        it('creates a basic content, when the config has no content', () => {
            expect(config.content).not.toBeDefined();
            config.buildContent();
            expect(config.content).toBeDefined();
            expect(config.content).toEqual({ filters: [] });
        });

        it('adds layout configuration, when config has data partner and feed type', () => {
            config.dataPartner = 'partner';
            config.feedType = 'feed';
            expect(config.layoutConfiguration).toEqual(null);
            config.buildContent();
            expect(config.layoutConfiguration).toBeDefined();
            expect(config.layoutConfiguration).toEqual({
                common: {
                    feed_name: 'feed',
                    data_partner_name: 'partner'
                }
            });
        });

        it('does not change the content, if the config already has content', () => {
            config.content = { content: 'test' };
            expect(config.content).toEqual({ content: 'test' });
            config.buildContent();
            expect(config.content).toEqual({ content: 'test' });
        });
    });

    describe('#updateFeedInfo', () => {
        it('sets the feed and datapartner, when not present', () => {
            expect(config.dataPartner).not.toBeDefined();
            expect(config.feedType).not.toBeDefined();
            expect(config.subType).not.toBeDefined();
            const dataPartner = 'partner';
            const feedType = 'feed';
            const subType = 'sub';

            config.updateFeedInfo(dataPartner, feedType, subType);
            expect(config.dataPartner).toEqual(dataPartner);
            expect(config.feedType).toEqual(feedType);
            expect(config.subType).toEqual(subType);
            expect(config.layoutConfiguration).toEqual({
                common: {
                    feed_name: 'feed_sub',
                    data_partner_name: 'partner'
                }
            });
        });

        it('updates the feed type and data partner', () => {
            config.dataPartner = 'partner';
            config.feedType = 'feed';
            config.subType = 'sub';
            config.layoutConfiguration = {
                common: {
                    feed_name: 'feed_sub',
                    data_partner_name: 'partner'
                }
            };

            expect(config.dataPartner).toEqual('partner');
            expect(config.feedType).toEqual('feed');
            expect(config.subType).toEqual('sub');
            expect(config.layoutConfiguration).toEqual({
                common: {
                    feed_name: 'feed_sub',
                    data_partner_name: 'partner'
                }
            });

            config.updateFeedInfo('partner2', 'feed2', 'sub2');
            expect(config.dataPartner).toEqual('partner2');
            expect(config.feedType).toEqual('feed2');
            expect(config.subType).toEqual('sub2');
            expect(config.layoutConfiguration).toEqual({
                common: {
                    feed_name: 'feed2_sub2',
                    data_partner_name: 'partner2'
                }
            });
        });
    });

    describe('#directMapping', () => {
        describe('when it has no content', () => {
            it('returns empty array', () => {
                expect(config.content).not.toBeDefined();
                expect(config.directMapping).toEqual([]);
            });
        });

        describe('when it has split by position filter', () => {
            beforeEach(() => {
                const splitByPosition = {
                    "filter_name": "split_by_position",
                    "params": {
                        "fields": [
                            {
                                "name": "TEST_FIELD_1",
                                "start": 12,
                                "end": 20
                            },
                            {
                                "name": "TEST_FIELD_2",
                                "start": 20,
                                "end": 28,
                                "default": '0.00'
                            }
                        ]
                    }
                };

                config.content = config.content || { filters: [] };
                config.content.filters.push(splitByPosition);
            });
            it('returns split by position params', () => {
                expect(config.directMapping).toEqual([
                    {
                        "name": "TEST_FIELD_1",
                        "start": 12,
                        "end": 20
                    },
                    {
                        "name": "TEST_FIELD_2",
                        "start": 20,
                        "end": 28,
                        "default": '0.00'
                    }
                ]);
            });
        });

        it('returns empty array, when the config has no split by position filter', () => {
            config.content = { filters: [] };
            expect(config.directMapping).toEqual([]);
        });

        describe('when it has split by delimiter filter', () => {
            beforeEach(() => {
                const splitByDelimiter = {
                    "filter_name": "split_by_delimiter",
                    "params": {
                        "fields": [
                            {
                                "name": "TEST_FIELD_1",
                                "position": 1
                            },
                            {
                                "name": "TEST_FIELD_2",
                                "position": 2,
                                "default": '0.00'
                            }
                        ]
                    }
                };

                config.content = config.content || { filters: [] };
                config.content.filters.push(splitByDelimiter);
            });

            it('returns the split by delimiter fields', () => {
                expect(config.directMapping).toEqual([
                    {
                        "name": "TEST_FIELD_1",
                        "position": 1
                    },
                    {
                        "name": "TEST_FIELD_2",
                        "position": 2,
                        "default": '0.00'
                    }
                ]);
            });
        });

        it('returns empty array, when the config has no split by delimiter filter', () => {
            config.content = { filters: [] };
            expect(config.directMapping).toEqual([]);
        });
    });

    describe('#directMapping=', () => {
        describe('when there is already split by position values', () => {
            let splitByPositionFilter: any = {};
            beforeEach(() => {
                splitByPositionFilter = {
                    "filter_name": "split_by_position",
                    "params": {
                        "fields": [
                            {
                                "name": "TEST_FIELD_1",
                                "start": 12,
                                "end": 20
                            },
                            {
                                "name": "TEST_FIELD_2",
                                "start": 20,
                                "end": 28,
                                "default": '0.00'
                            }
                        ]
                    }
                };

                config.content = {
                    filters: [splitByPositionFilter]
                };
            });
            it('updates the split by position fields', () => {
                expect(config.splitByPosition).toEqual(splitByPositionFilter.params.fields);
                config.directMapping = [{ name: "New_field", start: 10, end: 20, default: 'N/P' }];
                expect(config.splitByPosition).toEqual([{ name: "New_field", start: 10, end: 20, default: 'N/P' }]);
            });

            describe('#auto-populate date transforms', () => {
                describe('when there is source layout', () => {
                    beforeEach(() => {
                        config.targetColumns = {
                            'table_1': [{ name: 'TEST_FIELD_1', type: 'datetime' }, { name: 'TEST_FIELD_2', type: 'string' }],
                            'table_2': [{ name: 'TEST_FIELD_3', type: 'datetime' }]
                        };

                        config.sourceLayout = {
                            name: 'test_source.cfg', sha: '', content: [{
                                name: 'Field1',
                                start: 12,
                                end: 20,
                                type: 'datetime',
                                format: '%y%m%d'
                            }, {
                                name: 'Field2',
                                start: 20,
                                end: 28,
                                type: 'string',
                                format: ''
                            }, {
                                name: 'Field3',
                                start: 28,
                                end: 32,
                                type: 'datetime',
                                format: '%Y-%m-%d'
                            }]
                        };
                    });

                    it('auto-populates date transfroms for mapped date fields', () => {
                        expect(config.dateTransforms.length).toEqual(0);
                        config.directMapping = splitByPositionFilter.params.fields;
                        expect(config.dateTransforms.length).toEqual(1);
                        expect(config.filters.length).toEqual(1);

                        const transform = config.dateTransforms[0];
                        expect(transform.filterIndex).toEqual(1);
                        expect(transform.sectionIndex).toEqual(0);
                        expect(transform.params).toEqual({
                            "sourcefieldname": "TEST_FIELD_1",
                            "sourceformat": "%y%m%d",
                            "targetfieldname": "TEST_FIELD_1",
                            "targetformat": "%Y-%m-%d",
                        });
                    });

                    it('adds the date transforms to the existing multiparam filter', () => {
                        config.addFilter('multiparam');
                        expect(config.filters.length).toEqual(1);
                        expect(config.dateTransforms.length).toEqual(0);
                        config.directMapping = splitByPositionFilter.params.fields;
                        expect(config.dateTransforms.length).toEqual(1);
                        expect(config.filters.length).toEqual(1);
                    });

                    it('does not create date transform, when the format of source matches with that of the destination', () => {
                        config.sourceLayout = {
                            name: 'test_source.cfg', sha: '', content: [{
                                name: 'Field1',
                                start: 12,
                                end: 20,
                                type: 'datetime',
                                format: '%Y-%m-%d'
                            }, {
                                name: 'Field2',
                                start: 20,
                                end: 28,
                                type: 'string',
                                format: ''
                            }, {
                                name: 'Field3',
                                start: 28,
                                end: 32,
                                type: 'datetime',
                                format: '%Y-%m-%d'
                            }]
                        };

                        expect(config.dateTransforms.length).toEqual(0);
                        config.directMapping = splitByPositionFilter.params.fields;
                        expect(config.dateTransforms.length).toEqual(0);
                        expect(config.filters.length).toEqual(0);
                    });

                    it('does not create new / modify the existing date transform for the target column', () => {
                        config.addFilter('multiparam');
                        const filterParams = config.getFilter('multiparam', 1);
                        filterParams.push({
                            "method": "get_validated_date",
                            "params": {
                                "sourcefieldname": "TEST_FIELD_1",
                                "sourceformat": "test-format",
                                "targetformat": "%Y-%m-%d",
                                "targetfieldname": "TEST_FIELD_1"
                            }
                        });

                        config.setFilter('multiparam', 1, filterParams);
                        expect(config.dateTransforms.length).toEqual(1);
                        config.directMapping = splitByPositionFilter.params.fields;
                        expect(config.dateTransforms.length).toEqual(1);
                        expect(config.getFilter('multiparam', 1)).toEqual([{
                            "method": "get_validated_date",
                            "params": {
                                "sourcefieldname": "TEST_FIELD_1",
                                "sourceformat": "test-format",
                                "targetformat": "%Y-%m-%d",
                                "targetfieldname": "TEST_FIELD_1"
                            }
                        }]);
                    });
                });

                describe('when there is no source layout', () => {
                    beforeEach(() => {
                        config.targetColumns = {
                            'table_1': [{ name: 'TEST_FIELD_1', type: 'datetime' }, { name: 'TEST_FIELD_2', type: 'string' }],
                            'table_2': [{ name: 'TEST_FIELD_3', type: 'datetime' }]
                        };

                        it('does not create date transforms', () => {
                            expect(config.dateTransforms.length).toEqual(0);
                            config.directMapping = splitByPositionFilter.params.fields;
                            expect(config.dateTransforms.length).toEqual(0);
                        });
                    });
                });
            });
        });

        describe('when there is already split by delimiter values', () => {
            let splitByDelimiterFilter: any = {};
            beforeEach(() => {
                splitByDelimiterFilter = {
                    "filter_name": "split_by_delimiter",
                    "params": {
                        "fields": [
                            {
                                "name": "TEST_FIELD_1",
                                "position": 1
                            },
                            {
                                "name": "TEST_FIELD_2",
                                "position": 2,
                                "default": '0.00'
                            }
                        ]
                    }
                };

                config.content = {
                    filters: [splitByDelimiterFilter]
                };
            });
            it('updates the split by delimiter fields', () => {
                expect(config.splitByDelimiter).toEqual(splitByDelimiterFilter.params.fields);
                config.directMapping = [{ name: "New_field", position: 3 }];
                expect(config.splitByDelimiter).toEqual([{ name: "New_field", position: 3 }]);
            });
        });

        describe('when there is no split by filter', () => {
            beforeEach(() => {
                config.content = { filters: [] };
            });
            describe('when layout type is mentioned', () => {
                it('creates split by position filter for fixed width layout', () => {
                    config.layoutType = 'fixedWidth';
                    expect(config.splitByPosition).toEqual([]);
                    const splitByFields = [{
                        name: "Field_1",
                        start: 1,
                        end: 5
                    }];
                    config.directMapping = splitByFields;
                    expect(config.splitByPosition).toEqual(splitByFields);
                });

                it('creates spli by delimiter for delimited layout', () => {
                    config.layoutType = 'delimited';
                    expect(config.splitByDelimiter).toEqual([]);
                    const splitByFields = [{
                        name: "Field_1",
                        position: 1
                    }];
                    config.directMapping = splitByFields;
                    expect(config.splitByDelimiter).toEqual(splitByFields);
                });
            });

            describe('when layout type is not mentioned', () => {
                it('does not change the content', () => {
                    const splitByFields = [{
                        name: "Field_1",
                        position: 1
                    }];
                    config.directMapping = splitByFields;
                    expect(config.content).toEqual({ filters: [] });
                    expect(config.splitByDelimiter).toEqual([]);
                    expect(config.splitByPosition).toEqual([]);
                });
            });
        });

        describe('#auto-populate SQL expressions', () => {
            beforeEach(() => {
                config.content = { filters: [] };
                config.layoutType = 'fixedWidth';
                config.targetColumns = {
                    'table_1': [
                        { name: 'Field1', type: 'string' },
                        { name: 'Field2', type: 'string' },
                        { name: 'Field3', type: 'decimal' }
                    ],
                    'table_2': [
                        { name: 'Field4', type: 'amount' },
                        { name: 'Field5', type: 'custom' }
                    ],
                    'table_3': [
                        { name: 'Field6', type: 'varchar' }
                    ]
                };
            });
            describe('when it has source layout', () => {
                let mapping: any[];
                beforeEach(() => {
                    config.sourceLayout = {
                        name: 'test_source.cfg',
                        sha: '',
                        content: [
                            { name: 'Field1', start: 10, end: 12, type: 'amount', format: 'd9(3)v9(2)' },
                            { name: 'Field2', start: 13, end: 15, type: 'decimal', format: 'd9(2)v999' },
                            { name: 'Field3', start: 16, end: 20, type: 'custom', format: 'd9(3).9(3)' },
                            { name: 'Field4', start: 21, end: 25, type: 'another', format: 'o9(2)v9(2)' },
                            { name: 'Field5', start: 26, end: 30, type: 'decimal', format: '09(2)v999' },
                            { name: 'Field6', start: 30, end: 35, type: 'datetime', format: '%d-%m-%Y' },
                            { name: 'Field7', start: 36, end: 40, type: 'string', format: '' },
                            { name: 'Field8', start: 41, end: 43, type: 'string' }
                        ]
                    };

                    mapping = [
                        { name: 'Field1', start: 10, end: 12 },
                        { name: 'Field2', start: 13, end: 15 },
                        { name: 'Field3', start: 16, end: 20 },
                        { name: 'Field4', start: 21, end: 25 },
                        { name: 'Field5', start: 26, end: 30 },
                        { name: 'Field6', start: 30, end: 35 },
                        { name: 'Field7', start: 36, end: 40 },
                        { name: 'Field8', start: 41, end: 43 }
                    ];
                });

                it('adds SQL expressions for source fields with format "d9(x)v9(y)" and d9(x)v9X', () => {
                    expect(config.filters.length).toEqual(0);
                    config.directMapping = mapping;
                    expect(config.filters.length).toEqual(2);
                    expect(config.getFilter('sql_expression', 2)).toEqual([
                        {
                            "expr": "CASE WHEN length(trim(Field1)) == 0 THEN '0.00' ELSE CAST(Field1 as integer)/100 END",
                            "targetfieldname": "Field1"
                        },
                        {
                            "expr": "CASE WHEN length(trim(Field2)) == 0 THEN '0.00' ELSE CAST(Field2 as integer)/1000 END",
                            "targetfieldname": "Field2"
                        }
                    ]);
                });

                it('updates the existing sql expression if there is any', () => {
                    const { filterName, index } = config.addFilter('sql_expression');
                    config.setFilter(filterName, index, [{ expr: 'Test expression', targetfieldname: 'Test' }]);
                    expect(config.filters.length).toEqual(1);
                    expect(config.getFilter('sql_expression', index)).toEqual([{ expr: 'Test expression', targetfieldname: 'Test' }]);
                    config.directMapping = mapping;
                    expect(config.filters.length).toEqual(2);
                    expect(config.getFilter('sql_expression', index)).toEqual([
                        {
                            "expr": 'Test expression',
                            "targetfieldname": 'Test'
                        },
                        {
                            "expr": "CASE WHEN length(trim(Field1)) == 0 THEN '0.00' ELSE CAST(Field1 as integer)/100 END",
                            "targetfieldname": "Field1"
                        },
                        {
                            "expr": "CASE WHEN length(trim(Field2)) == 0 THEN '0.00' ELSE CAST(Field2 as integer)/1000 END",
                            "targetfieldname": "Field2"
                        }
                    ]);
                });

                it('ignores the target column when there is already an existing sql expression for the column', () => {
                    const { filterName, index } = config.addFilter('sql_expression');
                    config.setFilter(filterName, index, [{ expr: 'Test expression', targetfieldname: 'Field1' }]);
                    const filter2Info = config.addFilter('sql_expression');
                    config.setFilter('sql_expression', filter2Info.index, [{ expr: 'Test expression', targetfieldname: 'Field2' }]);
                    expect(config.filters.length).toEqual(2);
                    config.directMapping = mapping;
                    expect(config.filters.length).toEqual(3);
                    expect(config.getFilter('sql_expression', index)).toEqual([
                        { expr: 'Test expression', targetfieldname: 'Field1' }
                    ]);
                    expect(config.getFilter('sql_expression', filter2Info.index)).toEqual([
                        { expr: 'Test expression', targetfieldname: 'Field2' }
                    ]);
                });
            });

            describe('when it does not have source layout', () => {
                let mapping: any[];
                beforeEach(() => {
                    config.sourceLayout = {
                        name: 'test_source.cfg',
                        sha: '',
                        content: []
                    };

                    mapping = [
                        { name: 'Field1', start: 10, end: 12 },
                        { name: 'Field2', start: 13, end: 15 },
                        { name: 'Field3', start: 16, end: 20 },
                        { name: 'Field4', start: 21, end: 25 },
                        { name: 'Field5', start: 26, end: 30 },
                        { name: 'Field6', start: 30, end: 35 },
                        { name: 'Field7', start: 36, end: 40 },
                        { name: 'Field8', start: 41, end: 43 }
                    ];
                });

                it('does not auto populate any sql expressions', () => {
                    expect(config.filters.length).toEqual(0);
                    config.directMapping = mapping;
                    expect(config.filters.length).toEqual(0);
                });
            });
        });

        describe('#auto-populate overpunch filters', () => {
            beforeEach(() => {
                config.content = { filters: [] };
                config.layoutType = 'fixedWidth';
                config.targetColumns = {
                    'table_1': [
                        { name: 'Field1', type: 'string' },
                        { name: 'Field2', type: 'string' },
                        { name: 'Field3', type: 'decimal' }
                    ],
                    'table_2': [
                        { name: 'Field4', type: 'amount' },
                        { name: 'Field5', type: 'custom' }
                    ],
                    'table_3': [
                        { name: 'Field6', type: 'varchar' }
                    ]
                };
            });

            describe('when it has source layout', () => {
                let mapping: any[];
                beforeEach(() => {
                    config.sourceLayout = {
                        name: 'test_source.cfg',
                        sha: '',
                        content: [
                            { name: 'Field1', start: 10, end: 12, type: 'amount', format: 'd9(3)v9(2)' },
                            { name: 'Field2', start: 13, end: 15, type: 'decimal', format: 'd9(2)v999' },
                            { name: 'Field3', start: 16, end: 20, type: 'custom', format: 'd9(3).9(3)' },
                            { name: 'Field4', start: 21, end: 25, type: 'another', format: 'o9(2)v9(2)' },
                            { name: 'Field5', start: 26, end: 30, type: 'decimal', format: 'o9(2)v999' },
                            { name: 'Field6', start: 30, end: 35, type: 'datetime', format: '%d-%m-%Y' },
                            { name: 'Field7', start: 36, end: 40, type: 'string', format: '' },
                            { name: 'Field8', start: 41, end: 43, type: 'string' }
                        ]
                    };

                    mapping = [
                        { name: 'Field1', start: 10, end: 12 },
                        { name: 'Field2', start: 13, end: 15 },
                        { name: 'Field3', start: 16, end: 20 },
                        { name: 'Field4', start: 21, end: 25 },
                        { name: 'Field5', start: 26, end: 30 },
                        { name: 'Field6', start: 30, end: 35 },
                        { name: 'Field7', start: 36, end: 40 },
                        { name: 'Field8', start: 41, end: 43 }
                    ];
                });

                it('adds overpunch filters for source fields with format "o9(x)v9(y)" and "o9(x)v9X"', () => {
                    expect(config.filters.length).toEqual(0);
                    config.directMapping = mapping;
                    expect(config.filters.length).toEqual(2);
                    expect(config.getFilter('multiparam', 1)).toEqual([
                        {
                            "method": "convert_overpunch_to_decimal_format",
                            "params":
                            {
                                "sourcefieldname": ["Field4", "Field5"],
                                "targetfieldname": ["Field4", "Field5"],
                                "decimalplaces": [2, 3]
                            }
                        }
                    ]);
                });

                it('updates the existing multiparam filter if there is any', () => {
                    const { filterName, index } = config.addFilter('multiparam');
                    config.setFilter(filterName, index, [{
                        "method": "get_concatenated_field",
                        "params":
                        {
                            "fields": ["$Field1", "$Field2"],
                            "delimiter": "~",
                            "target_field": "Field9"
                        }
                    }]);
                    expect(config.filters.length).toEqual(1);
                    expect(config.getFilter('multiparam', index)).toEqual([{
                        "method": "get_concatenated_field",
                        "params":
                        {
                            "fields": ["$Field1", "$Field2"],
                            "delimiter": "~",
                            "target_field": "Field9"
                        }
                    }]);
                    config.directMapping = mapping;
                    expect(config.filters.length).toEqual(2);
                    expect(config.getFilter('multiparam', index)).toEqual([
                        {
                            "method": "get_concatenated_field",
                            "params":
                            {
                                "fields": ["$Field1", "$Field2"],
                                "delimiter": "~",
                                "target_field": "Field9"
                            }
                        },
                        {
                            "method": "convert_overpunch_to_decimal_format",
                            "params":
                            {
                                "sourcefieldname": ["Field4", "Field5"],
                                "targetfieldname": ["Field4", "Field5"],
                                "decimalplaces": [2, 3]
                            }
                        }
                    ]);
                });

                it('ignores the target column when there is already an existing overpunch filter for it', () => {
                    const { filterName, index } = config.addFilter('multiparam');
                    config.setFilter(filterName, index, [
                        {
                            "method": "get_concatenated_field",
                            "params":
                            {
                                "fields": ["$Field1", "$Field2"],
                                "delimiter": "~",
                                "target_field": "Field9"
                            }
                        },
                        {
                            "method": "convert_overpunch_to_decimal_format",
                            "params":
                            {
                                "sourcefieldname": ["Field4"],
                                "targetfieldname": ["Field4"],
                                "decimalplaces": [7]
                            }
                        }
                    ]);
                    const filter2Info = config.addFilter('multiparam');
                    config.setFilter('multiparam', filter2Info.index, [
                        {
                            "method": "convert_overpunch_to_decimal_format",
                            "params":
                            {
                                "sourcefieldname": ["Field9"],
                                "targetfieldname": ["Field9"],
                                "decimalplaces": [2]
                            }
                        }
                    ]);
                    expect(config.filters.length).toEqual(2);
                    config.directMapping = mapping;
                    expect(config.filters.length).toEqual(3);
                    expect(config.getFilter('multiparam', index)).toEqual([
                        {
                            "method": "get_concatenated_field",
                            "params":
                            {
                                "fields": ["$Field1", "$Field2"],
                                "delimiter": "~",
                                "target_field": "Field9"
                            }
                        },
                        {
                            "method": "convert_overpunch_to_decimal_format",
                            "params":
                            {
                                "sourcefieldname": ["Field4"],
                                "targetfieldname": ["Field4"],
                                "decimalplaces": [7]
                            }
                        },
                        {
                            "method": "convert_overpunch_to_decimal_format",
                            "params":
                            {
                                "sourcefieldname": ["Field5"],
                                "targetfieldname": ["Field5"],
                                "decimalplaces": [3]
                            }
                        }
                    ]);
                    expect(config.getFilter('multiparam', filter2Info.index)).toEqual([
                        {
                            "method": "convert_overpunch_to_decimal_format",
                            "params":
                            {
                                "sourcefieldname": ["Field9"],
                                "targetfieldname": ["Field9"],
                                "decimalplaces": [2]
                            }
                        }
                    ]);
                });
            });

            describe('when it does not have the source layout', () => {
                let mapping: any[];
                beforeEach(() => {
                    config.sourceLayout = {
                        name: 'test_source.cfg',
                        sha: '',
                        content: []
                    };

                    mapping = [
                        { name: 'Field1', start: 10, end: 12 },
                        { name: 'Field2', start: 13, end: 15 },
                        { name: 'Field3', start: 16, end: 20 },
                        { name: 'Field4', start: 21, end: 25 },
                        { name: 'Field5', start: 26, end: 30 },
                        { name: 'Field6', start: 30, end: 35 },
                        { name: 'Field7', start: 36, end: 40 },
                        { name: 'Field8', start: 41, end: 43 }
                    ];
                });
            });
        });
    });

    describe('#steps', () => {
        beforeEach(() => {
            config.content = { filters: [] };
        });

        it('should have basic steps', () => {
            expect(config.steps.length).toEqual(6);

            const steps = config.steps;

            // layout configuration
            expect(steps[0].title).toEqual('Configuration');
            expect(steps[0].type).toEqual('layout-configuration');
            expect(steps[0].id).toEqual('layout-configuration');

            // target tables
            expect(steps[1].title).toEqual('Target Tables');
            expect(steps[1].type).toEqual('target-tables');
            expect(steps[1].id).toEqual('target-tables');

            // Source layout
            expect(steps[2].title).toEqual('Source Layout');
            expect(steps[2].type).toEqual('source-layout');
            expect(steps[2].id).toEqual('source-layout');

            // Direct Mapping
            expect(steps[3].title).toEqual('Direct Mapping');
            expect(steps[3].type).toEqual('direct-mapping');
            expect(steps[3].id).toEqual('direct-mapping');

            // Pivot config
            expect(steps[4].title).toEqual('Pivot Config');
            expect(steps[4].type).toEqual('pivot-config');
            expect(steps[4].id).toEqual('pivot-config');

            // Business Rule
            expect(steps[5].title).toEqual('Business Rules');
            expect(steps[5].type).toEqual('business-rules');
            expect(steps[5].id).toEqual('business-rules');
        });

        it('should not mark basic steps as removable', () => {
            expect(config.steps.length).toEqual(6);

            const steps = config.steps;

            config.steps.forEach((step) => {
                expect(step.removable).toBeFalsy();
            });
        });

        it('should add filters to the steps', () => {
            config.addFilter('default_value');
            config.addFilter('sql_expression');
            config.addFilter('multiparam');
            config.addFilter('sql_expression');
            config.addFilter('multiparam');
            config.addFilter('multiparam');

            expect(config.steps.length).toEqual(12);

            const { steps } = config;

            expect(steps[6].title).toEqual('Default Value');
            expect(steps[6].type).toEqual('default_value');
            expect(steps[6].id).toEqual('default_value_0');
            expect(steps[6].index).toEqual(0);
            expect(steps[6].removable).toBeTruthy();

            expect(steps[7].title).toEqual('SQL Expression');
            expect(steps[7].type).toEqual('sql_expression');
            expect(steps[7].id).toEqual('sql_expression_1');
            expect(steps[7].index).toEqual(1);
            expect(steps[7].removable).toBeTruthy();

            expect(steps[8].title).toEqual('Multiparam');
            expect(steps[8].type).toEqual('multiparam');
            expect(steps[8].id).toEqual('multiparam_2');
            expect(steps[8].index).toEqual(2);
            expect(steps[8].removable).toBeTruthy();

            expect(steps[9].title).toEqual('SQL Expression');
            expect(steps[9].type).toEqual('sql_expression');
            expect(steps[9].id).toEqual('sql_expression_3');
            expect(steps[9].index).toEqual(3);
            expect(steps[9].removable).toBeTruthy();

            expect(steps[10].title).toEqual('Multiparam');
            expect(steps[10].type).toEqual('multiparam');
            expect(steps[10].id).toEqual('multiparam_4');
            expect(steps[10].index).toEqual(4);
            expect(steps[10].removable).toBeTruthy();

            expect(steps[11].title).toEqual('Multiparam');
            expect(steps[11].type).toEqual('multiparam');
            expect(steps[11].id).toEqual('multiparam_5');
            expect(steps[11].index).toEqual(5);
            expect(steps[11].removable).toBeTruthy();
        });
    });

    describe('#businessRules', () => {
        beforeEach(() => {
            config.content = { filters: [] };
        });
        describe('when the config has no business rule filter', () => {
            it('returns empty object', () => {
                expect(config.businessRules).toEqual({});
            });
        });

        describe('when the config has a business rule filter', () => {
            beforeEach(() => {
                config.businessRules = { "Test": { columns: ['A', 'B', 'C'] } };
            });

            it('returns the business rules', () => {
                expect(config.businessRules).toEqual({ "Test": { columns: ['A', 'B', 'C'] } });
            });
        });
    });

    describe('#businessRules=', () => {
        beforeEach(() => {
            config.content = { filters: [] };
        });

        describe('when config already has business rules', () => {
            beforeEach(() => {
                config.content.filters.push({
                    filter_name: "get_business_rule_configurations",
                    params: {
                        "Test": { columns: ['A', 'B'] }
                    }
                });
            });

            it('updates the business rule', () => {
                expect(config.businessRules).toEqual({
                    "Test": { columns: ['A', 'B'] }
                });

                const newRules = { "Newtest": { columns: [1, 2, 3] }, "AnotherTest": "test value" };
                config.businessRules = newRules;

                expect(config.businessRules).toEqual(newRules);
                expect(config.content.filters).toEqual([{
                    filter_name: "get_business_rule_configurations",
                    params: newRules
                }]);
            });
        });

        describe('when config has no business rules', () => {
            it('adds the business rules', () => {
                expect(config.businessRules).toEqual({});
                expect(config.content.filters).toEqual([]);

                config.businessRules = { "Test": { columns: [1, 2, 3] } };

                expect(config.businessRules).toEqual({ "Test": { columns: [1, 2, 3] } });
                expect(config.content.filters).toEqual([{
                    filter_name: "get_business_rule_configurations",
                    params: { "Test": { columns: [1, 2, 3] } }
                }]);
            });
        });
    });

    describe('#filters', () => {
        beforeEach(() => {
            config.content = { filters: [] };
        });

        it('returns empty array when config has no filters', () => {
            expect(config.filters).toEqual([]);
        });

        describe('when config has filters', () => {
            beforeEach(() => {
                config.addFilter('default_value');
                config.addFilter('multiparam');
                config.addFilter('sql_expression');
                config.addFilter('sql_expression');
                config.addFilter('default_value');
            });

            it('returns list of all filters for the config', () => {
                expect(config.filters.length).toEqual(5);

                const { filters } = config;

                expect(filters[0].index).toEqual(0);
                expect(filters[0].filter).toEqual({
                    filter_name: 'default_value',
                    params: {}
                });

                expect(filters[1].index).toEqual(1);
                expect(filters[1].filter).toEqual({
                    filter_name: 'multiparam',
                    params: []
                });

                expect(filters[2].index).toEqual(2);
                expect(filters[2].filter).toEqual({
                    filter_name: 'sql_expression',
                    params: []
                });

                expect(filters[3].index).toEqual(3);
                expect(filters[3].filter).toEqual({
                    filter_name: 'sql_expression',
                    params: []
                });

                expect(filters[4].index).toEqual(4);
                expect(filters[4].filter).toEqual({
                    filter_name: 'default_value',
                    params: {}
                });
            });
        });
    });

    describe('#getFilter', () => {
        beforeEach(() => {
            config.content = { filters: [] };
        });

        it('returns empty array when config has no filters', () => {
            expect(config.getFilter('default_value')).toEqual([]);
        });

        describe('when config has filters', () => {
            beforeEach(() => {
                config.addFilter('default_value');
                config.addFilter('sql_expression');
                config.addFilter('multiparam');
            });

            it('returns empty array when index is not specified', () => {
                expect(config.getFilter('default_value')).toEqual([]);
            });

            it('returns params for the specified filter', () => {
                expect(config.getFilter('default_value', 0)).toEqual({});
                config.setFilter('default_value', 0, { test: 'test value' });
                expect(config.getFilter('default_value', 0)).toEqual({ test: 'test value' });
            });

            it('returns empty array when specified filter is not present on specified index', () => {
                config.setFilter('sql_expression', 1, [{ targetfieldname: 'Test', expr: 'test expression' }]);
                expect(config.getFilter('sql_expression', 1)).toEqual([{ targetfieldname: 'Test', expr: 'test expression' }]);
                expect(config.getFilter('sql_expression', 2)).toEqual([]);
                expect(config.getFilter('default_value', 1)).toEqual([]);
            });
        });
    });

    describe('#addFilter', () => {
        beforeEach(() => {
            config.content = { filters: [] };
        });

        it('adds the specified filter', () => {
            expect(config.filters.length).toEqual(0);
            config.addFilter('default_value');
            expect(config.filters.length).toEqual(1);
            expect(config.getFilter('default_value', 0)).toEqual({});
        });

        it('does not add invalid filters', () => {
            expect(config.filters.length).toEqual(0);
            config.addFilter('invalid');
            expect(config.filters.length).toEqual(0);
        });
    });

    describe('#removeFilter', () => {
        beforeEach(() => {
            config.content = { filters: [] };
            config.addFilter('default_value');
            config.addFilter('sql_expression');
        });

        it('removes the specified filter', () => {
            expect(config.filters.length).toEqual(2);
            config.removeFilter('default_value', 0);
            expect(config.filters.length).toEqual(1);
        });

        it('does not remove the filter if not in specified index', () => {
            expect(config.filters.length).toEqual(2);
            config.removeFilter('default_value', 2);
            expect(config.filters.length).toEqual(2);
            config.removeFilter('default_value', 1);
            expect(config.filters.length).toEqual(2);
        });
    });

    describe('#setFilter', () => {
        beforeEach(() => {
            config.content = { filters: [] };
            config.addFilter('default_value');
            config.addFilter('sql_expression');
        });

        it('updates the specified filter', () => {
            expect(config.getFilter('default_value', 0)).toEqual({});
            config.setFilter('default_value', 0, { test: 'test value' });
            expect(config.getFilter('default_value', 0)).toEqual({ test: 'test value' });
        });

        it('does not change the content when the filter name and index does not match', () => {
            expect(config.getFilter('default_value', 0)).toEqual({});
            config.setFilter('default_value', 1, { test: 'test value' });
            expect(config.getFilter('default_value', 0)).toEqual({});
        });
    });
});
