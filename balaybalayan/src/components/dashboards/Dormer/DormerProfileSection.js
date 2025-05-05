import './DormerProfileSection.css';
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';

const Profile = () => {
  // State to manage user data
  const [userData, setUserData] = useState({
    firstName: '',
    email: '',
    address: '',
    lastName: '',
    profilePhotoURL: '',
    coverPhoto: 'https://via.placeholder.com/1200x400',
  });

  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({ id: null, text: '' });
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch user data 
  const fetchUserData = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          address: data.address || '',
          profilePhotoURL: data.profilePhotoURL || '',
          coverPhoto: data.coverPhoto || 'https://via.placeholder.com/1200x400',
        });
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  // Fetch user's posts
  const fetchPosts = async (userId) => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.timestamp - a.timestamp);

      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts: ', error);
      setLoading(false);
    }
  };

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.uid);
        fetchPosts(user.uid);
      } else {
        setLoading(false);
        setCurrentUser(null);
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  // Open modal for creating/editing post
  const openModal = (post = null) => {
    setCurrentPost(post ? { ...post } : { id: null, text: '' });
    setIsModalOpen(true);
  };

  // Handle post submission (create or update)
  const handleSubmitPost = async () => {
    if (!currentPost.text.trim() || !currentUser) return;

    try {
      if (currentPost.id) {
        // Update existing post
        const postRef = doc(db, 'posts', currentPost.id);
        await updateDoc(postRef, {
          text: currentPost.text,
          timestamp: Date.now()
        });

        // Update local state
        setPosts(posts.map(post => 
          post.id === currentPost.id 
            ? { ...post, text: currentPost.text, timestamp: Date.now() } 
            : post
        ).sort((a, b) => b.timestamp - a.timestamp));
      } else {
        // Create new post
        const newPostRef = await addDoc(collection(db, 'posts'), {
          userId: currentUser.uid,
          text: currentPost.text,
          timestamp: Date.now()
        });

        // Add to local state
        const newPost = {
          id: newPostRef.id,
          userId: currentUser.uid,
          text: currentPost.text,
          timestamp: Date.now()
        };
        setPosts([newPost, ...posts]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting post: ', error);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'posts', postId));

      // Update local state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

  // Render modal for creating/editing posts
  const renderPostModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <img 
              src={userData.profilePhotoURL || 'https://via.placeholder.com/50'} 
              alt="Profile" 
              className="modal-profile-photo" 
            />
            <h2>{currentPost.id ? 'Edit Post' : 'Create New Post'}</h2>
          </div>
          <div className="modal-body">
            <textarea 
              value={currentPost.text}
              onChange={(e) => setCurrentPost({...currentPost, text: e.target.value})}
              placeholder={`What's on your mind, ${userData.firstName || 'User'}?`}
              rows={4}
            />
          </div>
          <div className="modal-footer">
            <button 
              className="modal-cancel-btn" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="modal-post-btn"
              onClick={handleSubmitPost}
              disabled={!currentPost.text.trim()}
            >
              {currentPost.id ? 'Update' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If data is still loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dormer-profile">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="cover-photo-container">
            <img src={userData.coverPhoto} alt="Cover" className="cover-photo" />
          </div>
          <div className="profile-info-container">
            <div className="profile-photo-container">
              <img
                src={userData.profilePhotoURL}
                alt="Profile"
                className="profile-photo"
              />
            </div>
            <div className="profile-details">
              <h2 className="profile-name">{userData.firstName} {userData.lastName}</h2>
              <p className="profile-email">{userData.email}</p>
              <p className="profile-address">{userData.address}</p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`profile-tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
          <button
            className={`profile-tab ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
          </button>
        </div>

        {/* Display Content based on active tab */}
        {activeTab === 'posts' && (
          <div className="posts-content">
            <button 
              className="create-post-btn" 
              onClick={() => openModal()}
            >
              Create New Post
            </button>
            {posts.map((post) => (
              <div key={post.id} className="post-item">
                <p>{post.text}</p>
                <div className="post-timestamp">
                  {new Date(post.timestamp).toLocaleString()}
                </div>
                <div className="post-actions">
                  <button onClick={() => openModal(post)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other tabs remain the same */}
        {activeTab === 'friends' && (
          <div className="friends-content">
            <div className="friend-card">
              <img src="https://via.placeholder.com/50" alt="John Doe" />
              <h3>John Doe</h3>
            </div>
            <div className="friend-card">
              <img src="https://via.placeholder.com/50" alt="Alice Smith" />
              <h3>Alice Smith</h3>
            </div>
            <div className="friend-card">
              <img src="https://via.placeholder.com/50" alt="Bob Johnson" />
              <h3>Bob Johnson</h3>
            </div>
          </div>
        )}
        {activeTab === 'photos' && (
          <div className="photos-content">
            <div className="photo-card">
              <img src="https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/profile_photos%2F0ciS2fvJRidjfxSGFlBH0h7qnTx2?alt=media&token=625d7a8a-d2c9-454e-9a78-dd3237f46f25" alt="Photo 1" />
              <div className="photo-overlay">
              </div>
            </div>
            <div className="photo-card">
              <img src="https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2FdormerCardPhoto.jpg?alt=media&token=36b74a12-5fe6-4683-b4cb-9ec73be449e0" alt="Photo 2" />
              <div className="photo-overlay">
              </div>
            </div>
            <div className="photo-card">
              <img src="https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248" alt="Photo 3" />
              <div className="photo-overlay">
              </div>
            </div>
          </div>
        )}

        {/* Render post modal */}
        {renderPostModal()}
      </div>
    </div>
  );
};

export default Profile;