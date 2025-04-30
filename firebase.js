// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
  authDomain: "memewar-canvas.firebaseapp.com",
  projectId: "memewar-canvas",
  storageBucket: "memewar-canvas.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890",
  measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
const canvasItemsCollection = collection(db, 'canvasItems');

// Function to add a new canvas item
export const addCanvasItem = async (item) => {
  try {
    const docRef = await addDoc(canvasItemsCollection, {
      ...item,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding canvas item: ", error);
    throw error;
  }
};

// Function to listen for canvas items updates
export const subscribeToCanvasItems = (callback) => {
  const q = query(canvasItemsCollection, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snapshot) => {
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    callback(items);
  }, (error) => {
    console.error("Error subscribing to canvas items: ", error);
  });
};

// Function to get all canvas items once
export const getCanvasItems = async () => {
  try {
    const q = query(canvasItemsCollection, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error("Error getting canvas items: ", error);
    throw error;
  }
};

export { db };