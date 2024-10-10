import { Box, Typography } from '@mui/material'
import React from 'react'

function MessageItem(props) {
    const { isMyMessage, content } = props;
    const time = new Date().getHours() + ':' + new Date().getMinutes()
    return (
        <Box
            display={'flex'}
            justifyContent={isMyMessage ? 'flex-end' : 'flex-start'}
            p={1}
            m={1}
        >
            <Box
                bgcolor={isMyMessage ? 'purple' : '#330033'}
                color={'white'}
                maxWidth={'75%'}
                p={2}
                borderRadius={isMyMessage ? '10px 10px 0px 10px' : '10px 10px 10px 0px'}
            >
                <Typography
                    variant='body1'
                >
                    {content}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{ display: 'block', textAlign: isMyMessage ? 'right' : 'left', marginTop: '8px' }}
                >
                    {time}
                </Typography>
            </Box>
        </Box >
    )
}

export default MessageItem;
