import React from "react";
import { fade, makeStyles,ThemeProvider,createMuiTheme } from "@material-ui/core/styles";
import {AppBar, Toolbar ,Typography,InputBase,CssBaseline,List,Drawer,IconButton , ListItem ,ListItemIcon,ListItemText,Button ,MenuItem ,Paper,Grid, useTheme} from "@material-ui/core";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import CreateIcon from '@material-ui/icons/Create';
import Menu from '@material-ui/core/Menu';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import LocalAirportOutlinedIcon from '@material-ui/icons/LocalAirportOutlined';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import PublishIcon from '@material-ui/icons/Publish';
import Switch from '@material-ui/core/Switch';
import FullScreenDialog from './Agartala Airport';
import FullScreenDialog1 from './Indore Airport';
import FullScreenDialog2 from './Kolkata Airport';
import FullScreenDialog11 from './Area1.js';
import FullScreenDialog12 from './Area2.js';
import FullScreenDialog13 from './Area3.js';
import FullScreenDialog14 from './Area4.js';
import FullScreenDialog15 from './Area5.js';
import FullScreenDialog16 from './Area6.js';
import Slide from '@material-ui/core/Slide';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  grow: {
    flexGrow: 1
  },

  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch"
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  button: {
    margin: theme.spacing(1)
  }
}));
const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <FavoriteIcon />, name: 'Like' },
];



export default function PrimarySearchAppBar() {
  
  const classes = useStyles();
  const theme = useTheme();
const [darkMode,setDarkMode] =React.useState(false);
const darkTheme = createMuiTheme({
  
  palette: {
    type :"dark",
    primary:{
      
      main:'#000000',

    },
    secondary:{
      
      main:'#ffffff',
      
    },
  },
});
const lightTheme = createMuiTheme({
  
  palette: {
    type :"light",
    primary:{
      
      main:'#2196f3',

    },
    secondary:{
      
      main:'#2196f3',
      
    },
  },
});
  const [open, setOpen] = React.useState(false);
  

  const [close, setClose] = React.useState(false);
  const handleClick = () => {
    setClose(!close);
  };
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const [hidden, setHidden] = React.useState(false);

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
     
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          
            <AccessAlarmIcon />
          
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton  color="inherit">
          
            <CreateIcon />
          
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem>
        <IconButton  color="inherit">
          
            <BrightnessMediumIcon/>
          
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
    </Menu>
  );

  return (
    
    <ThemeProvider theme={darkMode? darkTheme : lightTheme}>
<Paper  >
  <Grid container direction="column">
    <div className={classes.root}>
      <CssBaseline />
     
      <Button onClick={handleVisibility}>Toggle Speed Dial</Button>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
      <div className={classes.grow}>
        <AppBar
        
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Dashboard
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
         
           
            Light<Switch checked ={darkMode} onChange={ ()=> setDarkMode(!darkMode)}/>Dark
           
          </div>
         
          </Toolbar>
          
        </AppBar>
      </div>
      <Drawer
      
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
       
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
       
      >
         
        <div className={classes.toolbar} varient = "container" color = "primary">
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>

        <List>
          
            
          
          {["Home"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {<HomeIcon color="secondary"/> }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}

            <ListItem button onClick={handleOpen}>
              <ListItemIcon>
                {<LocalAirportOutlinedIcon color="secondary"/>}
              </ListItemIcon>
              <ListItemText primary="Airports" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              
              <MenuItem>
                <ListItem>
                   <ListItemIcon>
                     <FullScreenDialog/>
                   </ListItemIcon>
                </ListItem>
              </MenuItem>
                
            
              <MenuItem>
                <ListItem >
                  <ListItemIcon>
                    <FullScreenDialog1/>
                  </ListItemIcon>
                </ListItem>
              </MenuItem>
                 
              
              <MenuItem>
                <ListItem>
                  <ListItemIcon>
                    <FullScreenDialog2/>
                  </ListItemIcon>
                </ListItem>
              </MenuItem> 
                 
                
              
            </List>
          </Collapse>
            
        
         
        

        <ListItem  button onClick={handleOpen}>
              <ListItemIcon>
                {<DeviceHubIcon color="secondary"/>}
              </ListItemIcon>
              <ListItemText primary= "Devices"/>
              {open? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            
            <MenuItem >
              <ListItem>
                <ListItemIcon>
                 <FullScreenDialog11/>
                </ListItemIcon>
                
              </ListItem>
              </MenuItem>
              
              <MenuItem>
              <ListItem>
                <ListItemIcon>
                  <FullScreenDialog12/>
                </ListItemIcon>
                </ListItem>
              </MenuItem>

              <MenuItem>
              <ListItem>
                <ListItemIcon>
                  <FullScreenDialog13/>
                </ListItemIcon>
               </ListItem>
              </MenuItem>
             
            <MenuItem>
              <ListItem>
                <ListItemIcon>
                  <FullScreenDialog14/>
                </ListItemIcon>
              </ListItem>
            </MenuItem>

              <MenuItem>
              <ListItem>
                <ListItemIcon>
                  <FullScreenDialog15/>
                </ListItemIcon>
              </ListItem>
              </MenuItem>

             <MenuItem>
              <ListItem>
                <ListItemIcon>
                  <FullScreenDialog16/>
                </ListItemIcon>
              </ListItem>
            </MenuItem>

            </List>
          </Collapse>
          



          {["Upload"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {<PublishIcon color="secondary"/> }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
         
        </List>
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
    </div>
    </Grid>
    </Paper>
    </ThemeProvider>
  );
}
