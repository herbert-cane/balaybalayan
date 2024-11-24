import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access the dormID from the URL
import { db } from '../firebase'; // Import Firebase database
import { doc, getDoc } from 'firebase/firestore';

function DormDetails() {
  const { dormID } = useParams(); // Get the dormID from the URL params
  const [dorm, setDorm] = useState(null); // State to hold the dorm data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchDormDetails = async () => {
      const dormRef = doc(db, "dormitories", dormID); // Reference to the specific dorm
      try {
        const docSnapshot = await getDoc(dormRef);
        if (docSnapshot.exists()) {
          setDorm(docSnapshot.data()); // Set dorm data in state
          setLoading(false); // Stop loading
        } else {
          console.error("No such dorm!");
        }
      } catch (error) {
        console.error("Error fetching dorm details:", error);
        setLoading(false);
      }
    };

    fetchDormDetails();
  }, [dormID]); // Run only when dormID changes

  if (loading) {
    return <p>Loading dorm details...</p>;
  }

  return (
    <div>
      <h1>{dorm.dormName}</h1>
      <p>{dorm.dormAddress}</p>
      <p>{dorm.priceRange}</p>
      <p>{dorm.type}</p>
      {/* Display more dorm details as needed */}
    </div>
  );
}

export default DormDetails;
