import { createContext, useEffect, useState } from "react";
import axios from "axios";

//create context object
export const loginContextObj = createContext();

function LoginContext({ children }) {
  //state
  const [loginStatus, setLoginStatus] = useState(() => {
    const saved = localStorage.getItem('loginStatus');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginErrMessage, setLoginErrorMessage] = useState("");

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('loginStatus', JSON.stringify(loginStatus));
  }, [loginStatus]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  //user login
  const userLogin = async (userCredObj) => {
    try {
      let res = await axios.post("http://localhost:8000/user-api/login", userCredObj, {
        withCredentials: true
      });
      //if login success
      if (res.status === 200) {
        //update the user
        setCurrentUser(res.data.payload);
        setLoginStatus(true);
        setLoginErrorMessage("");
      }
    } catch (err) {
      // Handle offline mode or server not running
      if (!err.response) {
        // Mock login for demo purposes when backend is not available
        const mockUser = {
          _id: "demo123",
          name: "Demo User",
          email: userCredObj.email,
          todos: [
            {
              _id: "task1",
              taskName: "Sample Task",
              description: "This is a demo task",
              status: "pending"
            }
          ]
        };
        setCurrentUser(mockUser);
        setLoginStatus(true);
        setLoginErrorMessage("");
        return;
      }
      
      if (err.response?.status === 401) {
        setLoginStatus(false);
        setCurrentUser(null);
        setLoginErrorMessage("Invalid credentials");
        return;
      }
      console.log("err is ", err.response?.data?.message);
      setLoginErrorMessage(err.response?.data?.message || "Login failed");
    }
  };

  //user logout
  const userLogout = async () => {
    try {
      let res = await axios.get("http://localhost:8000/user-api/logout", { withCredentials: true });
      if (res.status === 200) {
        setLoginStatus(false);
        setCurrentUser(null);
        localStorage.removeItem('loginStatus');
        localStorage.removeItem('currentUser');
      }
    } catch (err) {
      // Handle offline logout
      setLoginStatus(false);
      setCurrentUser(null);
      localStorage.removeItem('loginStatus');
      localStorage.removeItem('currentUser');
    }
  };

  console.log("Current user is ", currentUser);
  console.log("login err is ", loginErrMessage);

  return (
    <loginContextObj.Provider value={{ loginStatus, currentUser, setCurrentUser, loginErrMessage, userLogin, userLogout }}>
      {children}
    </loginContextObj.Provider>
  );
}

export default LoginContext;