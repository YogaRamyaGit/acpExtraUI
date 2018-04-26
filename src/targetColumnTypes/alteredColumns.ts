export default [
    {
        "name": "ID_TYP_CD",
        "type": "varchar",
        "nominal_values": ["SSN", "MEMID", "EMPID"]

    },
    {
        "name": "ID_TYP_NM",
        "type": "varchar",
        "nominal_values":
        [
            "Social Security number",
            "Benefit Plan Member ID",
            "Employee ID"
        ]

    },
    {
        "name": "RECEIVE_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "RX_WRITTEN_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "PHARMACY_SUBMIT_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "CHECK_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "BILLING_CYCLE_END_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "SERV_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "SERV_FROM_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "SERV_TO_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "ADJUDICATION_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "ACTIVITY_PAID_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "BILLED_AMT",
        "type": "decimal"
    },
    {
        "name": "NOT_COV_AMT",
        "type": "decimal"
    },
    {
        "name": "DED_AMT",
        "type": "decimal"
    },
    {
        "name": "PHARMACY_PMT_AMT",
        "type": "decimal"
    },
    {
        "name": "PHARMACY_COPAY_AMT",
        "type": "decimal"
    },
    {
        "name": "PHARMACY_COINSURANCE_AMT",
        "type": "decimal"
    },
    {
        "name": "PHARMACY_PERIODIC_DED_AMT",
        "type": "decimal"
    },
    {
        "name": "PHARMACY_OOP_APPLIED_AMT",
        "type": "decimal"
    },
    {
        "name": "DRUG_AVG_WHOLESALE_UNIT_PRICE_AMT",
        "type": "decimal"
    },
    {
        "name": "DRUG_FLAT_SALES_TAX_PAID_AMT",
        "type": "decimal"
    },
    {
        "name": "DUE_TO_PHARMACY_NET_AMT",
        "type": "decimal"
    },
    {
        "name": "COB_PRI_PAYER_PMT_AMT",
        "type": "decimal"
    },
    {
        "name": "COB_PRI_PAYER_COPAY_AMT",
        "type": "decimal"
    },
    {
        "name": "DRUG_BRAND_ATTRIBUTION_AMT",
        "type": "decimal"
    },
    {
        "name": "TOTAL_AMT_PAID_BY_ALL_SOURCES",
        "type": "decimal"
    },
    {
        "name": "INGREDIENT_COST_PAID_AMT",
        "type": "decimal"
    },
    {
        "name": "DISPENSING_FEE_PAID_AMT",
        "type": "decimal"
    },
    {
        "name": "AMT_ATTRIBUTED_TO_SALES_TAX",
        "type": "decimal"
    },
    {
        "name": "ACCUMULATED_DED_AMT",
        "type": "decimal"
    },
    {
        "name": "VACCINE_ADMINISTRATION_FEE_PAID_AMT",
        "type": "decimal"
    },
    {
        "name": "INGREDIENT_COST_SUBMITTED_AMT",
        "type": "decimal"
    },
    {
        "name": "USUAL_AND_CUSTOMARY_CHRG_AMT",
        "type": "decimal"
    },
    {
        "name": "PERCENTAGE_SALES_TAX_AMT_PAID",
        "type": "decimal"
    },
    {
        "name": "CLIENT_PMT_AMT",
        "type": "decimal"
    },
    {
        "name": "MAX_EXCEEDING_PERIODIC_BENEFIT_AMT",
        "type": "decimal"
    },
    {
        "name": "MAIL_INCENTIVE_FEE_AMT",
        "type": "decimal"
    },
    {
        "name": "PROV_TYP_CD",
        "type": "varchar",
        "nominal_values": [
            "BILLING",
            "SERV"
        ]
    },
    {
        "name": "PROV_TYP_NM",
        "type": "varchar",
        "nominal_values": [
            "Billing Provider",
            "Servicing Provider"
        ]
    },
    {
        "name": "SSN",
        "type": "NUMBER"
    },
    {
        "name": "ID",
        "type": "NUMBER"
    },
    {
        "name": "GENDER",
        "type": "varchar",
        "nominal_values": ["M", "F"]
    },
    {
        "name": "BIRTH_DT",
        "type": "birthdate",
        "format": "%Y-%m-%d"
    },
    {
        "name": "DEATH_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "ACTIVITY_PAID_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "START_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "END_DT",
        "type": "datetime",
        "format": "%Y-%m-%d"
    },
    {
        "name": "COINSURANCE_AMT",
        "type": "decimal"
    },
    {
        "name": "COPAY_AMT",
        "type": "decimal"
    },
    {
        "name": "COV_AMT",
        "type": "decimal"
    },
    {
        "name": "NET_PAID_AMT",
        "type": "decimal"
    },
    {
        "name": "WOULD_PAY_AMT",
        "type": "decimal"
    },
    {
        "name": "OTHER_INS_AMT",
        "type": "decimal"
    },
    {
        "name": "PROV_DISC_AMT",
        "type": "decimal"
    },
    {
        "name": "MEDICARE_AMT",
        "type": "decimal"
    },
    {
        "name": "TAX_AMT",
        "type": "decimal"
    },
    {
        "name": "PAYMENT_AMT",
        "type": "decimal"
    },
    {
        "name": "EOB_PAID_AMT",
        "type": "decimal"
    },
    {
        "name": "EOB_COVG_AMT",
        "type": "decimal"
    },
    {
        "name": "LINE_NUM",
        "type": "number",
        "nominal_values": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"]
    },
    {
        "name": "ADJ_IND",
        "type": "number"
    },
    {
        "name": "AUTH_IND",
        "type": "number"
    },
    {
        "name": "REPLACEMENT_CLM_NUM",
        "type": "number"
    },
    {
        "name": "REPLACEMENT_LINE_NUM",
        "type": "number"
    },
    {
        "name": "UNIT_DERIVED_CNT",
        "type": "number"
    },
    {
        "name": "WORKFLOW_RUN_ID",
        "type": "number",
        "autoPopulated": true
    },
    {
        "name": "CUSTOMER_CD",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "DATA_PARTNER_CD",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "FEED_TYPE_CD",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "FILENAME_NM",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "EXTRACTION_DT",
        "type": "datetime",
        "autoPopulated": true
    },
    {
        "name": "ERROR_CD",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "ERROR_DESC",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "RECORD_SEV",
        "type": "number",
        "autoPopulated": true
    },
    {
        "name": "STATUS_CD",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "CREATED_BY",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "CREATED_DT",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "UPDATED_DT",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "UPDATED_BY",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "RANK",
        "type": "number",
        "autoPopulated": true
    },
    {
        "name": "RECORD_HASH",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "SOURCE_LINE_NUM",
        "type": "number",
        "autoPopulated": true
    },
    {
        "name": "EFF_START_DT",
        "type": "varchar",
        "autoPopulated": true
    },
    {
        "name": "EFF_END_DT",
        "type": "number",
        "autoPopulated": true
    },
    {
        "name": "ADJ_IND",
        "type": "number"
    }
];

// Used for date transforms
export const dateColumnTypes = [
    'date',
    'datetime',
    'birthdate'
];

// Used for overpunch
export const decimalColumnTypes = [
    'decimal',
    'overpunch'
];

export const numberColumnTypes = [
    'number'
];

export const specialColumnTypes = [
    'date',
    'datetime',
    'birthdate',
    'decimal',
    'number'
];
