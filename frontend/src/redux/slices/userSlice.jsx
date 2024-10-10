import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import { addDoc, collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../../configs/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { avatarGenerator } from '../../utils/avatarGenerator';

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
    friends: [],
    invites: [],
};

export const acceptInvite = createAsyncThunk(
    'user/acceptInvite',
    async ({ user, inviteId },) => {
        console.log(inviteId, user)
        try {
            const inviteDoc = await getDoc(doc(db, 'invites', inviteId));

            if (!inviteDoc.exists()) {
                throw new Error('Davetiye bulunamadı');
            }

            await updateDoc(doc(db, 'invites', inviteId), { status: 'accepted' });
            console.log(inviteDoc.data())
            const friendId = inviteDoc.data().sender.id;

            await updateDoc(doc(db, 'users', user.id), { friends: arrayUnion(friendId) })
            await updateDoc(doc(db, 'users', friendId), { friends: arrayUnion(user.id) })

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

export const getInvites = createAsyncThunk(
    'user/getInvites',
    async (user) => {
        try {
            const userRef = doc(db, 'users', user.id);
            const invitesQuery = query(
                collection(db, 'invites'),
                where('status', '==', 'pending'),
                where('receiver', '==', userRef)
            );

            const querySnapshot = await getDocs(invitesQuery);
            const invites = [];

            for (const doc of querySnapshot.docs) {
                const inviteData = { id: doc.id, ...doc.data() };

                const senderRef = inviteData.sender;
                const senderDoc = await getDoc(senderRef);
                inviteData.senderData = senderDoc.exists() ? senderDoc.data() : null;

                const receiverRef = inviteData.receiver;
                const receiverDoc = await getDoc(receiverRef);
                inviteData.receiverData = receiverDoc.exists() ? receiverDoc.data() : null;

                invites.push(inviteData);
            }

            console.log(invites);
            return invites;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

export const sendInvite = createAsyncThunk(
    'user/sendInvite',
    async ({ sender, receiver }) => {

        try {

            const senderSnapshot = await getDoc(doc(db, 'users', sender.id));

            const receiverQuery = query(collection(db, "users"), where("email", "==", receiver));
            const querySnapshot = await getDocs(receiverQuery);

            if (!querySnapshot.empty) {
                const receiverDoc = querySnapshot.docs[0];

                const inviteData = {
                    sender: senderSnapshot.ref,
                    receiver: receiverDoc.ref,
                    status: 'pending',
                }

                const inviteRef = await addDoc(collection(db, "invites"), inviteData);

                console.log("Invite successfully sent with ID: ", inviteRef.id);
            } else {
                throw new Error("Receiver not found with the given email.");
            }



        } catch (error) {
            console.log(error);
            throw error;
        }


    }
)

export const getUserFriends = createAsyncThunk(
    'user/friends',
    async (user) => {
        try {
            const friendsList = [];

            for (const friendId of user.friends) {
                const friendDoc = await getDoc(doc(db, 'users', friendId));

                if (friendDoc.exists()) {
                    friendsList.push({ id: friendDoc.id, isOnline: false, ...friendDoc.data() });
                }
            }

            return friendsList;

        } catch (error) {
            console.error("Error fetching friends: ", error);
            throw error;
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async () => {

    }
);

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (values) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const uid = userCredential.user.uid;

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const user = userDoc.data();
                return user;
            }

        } catch (error) {
            console.log(error)
            throw error;
        }

    }
);

export const createUser = createAsyncThunk(
    'user/createUser',
    async (values) => {
        const { username, email, password } = values;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), {
                username: username,
                email: email,
                avatar: avatarGenerator(uid),
                id: uid,
                blocked: [],
                friends: [],
            });

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const getUserData = createAsyncThunk(
    'user/getUserData',
    async () => {

    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(acceptInvite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptInvite.fulfilled, (state, { payload }) => {
                state.loading = false;
            })
            .addCase(acceptInvite.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(getUserFriends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserFriends.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.friends = payload;
            })
            .addCase(getUserFriends.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.currentUser = null;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.currentUser = payload;
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.currentUser = payload;
            })
            .addCase(createUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(sendInvite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendInvite.fulfilled, (state, { payload }) => {
                state.loading = false;
            })
            .addCase(sendInvite.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(getInvites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInvites.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.invites = payload;
            })
            .addCase(getInvites.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
