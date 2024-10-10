export const roomNameGenerator = (user1, user2) => {
    if (!user1 || !user2) {
        return "Unknown Room";
    }

    const arr = [user1.id, user2.id];
    const roomName = arr.sort().join(':');
    return roomName;
}
