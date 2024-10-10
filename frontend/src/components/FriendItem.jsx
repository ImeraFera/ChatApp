import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'

function FriendItem(props) {

    const { username, avatar } = props;

    return (

        <Box
            display={'flex'}
            width={'100%'}
        >
            <Box display={'flex'}
                p={1}
                alignItems={'center'}
            >
                <Box
                    width={'2.2em'}
                    dangerouslySetInnerHTML={{ __html: avatar }} />
                <Typography color='white' ml={2} variant='body1'>
                    {username}
                </Typography>
            </Box>
        </Box>
    )
}

export default FriendItem