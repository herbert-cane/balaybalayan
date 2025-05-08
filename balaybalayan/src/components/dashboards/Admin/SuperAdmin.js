import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';


const SuperAdmin = () => {
    const [userType, setUserType] = useState('dormer');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const handleVerify = (user) => {
      console.log(`Verified user: ${user.firstName} ${user.lastName}`);
    };


    // Fetch data from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
        try {
            // Query based on the selected user type
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('role', '==', userType === 'dormer' ? 'dormer' : 'manager'));
            const querySnapshot = await getDocs(q);

            const fetchedUsers = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));

            setUsers(fetchedUsers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
        };

        fetchUsers();
    }, [userType]);

  return (
    <div>
        HELLO SUPER ADMIN

        <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md shadow-sm transition ${
            userType === 'dormer' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setUserType('dormer')}
        >
          Dormer
        </button>
        <button
          className={`px-4 py-2 rounded-md shadow-sm transition ${
            userType === 'manager' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setUserType('manager')}
        >
          Dorm Manager
        </button>
        </div>
        
        <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Profile</th>
              <th className="border px-4 py-2 text-left">Last Name</th>
              <th className="border px-4 py-2 text-left">First Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-left">Sex</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">Loading users...</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <img
                      src={user.profilePhotoURL || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="dormer-image"
                    />
                  </td>
                  <td className="border px-4 py-2">{user.lastName}</td>
                  <td className="border px-4 py-2">{user.firstName}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.phoneNumber}</td>
                  <td className="border px-4 py-2">{user.sex}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleVerify(user)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>




    </div>
  );
};

export default SuperAdmin;
