import React, {useState, useEffect, useMemo} from "react"
import {AgGridReact} from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import {ApiConstants} from "../api/ApiConstants"
import custom_axios from "../axios/AxiosSetup"
import NavBar from "../components/NavBar"
import {getLoginInfo} from "../utils/LoginInfo"
import {toast} from "react-toastify"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const getAllUsers = async () => {
    const role = getLoginInfo()?.role
    if (role != null) {
      try {
        const response = await custom_axios.get(ApiConstants.USER.FIND_ALL, {
          headers: {Authorization: "Bearer " + localStorage.getItem("token")},
        })
        setUsers(response.data.data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    } else {
      toast.info("Forbidden Resource")
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const deleteUser = async (userId: number) => {
    try {
      const response = await custom_axios.delete(
        ApiConstants.USER.DELETE(userId),
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      getAllUsers()
      toast.success("User Deleted Successfully!!")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error deleting user.")
    }
  }

  const columnDefs: any = [
    {headerName: "First Name", field: "firstName"},
    {headerName: "Last Name", field: "lastName"},
    {headerName: "Email", field: "email"},
    {
      headerName: "Actions",
      cellRenderer: (params: any) => (
        <div>
          <button
            onClick={() => deleteUser(params.data.userId)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-full m"
          >
            Delete
          </button>
        </div>
      ),
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
      <h1 className="text-2xl text-black text-center p-4">Users</h1>
      <div className="max-w-2xl mx-auto">
        <div
          className="ag-theme-quartz-dark"
          style={{height: "550px", width: "100%"}}
        >
          {Array.isArray(users) && users?.length > 0 ? (
            <AgGridReact
              columnDefs={columnDefs}
              pagination={true}
              rowData={users}
              paginationPageSize={defaultPageSize}
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

export default UsersPage
