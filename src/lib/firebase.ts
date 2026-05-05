import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc, getDocFromServer, initializeFirestore, setLogLevel } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json" with { type: "json" };

// Suppress benign grpc idle connection warnings
setLogLevel('error');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use initializeFirestore with long polling to avoid WebSocket issues in restricted environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Connection Test
async function testConnection() {
  try {
    console.log("Testing Firestore connection...");
    // Just try to get a document, even if it doesn't exist
    await getDocFromServer(doc(db, 'subscribers', 'test_connection'));
    console.log("Firestore connection verified.");
  } catch (error: any) {
    // Permission denied is actually a good sign - it means we reached the server
    if (error.code === 'permission-denied') {
      console.log("Firestore connection verified (Permission denied as expected).");
      return;
    }
    console.error("Firestore Connection Test Error:", error.code, error.message);
    if (error.message?.includes('offline') || error.code === 'unavailable') {
      console.error("CRITICAL: Firestore is offline. This usually means the configuration in firebase-applet-config.json is incorrect or the database is not provisioned.");
    }
  }
}
testConnection();

// Error Handling Helper
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
} as const;

export type OperationType = typeof OperationType[keyof typeof OperationType];

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    }
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Helpers
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);

// Firestore Helpers
export const addSubscriber = async (email: string, name: string) => {
  try {
    await addDoc(collection(db, "subscribers"), {
      email,
      name,
      joinedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.CREATE, 'subscribers');
  }
};

export const getSubscribers = async () => {
  try {
    const q = query(collection(db, "subscribers"), orderBy("joinedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, 'subscribers');
  }
};

export const removeSubscriber = async (id: string) => {
  try {
    await deleteDoc(doc(db, "subscribers", id));
    return { success: true };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.DELETE, `subscribers/${id}`);
  }
};
