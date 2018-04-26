/** @type {{container: React.CSSProperties, loader: React.CSSProperties}} */
const style = {
    container: {
        position: 'fixed' as 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 1200,
        backgroundColor: 'rgba(0,0,0,0.2)',
        top: 0,
        left: 0
    },
    loader: { top: '50vh', left: '48vw' }
};

export default style;
