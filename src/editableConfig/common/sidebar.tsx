import * as React from 'react';
import { assign, concat } from 'lodash';

import { Drawer, ListItem, RaisedButton, IconButton } from 'material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import theme from '../../theme';
import AddFilter from './addFilter';

interface ISidebarProps {
    menus: any[];
    selectedMenu: any;
    isOpen: boolean;
    onClick: (menu: any) => void;
    onAdd: (filterName: string) => void;
    onRemove: (menu: any) => void;
}

interface ISidebarState {
    currentMenu: any;
}

const style: {[key: string]: React.CSSProperties} = {
    drawer: {
        position: 'fixed',
        top: 108,
        bottom: 10,
        backgroundColor: theme.palette.accent1Color,
        zIndex: 1000,
        transition: 'width 0.5s ease-in-out',
        overflowY: 'auto',
        whiteSpace: 'nowrap',
        minHeight: 'calc(100% - 80px)',
        height: 'auto'
    },
    drawerOpen: { width: 220 },
    drawerClose: { width: 0 }
};

export default class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
    constructor(props, context) {
        super(props, context);

        this.getDrawerStyle = this.getDrawerStyle.bind(this);
        this.getItemStyle = this.getItemStyle.bind(this);
        this.visitMenu = this.visitMenu.bind(this);
        this.removeFilter = this.removeFilter.bind(this);

        this.state = {
            currentMenu: {}
        };
    }
    private getDrawerStyle(): React.CSSProperties {
        return this.props.isOpen ? assign({}, style.drawer, style.drawerOpen) : assign({}, style.drawer, style.drawerClose);
    }
    private getItemStyle(menu) {
        if (menu.id === this.props.selectedMenu.id) {
            return { color: theme.custom.leftAppBarDrawer.selectedColor, backgroundColor: theme.custom.leftAppBarDrawer.selectedBackgroundColor, opacity: 0.1 }; // To-Do pick the primary color from the theme
        }
        return { color: theme.custom.leftAppBarDrawer.color, backgroundColor: theme.custom.leftAppBarDrawer.backgroundColor }; // To-Do set the color in theme
    }
    private visitMenu(menu) {
        if (menu.id) {
            this.props.onClick(menu);
        }
    }
    private removeFilter(menu) {
        this.props.onRemove(menu);
    }
    public render(): JSX.Element {
        const menus = this.props.menus.map((menu: any, index: number) => {
            return <ListItem
                key={menu.id}
                primaryText={menu.title}
                style={this.getItemStyle(menu)}
                onClick={() => this.visitMenu(menu)}
                disabled={menu.disabled}
                rightIconButton={menu.removable ? <IconButton onClick={() => this.removeFilter(menu)}><ClearIcon /></IconButton> : <span />}
            />;
        });

        // Add add-filter button
        menus.push(<ListItem
            key={'add-filter'}
            primaryText={''}
            style={this.getItemStyle({})}
            onClick={() => this.visitMenu({})}
        >
            <AddFilter onAdd={this.props.onAdd} />
        </ListItem>);
        return <Drawer open={true} zDepth={0} containerStyle={this.getDrawerStyle()}>
            {...menus}
        </Drawer>;
    }
}
