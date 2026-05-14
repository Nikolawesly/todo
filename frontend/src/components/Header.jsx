import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { loginContextObj } from "./LoginContext";
import { CiLogin } from "react-icons/ci";
function Header() {
  const { loginStatus,userLogout } = useContext(loginContextObj);

  return (
    <div>
      <ul className="nav justify-content-end">
        {loginStatus === false ? (
          <>
            <li className="nav-item">
              
              <NavLink className="nav-link" to="">
                <CiLogin />Login
              </NavLink>

              
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="register">
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <NavLink className="nav-link" to="register" onClick={userLogout}>
              Logout
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Header;


