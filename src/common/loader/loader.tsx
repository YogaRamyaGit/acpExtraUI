import * as React from 'react';
import { CircularProgress } from 'material-ui';

import { connect } from 'react-redux';

import style from './loaderStyles';

interface ILoaderProps {
    loaderCount: number;
}

const Loader = (props: ILoaderProps) => {
    return (<div>
        {props.loaderCount > 0 && <div style={style.container}>
            <CircularProgress size={60} thickness={7} style={style.loader} />
        </div>}
    </div>);
};

const mapStateToProps = (state) => {
    return ({
        loaderCount: state.loaderCount
    });
};

export default connect(mapStateToProps)(Loader);
