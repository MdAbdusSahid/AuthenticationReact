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

const CompletedTodos = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    console.log("Todos", todos)
  }, [todos])

  const getAllCompletedTodos = async () => {
    const userId = getLoginInfo()?.userId
    if (userId != null) {
      const response = await custom_axios.get(
        ApiConstants.TODO.FIND_COMPLETED(userId),
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
  }

  useEffect(() => {
    if (todos.length === 0) getAllCompletedTodos()
  }, [])

  const deleteTodo = async (todoId: number) => {
    try {
      const response = await custom_axios.delete(
        ApiConstants.TODO.DELETE(todoId),
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      getAllCompletedTodos()
      toast.success("Todo Deleted Successfully!!")
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast.error("Error deleting todo.")
    }
  }

  const columnDefs: any = [
    {headerName: "Todo", field: "title"},
    {headerName: "Date", field: "date"},
    {
      headerName: "Actions",
      cellRenderer: (params: any) => (
        <button
          onClick={() => deleteTodo(params.data.todoId)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold  rounded-full"
        >
          Delete
        </button>
      ),
      width: 120,
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
      <h1 className="text-center text-5xl p-4">Completed Todos</h1>
      <div className="container mb-2 flex mx-auto w-full items-center justify-center">
        <div
          className="ag-theme-quartz-dark"
          style={{height: "500px", width: "50%"}}
        >
          {Array.isArray(todos) && todos.length > 0 ? (
            <AgGridReact
              columnDefs={columnDefs}
              rowData={todos}
              pagination={true}
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
  )
}

export default CompletedTodos
