const style: {[key: string]: React.CSSProperties} = {
    container: {
        display: 'flex'
    },
    radioButton: {
        width: '20%',
        display: 'inline-block'
    },
    error: {
        position: 'relative',
        bottom: 7,
        fontSize: 12,
        color: 'rgb(244, 67, 54)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    },
    radioLabel: {
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: 14
    },
    formContent: {
        padding: 5
    }
};

export default style;
