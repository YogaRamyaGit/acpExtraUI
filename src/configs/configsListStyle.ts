/** @type {{header: React.CSSProperties, headerText: React.CSSProperties, sortableHeader: React.CSSProperties, sortButton: React.CSSProperties, datapartnerColumn: React.CSSProperties , actionButton: React.CSSProperties}} */

const style = {
    header: { backgroundColor: '#009688' },
    headerText: { fontSize: 16, color: 'white' },
    sortableHeader: { position: 'relative' as 'relative', top: -4, cursor: 'pointer' },
    sortButton: { top: 7 },

    dataPartnerColumn: {
        textTransform: 'UPPERCASE'
    },
    actionButton: {
        margin: '0 5px'
    }
};

export default style;
