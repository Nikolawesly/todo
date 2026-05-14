import { useForm } from "react-hook-form";
import { useContext } from "react";
import { loginContextObj } from "./LoginContext";
import axios from "axios";

function CreateTask() {
  let { currentUser, setCurrentUser } = useContext(loginContextObj);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitNewtask = async (newTask) => {
    console.log(newTask);
    try {
      let res = await axios.put(`http://localhost:8000/user-api/todo/${currentUser._id}`, newTask, {
        withCredentials: true,
      });
      console.log("res is ", res);
      if (res.data.message === 'todo added') {
        setCurrentUser(res.data.payload);
        reset(); // Clear form after successful submission
      }
    } catch (err) {
      // Handle offline mode
      if (!err.response) {
        const newTaskWithId = {
          _id: Date.now().toString(),
          taskName: newTask.taskName,
          description: newTask.description,
          status: "pending"
        };
        const updatedUser = {
          ...currentUser,
          todos: [...(currentUser.todos || []), newTaskWithId]
        };
        setCurrentUser(updatedUser);
        reset(); // Clear form
      } else {
        console.log("Error creating task:", err.response?.data?.message);
      }
    }
  };

  return (
    <div>
      <h1>Create Task</h1>
      <form className="w-50 mx-auto mt-3" onSubmit={handleSubmit(onSubmitNewtask)}>
        <div className="mb-3">
          <input 
            type="text" 
            {...register("taskName", { required: true })} 
            className="form-control" 
            placeholder="Task Name" 
          />
          {!!errors?.taskName && <p className="text-danger">Task name is required</p>}
        </div>
        <div className="mb-3">
          <input 
            type="text" 
            {...register("description", { required: true })} 
            className="form-control" 
            placeholder="Task Description" 
          />
          {!!errors?.description && <p className="text-danger">Task Description is required</p>}
        </div>
        <button type="submit" className="btn btn-info">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateTask;