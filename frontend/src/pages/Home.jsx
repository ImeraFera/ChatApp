
import { Box, Button, CardActionArea, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, IconButton, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import CurrentUserItem from '../components/CurrentUserItem'
import FriendListItem from '../components/FriendListItem'
import FriendItem from '../components/FriendItem'
import SendIcon from '@mui/icons-material/Send';
import { useFormik } from 'formik'
import AddIcon from '@mui/icons-material/Add';
import MessageItem from '../components/MessageItem'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useDispatch, useSelector } from 'react-redux'
import { getUserFriends } from '../redux/slices/userSlice'
import { roomNameGenerator } from '../utils/roomNameGenerator';
import { socket } from '../socket'
import EmojiPicker, { Emoji } from 'emoji-picker-react'


import { sendInvite } from '../redux/slices/userSlice'
import { toast } from 'react-toastify'
import { getInvites } from '../redux/slices/userSlice'
const CustomTextField = ({ label, ...props }) => (
    <TextField
        label={label}
        color='secondary'
        size='small'
        variant='filled'
        autoComplete='off'
        placeholder='Message ...'
        sx={{
            '& .MuiInputBase-input': {
                color: 'white',
            },
            '& .MuiInputLabel-root': {
                color: 'white',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
            },
        }}
        {...props}
    />
);

function Home() {
    const loading = useSelector(({ user }) => user.loading)
    const user = useSelector(({ user }) => user.currentUser);
    const friends = useSelector(({ user }) => user.friends)
    const invites = useSelector(({ user }) => user.invites)
    const [openChat, setopenChat] = useState(false);
    const [selectedFriend, setselectedFriend] = useState(null);
    const [messages, setmessages] = useState([]);
    const [message, setmessage] = useState({});
    const [roomName, setroomName] = useState(null);
    const [openEmojiPicker, setopenEmojiPicker] = useState(false);
    const [onlineUsers, setonlineUsers] = useState([]);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dialogFormik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: async (values) => {

            try {

                await dispatch(sendInvite({ sender: user, receiver: values.email })).unwrap();
                toast.success('Arkadaşlık Daveti Gönderildi!', {
                    autoClose: 1500,
                });

            } catch (error) {
                console.log(error);

                toast.error('Arkadaşlık Daveti Gönderilemedi!', {
                    autoClose: 1500,
                });
            }

        }
    })

    useEffect(() => {
        scrollToBottom();

    }, [messages])


    const handleJoinRoom = (friend) => {
        if (user && friend) {
            const generatedRoomName = roomNameGenerator(user, friend);
            setroomName(generatedRoomName);
            setselectedFriend(friend);
            setopenChat(true);
        }
    };

    useEffect(() => {
        if (roomName) {
            socket.emit('join_room', { roomName, user });
        }
    }, [roomName]);

    const sendMessage = () => {
        const messageContent = message.content.trim();
        if (messageContent !== '') {

            const currentTime = new Date();
            const hours = String(currentTime.getHours()).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');

            socket.emit('send_message', {
                sender: user,
                receiver: selectedFriend,
                content: messageContent,
                roomName,
                time: `${hours}:${minutes}`,
            });

            setmessage({ content: '' });
        }
    };


    useEffect(() => {
        const handleReceiveMessage = (message) => {
            console.log(message);
            setmessages((prevMessages) => [...prevMessages, message]);

        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, []);



    useEffect(() => {

        socket.connect();
        socket.emit('user_connected', user);

        socket.on('online_users', (data) => {
            console.log('online users: ', data);
            setonlineUsers(data);
        })

        return () => {
            socket.off('online_users');
        };

    }, [])



    useEffect(() => {
        dispatch(getUserFriends(user));
    }, [])

    return (

        <Grid2
            height={'90vh'}
            container
            sx={{
                backdropFilter: 'blur(1px)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
            mt={4}
        >
            <Grid2 size={3}>
                <CurrentUserItem
                    user={user}
                    invites={invites}
                ></CurrentUserItem>
                <Divider sx={{ bgcolor: 'white' }}></Divider>
                <Box
                    p={2}
                >
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Add Friend</DialogTitle>
                        <DialogContent>
                            <form action=""
                                onSubmit={dialogFormik.handleSubmit}
                            >
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="name"
                                    name="email"
                                    label="Email Address"
                                    value={dialogFormik.values.email}
                                    onChange={dialogFormik.handleChange}
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                />
                            </form>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={dialogFormik.handleSubmit} type="submit">Send Invite</Button>
                        </DialogActions>
                    </Dialog>

                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <TextField
                            variant='outlined'
                            size='small'
                            color='secondary'
                            label='Search'
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'secondary.main',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '&:focused .MuiInputLabel-root': {
                                    color: 'secondary.main',
                                },
                            }}
                        >

                        </TextField>

                        <IconButton onClick={handleClickOpen}>
                            <AddIcon sx={{ color: 'white' }}></AddIcon>
                        </IconButton>
                    </Box>

                </Box>

                <Box mt={1}>
                    <Stack flexDirection={'column'} spacing={1}>
                        {(friends?.map((user, index) => {
                            return (
                                <CardActionArea
                                    key={index}
                                    onClick={() => handleJoinRoom(user)}>
                                    <FriendListItem
                                        user={user}
                                        isOnline={(onlineUsers.some((onlineUser) => onlineUser.id === user.id))}
                                    ></FriendListItem>
                                </CardActionArea>
                            )
                        }))}

                    </Stack>
                </Box>
            </Grid2>
            <Divider orientation='vertical' flexItem sx={{ bgcolor: 'white' }}></Divider>
            <Grid2 size={'grow'} display={'flex'} flexDirection={'column'}>

                {openChat ? (
                    <>
                        <FriendItem username={selectedFriend.username} avatar={selectedFriend.avatar}></FriendItem>
                        <Divider flexItem sx={{ bgcolor: 'white' }}></Divider>
                        <Box
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            height={'100%'}
                            width={'100%'}
                        >
                            <Stack
                                height={'75vh'}
                                width={'100%'}
                                sx={{
                                    overflowY: 'auto',
                                }}
                            >
                                {messages && messages.map((message, index) => (
                                    <MessageItem
                                        key={index}
                                        content={message.content}
                                        isMyMessage={message.sender.id === user.id}
                                    />
                                ))}
                                <div ref={messagesEndRef} />

                            </Stack>

                        </Box>
                        <Box display={'flex'} height={'100%'} alignItems={'flex-end'}>
                            <Box
                                display={'flex'}
                                width={'100%'}
                                bgcolor={'#874687'}
                            >
                                <CustomTextField
                                    type='text'
                                    name='message'
                                    id='message'
                                    value={message.content || ''}
                                    onChange={(e) => setmessage({ ...message, content: e.target.value })}
                                    fullWidth
                                />
                                <IconButton
                                    onClick={() => setopenEmojiPicker(!openEmojiPicker)}
                                >
                                    <EmojiEmotionsIcon sx={{ color: 'white' }}></EmojiEmotionsIcon>
                                </IconButton>
                                {openEmojiPicker && (
                                    <Dialog open={openEmojiPicker} onClose={() => setopenEmojiPicker(false)}>
                                        <EmojiPicker
                                            theme="dark"
                                            onEmojiClick={(e) =>
                                                setmessage((prevMessage) => ({
                                                    ...prevMessage,
                                                    content: prevMessage.content ? prevMessage.content + e.emoji : e.emoji,
                                                }))
                                            }
                                        />
                                    </Dialog>
                                )}
                                <IconButton
                                    onClick={sendMessage}
                                >
                                    <SendIcon sx={{ color: 'white' }}></SendIcon>
                                </IconButton>
                            </Box>

                        </Box>
                    </>
                ) : (
                    <>
                        <Box
                            height={'100%'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Typography
                                variant='h4'
                                color='lightgray'
                            >
                                You can select a user to send message.
                            </Typography>
                        </Box>
                    </>
                )}




            </Grid2>
            {/* <Divider orientation='vertical' flexItem sx={{ bgcolor: 'white' }}></Divider>

            <Grid2 size={3}>

            </Grid2> */}
        </Grid2>

    )

}

export default Home