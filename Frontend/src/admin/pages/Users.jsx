import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { fetchUsers, deleteUser } from '../app/slices/userSlice'; 

const Users = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h2 className="text-2xl font-bold mb-4 font-mono text-orange-600 -mx-6">Users Management</h2>
      
      {/* Loading and error states */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      {/* Render table only when users exist */}
      {users.users ? (
        <table
          className="table-auto text-center w-full border-collapse border border-slate-400 rounded-lg"
          style={{ borderRadius: '10px' }}
        >
          <thead>
            <tr>
              <th className="px-4 py-2 border border-slate-400">User ID</th>
              <th className="px-4 py-2 border border-slate-400">Name</th>
              <th className="px-4 py-2 border border-slate-400">Email</th>
              <th className="px-4 py-2 border border-slate-400">Gender</th>
              <th className="px-4 py-2 border border-slate-400">Role</th>
              <th className="px-4 py-2 border border-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2 border border-slate-400">{user._id}</td>
                <td className="px-4 py-2 border border-slate-400">{user.name}</td>
                <td className="px-4 py-2 border border-slate-400">{user.email}</td>
                <td className="px-4 py-2 border border-slate-400">{user.gender}</td>
                <td className="px-4 py-2 border border-slate-400">{user.role}</td>
                <td className="px-4 py-2 border border-slate-400">
                  <button
                    className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleDelete(user._id)}
                    disabled={user.role === 'admin'}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default Users;
