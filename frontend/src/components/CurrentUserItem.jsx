import { Avatar, Box, IconButton, Menu, MenuItem, Typography, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { acceptInvite, getInvites, logoutUser } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { socket } from '../socket';

function CurrentUserItem(props) {
    const { user, invites } = props;
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(({ user }) => user.loading)
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const open = Boolean(anchorEl);
    console.log(user)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose();
        try {
            await dispatch(logoutUser()).unwrap();
            socket.emit('logout');
            toast.success('Çıkış Yapıldı!', {
                autoClose: 1500,
            });
            navigation('/');
        } catch (error) {
            console.log(error);
        }
    };

    const handleAcceptInvite = async (inviteId) => {
        try {

            await dispatch(acceptInvite({ inviteId, user })).unwrap();

            toast.success('Davet Kabul Edildi!', {
                autoClose: 1500,
            });
            handleDialogClose()
        } catch (error) {
            console.log(error);
            toast.error('Davet Kabul Edilemedi!', {
                autoClose: 1500,
            });
        }
    }

    const handleNotificationsClick = async () => {
        setDialogOpen(true);

        try {

            await dispatch(getInvites(user)).unwrap();

        } catch (error) {
            console.log(error);
        }

    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box display={'flex'} width={'100%'} p={1} alignItems={'center'}>
            <Box display={'flex'} width={'90%'} alignItems={'center'} justifyContent={'space-between'}>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}

                >
                    <MenuItem onClick={handleClose}>Profile Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
                <Box width={'2.2em'} dangerouslySetInnerHTML={{ __html: user.avatar }} />
                <Typography ml={2} color='white' variant='body1'>{user.username}</Typography>
                <Box>
                    <IconButton onClick={handleClick}>
                        <SettingsIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={handleNotificationsClick}>
                        <NotificationsIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Box>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <>
                    <DialogTitle>Notifications</DialogTitle>
                    <DialogContent>
                        {(loading ? (
                            <Box
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <CircularProgress></CircularProgress>
                            </Box>
                        ) : (
                            <List>
                                {invites?.map((invite, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={invite.senderData.username} />
                                        <IconButton
                                            onClick={() => handleAcceptInvite(invite.id)}
                                            edge="end" >
                                            <CheckIcon sx={{ color: 'green' }} />
                                        </IconButton>
                                        <IconButton edge="end" >
                                            <CloseIcon sx={{ color: 'red' }} />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        ))}
                    </DialogContent>
                </>

            </Dialog >
        </Box >
    );
}

export default CurrentUserItem;
