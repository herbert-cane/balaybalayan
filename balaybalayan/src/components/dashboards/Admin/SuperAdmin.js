import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import './SuperAdmin.css';
import { FaUserGraduate, FaUserTie } from 'react-icons/fa';

const SuperAdmin = () => {
    const [userType, setUserType] = useState('dormer');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

  
    const handleVerify = async (user) => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        isVerified: true
      });
      console.log(`Verified user: ${user.firstName} ${user.lastName}`);
      toast.success("Verified user!")

      // Update local state
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((u) =>
          u.id === user.id ? { ...u, isVerified: true } : u
        );

        // Re-sort after updating
        return updatedUsers.sort((a, b) => {
          const aVerified = a.isVerified === true;
          const bVerified = b.isVerified === true;
          return aVerified - bVerified;
        });
        

      }); 

    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleDecline = async (user) => {
    if (window.confirm(`Are you sure you want to decline ${user.firstName} ${user.lastName}?`)) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          isDeclined: true,
          isVerified: false
        });
        toast.success("User declined");

        // Remove user from the list
        setUsers((prevUsers) => prevUsers.filter(u => u.id !== user.id));
      } catch (error) {
        console.error('Error declining user:', error);
        toast.error("Error declining user");
      }
    }
  };

  const handleToggleVerification = async (user) => {
    try {
      const userRef = doc(db, 'users', user.id);
      const newStatus = !user.isVerified;
      
      await updateDoc(userRef, {
        isVerified: newStatus
      });
      
      toast.success(newStatus ? "User verified!" : "User verification removed");

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((u) =>
          u.id === user.id ? { ...u, isVerified: newStatus } : u
        );

        return updatedUsers.sort((a, b) => {
          const aVerified = a.isVerified === true;
          const bVerified = b.isVerified === true;
          return aVerified - bVerified;
        });
      });

    } catch (error) {
      console.error('Error toggling verification:', error);
      toast.error("Error updating verification status");
    }
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

            const sortedUsers = fetchedUsers.sort((a, b) => {
            const aVerified = a.isVerified === true;
            const bVerified = b.isVerified === true;
            return aVerified - bVerified; // false (0) comes before true (1)
          });

            setUsers(sortedUsers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
        };

        fetchUsers();
    }, [userType]);

  return (
    <div className="super-admin-page">
      <div className="admin-container">
      <div className="admin-content">
        <h1 className="main-title">
          <FaUserTie className="title-icon" /> Admin Dashboard
        </h1>
        <div className="button-group">
          <button
            className={`type-button ${userType === 'dormer' ? 'active' : ''}`}
            onClick={() => setUserType('dormer')}
          >
            <FaUserGraduate className="button-icon" /> Dormer
          </button>
          <button
            className={`type-button ${userType === 'manager' ? 'active' : ''}`}
            onClick={() => setUserType('manager')}
          >
            <FaUserTie className="button-icon" /> Dorm Manager
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="table-title">
          {userType === 'dormer' ? (
            <><FaUserGraduate className="title-icon" /> Dormer List</>
          ) : (
            <><FaUserTie className="title-icon" /> Dorm Manager List</>
          )}
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
                {userType === 'manager' ? (
                  <th className="border px-4 py-2 text-left">Business Permit</th>
                ) : (
                  <>
                    <th className="border px-4 py-2 text-left">Form 5</th>
                    <th className="border px-4 py-2 text-left">Dorm Application</th>
                  </>
                )}
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={userType === 'manager' ? "8" : "9"} className="text-center py-4">Loading users...</td>
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
                    {userType === 'manager' ? (
                      <td className="border px-4 py-2">
                        {user.businessPermitURL ? (
                          <a href={user.businessPermitURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Permit
                          </a>
                        ) : (
                          "No permit uploaded"
                        )}
                      </td>
                    ) : (
                      <>
                        <td className="border px-4 py-2">
                          {user.form5URL ? (
                            <a href={user.form5URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Form 5
                            </a>
                          ) : (
                            "No form uploaded"
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          {user.dormApplicationURL ? (
                            <a href={user.dormApplicationURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Application
                            </a>
                          ) : (
                            "No application uploaded"
                          )}
                        </td>
                      </>
                    )}
                    <td className="border px-4 py-2 action-buttons">
                      <button
                        onClick={() => handleToggleVerification(user)}
                        className={user.isVerified ? "verify-button verified" : "verify-button"}
                      >
                        {user.isVerified ? 'Remove Verification' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleDecline(user)}
                        disabled={user.isVerified === true}
                        className="decline-button"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SuperAdmin;
