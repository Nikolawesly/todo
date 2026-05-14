import { useContext, useState } from "react";
import { loginContextObj } from "./LoginContext";
import axios from "axios";
import { useForm } from "react-hook-form";

function TaskList() {
  const { currentUser, setCurrentUser } = useContext(loginContextObj);
  const { register, handleSubmit, setValue } = useForm();

  //modal state
  const [modalState, setModalState] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  const openModal = (task) => {
    setTaskBeingEdited(task);
    setValue("taskName", task.taskName);
    setValue("description", task.description);
    setModalState(true);
  };
  
  const closeModal = () => {
    setModalState(false);
  };
  
  const saveModifiedTask = async (modifiedTask) => {
    try {
      let res = await axios.put(
        `http://localhost:8000/user-api/edit-todo/userid/${currentUser._id}/taskid/${taskBeingEdited._id}`,
        modifiedTask,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setCurrentUser(res.data.payload);
        closeModal();
      }
    } catch (err) {
      // Handle offline mode
      if (!err.response) {
        const updatedTodos = currentUser.todos.map(todo => 
          todo._id === taskBeingEdited._id 
            ? { ...todo, taskName: modifiedTask.taskName, description: modifiedTask.description }
            : todo
        );
        setCurrentUser({ ...currentUser, todos: updatedTodos });
        closeModal();
      }
    }
  };
  
  const setTaskCompleted = async (taskid) => {
    try {
      let res = await axios.put(
        `http://localhost:8000/user-api/edit-status/userid/${currentUser._id}/taskid/${taskid}`,
        null,
        { withCredentials: true }
      );
      console.log(res);
      if (res.status === 200) {
        setCurrentUser(res.data.payload);
      }
    } catch (err) {
      // Handle offline mode
      if (!err.response) {
        const updatedTodos = currentUser.todos.map(todo => 
          todo._id === taskid ? { ...todo, status: "completed" } : todo
        );
        setCurrentUser({ ...currentUser, todos: updatedTodos });
      }
    }
  };

  //delete a task
  const deleteTask = async (taskid) => {
    try {
      let res = await axios.put(`http://localhost:8000/user-api/delete-todo/userid/${currentUser._id}/taskid/${taskid}`, null, { withCredentials: true });
      if (res.status === 200) {
        setCurrentUser(res.data.payload);
      }
    } catch (err) {
      // Handle offline mode
      if (!err.response) {
        const updatedTodos = currentUser.todos.filter(todo => todo._id !== taskid);
        setCurrentUser({ ...currentUser, todos: updatedTodos });
      }
    }
  };

  return (
    <div className="mt-4">
      <h1>List of Tasks</h1>
      {currentUser?.todos?.map((todoObj, index) => (
        <div key={index} className="mb-3 border border-2 p-3 position-relative">
          <div className="d-flex justify-content-between align-items-start">
            <button className="btn btn-info btn-sm" style={{width: '60px'}} onClick={() => openModal(todoObj)}>edit</button>
            <div className="text-end">
              <button className="btn btn-close" onClick={() => deleteTask(todoObj._id)}></button>
              <div className="mt-1">
                <button className="bg-warning border-0 rounded px-2 py-1" style={{fontSize: '12px'}}>{todoObj.status}</button>
              </div>
            </div>
          </div>
          <h2 className="mt-3">{todoObj.taskName}</h2>
          <small>{todoObj.description}</small>
          <div className="text-end mt-2">
            {todoObj.status === 'pending' && (
              <button className="btn btn-success btn-sm" style={{width: '120px'}} onClick={() => setTaskCompleted(todoObj._id)}>
                Mark as completed
              </button>
            )}
          </div>
        </div>
      ))}
      
      {/* Modal */}
      <div className={`modal fade ${modalState ? 'show' : ''}`} style={{ display: modalState ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Task</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(saveModifiedTask)}>
                <input type="text" {...register("taskName")} className="form-control mb-3" />
                <input type="text" {...register("description")} className="form-control mb-3" />
                <button type="submit" className="btn btn-success">save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;