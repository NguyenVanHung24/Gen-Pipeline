import React, { useState, useEffect } from 'react';
import { 
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhotograph,
    HiOutlineUserCircle,
    HiOutlineUserGroup
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import api from '../../utils/axios';
import Image from "../../components/Blog/Image";
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        img: '',
        roles: []
    });
    const [editingId, setEditingId] = useState(null);

    const AVAILABLE_ROLES = ['user', 'admin', 'contributer'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            toast.error('Error fetching users');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${editingId}`, formData);
            toast.success('User updated successfully');
            fetchUsers();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data || 'Error updating user');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Error deleting user');
            }
        }
    };

    const handleEdit = (user) => {
        setEditingId(user._id);
        setFormData({
            username: user.username,
            email: user.email,
            img: user.img || '',
            roles: user.roles || ['user']
        });
    };

    const handleRoleChange = (role) => {
        setFormData(prev => {
            const newRoles = prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];
            return { ...prev, roles: newRoles };
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            username: '',
            email: '',
            img: '',
            roles: []
        });
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        User Management
                    </h2>
                </div>
            </div>

            {/* Edit Form */}
            {editingId && (
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            {/* Username field */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineUser className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        required
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Email field */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineMail className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Roles field */}
                            <div className="sm:col-span-6">
                                <div className="flex items-center">
                                    <HiOutlineUserGroup className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Roles
                                    </label>
                                </div>
                                <div className="mt-2 space-x-4">
                                    {AVAILABLE_ROLES.map(role => (
                                        <label key={role} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.roles.includes(role)}
                                                onChange={() => handleRoleChange(role)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 capitalize">
                                                {role}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Image URL field */}
                            <div className="sm:col-span-6">
                                <div className="flex items-center">
                                    <HiOutlinePhotograph className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Profile Image URL
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="url"
                                        value={formData.img}
                                        onChange={(e) => setFormData({...formData, img: e.target.value})}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                Update User
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Registered Users
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="table-header">User</th>
                                <th className="table-header">Email</th>
                                <th className="table-header">Roles</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="table-cell">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                {user.img ? (
                                                    <Image
                                                        className="h-10 w-10 rounded-full"
                                                        src={user.img}
                                                        alt={user.username}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <HiOutlineUserCircle className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-900">
                                                    {user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {user.email}
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            {user.roles.map(role => (
                                                <span 
                                                    key={role}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleEdit(user)}
                                                className="btn-secondary text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user._id)}
                                                className="btn-danger text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement; 