
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';


export const avatarGenerator = (seed) => {

    const avatar = createAvatar(bottts, {
        seed,
    });

    return avatar.toString();
}