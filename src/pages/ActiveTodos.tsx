import React, {useState, useEffect, useMemo} from "react"
import {AgGridReact} from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import "ag-grid-community/styles/ag-theme-material.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import NavBar from "../components/NavBar"
import custom_axios from "../axios/AxiosSetup"
import {getLoginInfo} from "../utils/LoginInfo"
import {toast} from "react-toastify"
import {ApiConstants} from "../api/ApiConstants"

interface ActiveTodoListProps {
  markCompelte: (id: number) => void
  deleteTodo: (id: number) => void
}

function ActiveTodos(props: ActiveTodoListProps) {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    console.log("Todos", todos)
  }, [todos])

  const title: any = React.useRef()

  const getAllNotCompletedTodos = async () => {
    try {
      const userId = getLoginInfo()?.userId
      if (userId !== null && userId !== undefined) {
        const response = await custom_axios.get(
          ApiConstants.TODO.FIND_NOT_COMPLETED(userId),
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        setTodos(response.data.data)
      } else {
        toast.info("Sorry you are not authenticated")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const saveTodo = async () => {
    if (title.current.value === "") {
      toast.info("Please Provide Title")
      return
    }
    const userId = getLoginInfo()?.userId
    if (userId != null) {
      const response = await custom_axios.post(
        ApiConstants.TODO.ADD(userId),
        {
          title: title.current.value,
        },
        {headers: {Authorization: "Bearer " + localStorage.getItem("token")}}
      )
      getAllNotCompletedTodos()
      title.current.value = ""
      toast.success("Todo Added Successfully!!")
    } else {
      toast.info("Sorry you are not authenticated")
    }
  }

  useEffect(() => {
    getAllNotCompletedTodos()
  }, [])

  const deleteTodo = async (todoId: number) => {
    console.log(todoId)
    if (todoId === undefined) {
      toast.error("todo Id is undefined")
      return
    }
    try {
      const response = await custom_axios.delete(
        ApiConstants.TODO.DELETE(todoId),
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      getAllNotCompletedTodos()

      toast.success("Todo Deleted Successfully!!")
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast.error("Error deleting todo.")
    }
  }

  const markComplete = async (todoId: number) => {
    console.log(todoId)
    if (todoId === undefined) {
      toast.error("todo Id is undefined")
      return
    }
    try {
      const response = await custom_axios.patch(
        ApiConstants.TODO.MARK_COMPLETE(todoId),
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      getAllNotCompletedTodos()
      toast.success("Todo Marked Completed Successfully!!")
    } catch (error) {
      console.error("Error marking todo completed:", error)
      toast.error("Error marking todo completed.")
    }
  }

  const customeColumnDefs: any = [
    {headerName: "Todo", field: "title"},
    {headerName: "Date", field: "date"},
    {
      headerName: "Actions",
      cellRenderer: (params: any) => {
        return (
          <div>
            <button
              onClick={() => markComplete(params.data.todoId)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full mr-2"
            >
              Mark Completed
            </button>
            <button
              onClick={() => deleteTodo(params.data.todoId)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-full m"
            >
              Delete
            </button>
          </div>
        )
      },
      width: 200,
    },
  ]
  const defaultColDefs = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      floatingFilter: true,
      editable: true,
    }
  })
  const [colDefs, setColDefs] = useState([
    {
      field: "Todo",
      headerName: "Task",
      cellEditor: "agSelectCellEditor",
      checkboxSelection: true,
    },
  ])

  const defaultPageSize = 10
  return (
    <div>
      <NavBar />
      <div className="container mb-2 flex mx-auto w-full items-center justify-center">
        <div className="flex flex-col" style={{width: "50%"}}>
          <span className="text-black text-2xl ">Enter Todo : </span>
          <input ref={title} className="mt-2 p-2  rounded-xl "></input>
          <button
            onClick={saveTodo}
            className="w-36 px-2 py-2 text-white mx-auto mb-3 mt-2 bg-green-400 rounded-xl hover:bg-green-500 text-2xl"
          >
            Save
          </button>
          <div
            className="ag-theme-quartz-dark"
            style={{height: "500px", width: "100%"}}
          >
            {Array.isArray(todos) && todos.length > 0 ? (
              <AgGridReact
                columnDefs={customeColumnDefs}
                rowData={todos}
                pagination={true}
                paginationPageSize={defaultPageSize}
                suppressPaginationPanel={true}
                rowSelection={"multiple"}
                paginationPageSizeSelector={[10, 20]}
                defaultColDef={defaultColDefs}
              />
            ) : (
              <p>No todos to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveTodos
