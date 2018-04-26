const style: { [key: string]: React.CSSProperties } = {
    radioButtonGroup: {
        display: 'flex' as 'flex',
        justifyContent: 'space-between' as 'space-between'
    },
    dropdown: { height: 54 },
    radioButton: { width: '20%' },
    table: { margin: '10px 0' },
    tableHeader: { backgroundColor: '#009688' },
    headerText: { fontSize: 16, color: 'white' },
    formContainer: { margin: '10px 0', display: 'block' },
    submitButtons: { display: 'flex' as 'flex', justifyContent: 'space-evenly' as 'space-evenly', marginTop: 28 },
    required: { color: 'red', margin: 2 }
};

export default style;
