import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { DarkModeContext } from "../../context/darkModeContext.js";
import { useContext } from "react";
import NavBar from "../../components/navbar/NavBar.jsx";
import avata from './avata.jpg';

const AdminPanel = () => {
    const { darkMode } = useContext(DarkModeContext);

    const columns = [
        { field: 'id', headerName: 'No.', width: 100 },
        // { field: 'postId', headerName: 'Post ID', width: 150 },
        { field: 'Tittle', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        {
            field: 'view',
            headerName: 'View',
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <Link to={`/post/${params.row.postId}`}>
                    <button>View</button>
                </Link>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <button onClick={() => handleDelete(params.row.id)}>Delete</button>
            ),
        },
    ];

    const rows = [
        { id: 1, postId: 123, Tittle:'Thang nay lua dao', description: 'Inappropriate content' },
        { id: 2, postId: 123, Tittle:'Thang nay lua dao', description: 'Inappropriate content' },
        // Add more rows as needed
    ];

    const handleDelete = (id) => {
        // Xử lý xóa hàng dựa trên id
        console.log(`Deleting row with id ${id}`);
    };

    return (
        <div className='background'>
            <div className={`theme-${darkMode ? "dark" : "light"}`}>
                <NavBar />
                <div className='container'>
                    <div className='reportdashboard'>
                        <h1>List of articles being reported</h1>
                        <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
