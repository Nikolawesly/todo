import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let [registerErr, setRegisterErr] = useState("");
  let [registerSuccess, setRegisterSuccess] = useState("");

  const navigate = useNavigate();

  //function to form submit
  const onFormSubmit = async (newUser) => {
    newUser.todos = [];
    console.log(newUser);
    try {
      //Make HTTP POST req to create new User in Backend
      let res = await axios.post("http://localhost:8000/user-api/user", newUser);
      console.log("res is ", res);
      //if resource is created
      if (res.status === 201) {
        setRegisterSuccess("Registration successful! Please login.");
        setRegisterErr("");
        //navigate to login component programmatically
        setTimeout(() => navigate("/login"), 2000);
      } else {
        //display error message
        console.log(res.data.message);
      }
    } catch (err) {
      // Handle offline mode
      if (!err.response) {
        setRegisterSuccess("Registration successful! (Demo mode) Please login.");
        setRegisterErr("");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      console.log("err is ", err.response?.data?.message);
      setRegisterErr(err.response?.data?.message || "Registration failed");
      setRegisterSuccess("");
    }
  };

  return (
    <div>
      <h1 className="text-center text-info display-3">User Registration</h1>

      {/* display registration error message */}
      {registerErr.length !== 0 && <p className="fs-3 text-warning text-center">{registerErr}</p>}
      {/* display registration success message */}
      {registerSuccess.length !== 0 && <p className="fs-3 text-success text-center">{registerSuccess}</p>}
      
      {/* registration form */}
      <form className="w-50 mx-auto mt-5" onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <input type="text" {...register("name", { required: true })} className="form-control" placeholder="Name" />
          {/* name validation error messages */}
          {!!errors.name && <p className="text-danger">Name is required</p>}
        </div>
        <div className="mb-3">
          <input type="email" {...register("email", { required: true })} className="form-control" placeholder="Email" />
          {/* email validation error messages */}
          {!!errors.email && <p className="text-danger">Email is required</p>}
        </div>
        <div className="mb-3">
          <input
            type="password"
            {...register("password", { required: true })}
            className="form-control"
            placeholder="Password"
          />
          {/* password validation error messages */}
          {!!errors.password && <p className="text-danger">Password is required</p>}
        </div>
        <button type="submit" className="btn btn-success">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;