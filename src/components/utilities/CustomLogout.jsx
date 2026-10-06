import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { persistor } from "../../redux/AppStore";
import { resetClearCurrentUserRedux } from "../../redux/CurrentUser";

const CustomLogout = async () => {
  const dispatch = useDispatch();
  try {
    const auth = getAuth();
    const firebaseUser = auth?.currentUser; // Check for Firebase authenticated user

    // Sign out from Firebase only if a user is authenticated
    if (firebaseUser) {
      await signOut(auth);
    }

    // Clear persisted storage
    await persistor.purge();

    // Dispatch Redux action to reset user state
    dispatch(resetClearCurrentUserRedux());
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export default CustomLogout;
