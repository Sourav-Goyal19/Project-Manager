// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDG3D8wgQUnmjrXpJhFr8Sk4mFfAaAwbJo",
    authDomain: "project-3-fbcbd.firebaseapp.com",
    projectId: "project-3-fbcbd",
    storageBucket: "project-3-fbcbd.appspot.com",
    messagingSenderId: "334123571331",
    appId: "1:334123571331:web:d810a8fdbd6edab04263b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const updateUserDatabase = async (user, uid) => {
    const docRef = doc(db, "users", uid);
    try {
        await setDoc(docRef, { ...user, uid });
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};

const updateProject = async (project, DocId, uid) => {
    const docRef = doc(db, "Projects", DocId);
    try {
        await setDoc(docRef, { ...project, DocId, uid });
    } catch (error) {
        console.log("Error storing user data:", error);
    }
};

const AddProjects = async (project, uid) => {
    try {
        const docRef = await addDoc(collection(db, "Projects"), { ...project, uid })
        await setDoc(docRef, { ...project, DocId: docRef?.id, uid })
        console.log("Project added with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding project:", error);
    }
};

const getUser = async (uid) => {
    const docRef = doc(db, "users", uid);
    try {
        const results = await getDoc(docRef);
        if (!results.exists()) return null;
        return results.data();
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};

const getImage = (file, progressCallback, errorCallback, urlCallback) => {
    const fileType = file?.type;
    const fileSize = file.size / 1024 / 1024;

    if (!fileType.includes('image')) {
        errorCallback("File must be an image")
        return;
    }
    if (fileSize > 100) {
        errorCallback("File size must be less than 15")
        return;
    }
    const storageRef = ref(storage, `image/${file.name}`)
    const task = uploadBytesResumable(storageRef, file);
    task.on(("state_changed"),
        (snapshot) => {
            progressCallback((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        },
        (err) => {
            errorCallback(err.message);
        },
        () => {
            getDownloadURL(storageRef).then((url) => {
                urlCallback(url);
            })
        }
    )
}

export { auth, app as default, db, updateUserDatabase, updateProject, AddProjects, getUser, getImage }
