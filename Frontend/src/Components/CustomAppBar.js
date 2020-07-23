import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer,
         AppBar,
         Toolbar,
         Typography,
         IconButton,
         Divider 
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuList from './MenuList';



const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  typ:{
    paddingRight:'3em'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function CustomAppBar(props) {
  const classes = useStyles();
  //const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  

  const handleDrawerOpen = () => {
    if((props.menu.states.length!==0 || props.menu.airport.length!==0) || props.menu.device.length!==0)
      setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
   <React.Fragment>  
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      {
        ((props.menu.states.length===0 && props.menu.airport.length===0) && props.menu.device.length===0)?null:(
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
              }),
            }}
          > 
          <div className={classes.toolbar}>
            <Typography variant="h6" noWrap align="center" className={classes.typ} >Menu</Typography>  
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <MenuList menu={props.menu} headers={props.headers} navOpen={handleDrawerOpen}/>
        </Drawer>
        )
      }
    </React.Fragment>    
  );
}
