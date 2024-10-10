import React from 'react'
import { Avatar, Badge, Box, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';


function FriendListItem(props) {
    const { username, avatar, } = props.user;
    const isOnline = props.isOnline;

    return (

        <Box width={'100%'}
            display={'flex'}
        >
            <Box
                display={'flex'}
                p={1}
                alignItems={'center'}
            >
                <Box display={'flex'}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                            '& .MuiBadge-dot': {
                                backgroundColor: isOnline ? 'green' : 'gray',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                            }
                        }}
                    >

                        <Box
                            width={'4em'}
                            dangerouslySetInnerHTML={{ __html: avatar }} />

                    </Badge>
                </Box>

                <Box display={'flex'} flexDirection={'column'}>
                    <Typography color='white' ml={2} variant='body1' >
                        {username}
                    </Typography>
                    <Typography color='white' ml={2} variant='caption' >new message</Typography>
                </Box>


            </Box>

        </Box>
    )
}

export default FriendListItem