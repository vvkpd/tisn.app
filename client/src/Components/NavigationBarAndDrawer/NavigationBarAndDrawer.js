import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import CategoryIcon from '@material-ui/icons/Category';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Link from '@material-ui/core/Link';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import i18n from '../../i18n';

import { getUser, getNotifications } from '../../logic/api';
import { classifyNotifications } from '../../logic/utils';
import { logOut } from '../../logic/auth';

import { useUser, useSetUser } from '../UserProvider/UserProvider';
import {
  useNotifications,
  useSetNotifications,
} from '../NotificationsProvider/NotificationsProvider';
import { useToggleTheme } from '../ThemeProvider/ThemeProvider';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const HideOnScroll = (props) => {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const NavigationBarAndDrawer = (props) => {
  const { container } = props;

  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const style = Style();

  const user = useUser();
  const setUser = useSetUser();
  const notifications = useNotifications();
  const setNotifications = useSetNotifications();
  const toggleTheme = useToggleTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logUserOut, setLogUserOut] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getUser()
      .then((data) => {
        if (data.error || data.errors) {
          setLogUserOut(true);
        } else {
          setUser(data.user);
          setLoading(false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [setUser]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);

      if (user.preferredLocale !== i18n.language) {
        i18n.changeLanguage(user.preferredLocale);
      }

      getNotifications()
        .then((data) =>
          setNotifications(classifyNotifications(data.notifications))
        )
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [user, setNotifications]);

  useEffect(() => {
    if (logUserOut) {
      setUser(null);
      logOut();
      history.push('/welcome');
    }
  }, [logUserOut, setUser, history]);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawer = user && (
    <Fragment>
      <List>
        <ListItem
          button
          onClick={() => {
            history.push(`/users/${user._id}`);
            handleDrawerToggle();
          }}
        >
          <ListItemAvatar>
            <Avatar
              src={user.avatar}
              alt={t('navigationBarAndDrawer.avatar', { name: user.name })}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.home')} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/events');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.events')} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            history.push('/events/mine');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.myEvents')} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            history.push('/events/new');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.createEvent')} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/users');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.users')} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            history.push(`/users/${user._id}`);
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.myProfile')} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push('/interests');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.interests')} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setLogUserOut(true);
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigationBarAndDrawer.logOut')} />
        </ListItem>
      </List>
    </Fragment>
  );

  return (
    <Fragment>
      <HideOnScroll {...props}>
        <AppBar color={theme.palette.type === 'dark' ? 'inherit' : 'primary'}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Link variant="h4" color="inherit" underline="none" href="/">
              Tisn
            </Link>
            <div className={style.grow} />
            <IconButton edge="end" color="inherit" onClick={toggleTheme}>
              {theme.palette.type === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => history.push('/chats')}
            >
              <Badge
                badgeContent={notifications && notifications.message.length}
                color="secondary"
              >
                <ChatIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => history.push('/notifications')}
            >
              <Badge
                badgeContent={notifications && notifications.regular.length}
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      {!loading && user && (
        <SwipeableDrawer
          anchor="left"
          container={container}
          open={drawerOpen}
          onOpen={handleDrawerToggle}
          onClose={handleDrawerToggle}
          classes={{
            paper: style.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </SwipeableDrawer>
      )}
      {error && <ErrorSnackbar error={error} />}
    </Fragment>
  );
};

export default NavigationBarAndDrawer;
