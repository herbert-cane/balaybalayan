import React, { useEffect, useState } from 'react';
import { collection, onSnapshot} from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../../../AuthContext'; // Import useAuth hook

// Register the necessary chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { dormitoryId } = useAuth(); // Use useAuth to get dormitoryId
  const [maxOccupants, setMaxOccupants] = useState(0);
  const [currentDormers, setCurrentDormers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!dormitoryId) return; // Exit if no dormitoryId is available

      // Get all the rooms for the current dormitory
      const roomRef = collection(db, 'dormitories', dormitoryId, 'rooms');

      const unsubscribe = onSnapshot(roomRef, async (snapshot) => {
        let totalMaxOccupants = 0;
        let totalCurrentDormers = 0;

        for (const doc of snapshot.docs) {
          const roomData = doc.data();

          // Add the maxOccupants of the current room to the total
          if (roomData.maxOccupants) {
            totalMaxOccupants += roomData.maxOccupants;
          }

          // Check if the room has dormers and count them
          const dormers = roomData.dormers || []; // Default to empty array if no dormers field
          totalCurrentDormers += dormers.length; // Count dormers by the length of the array
        }

        // Log data for debugging
        console.log('Total Max Occupants:', totalMaxOccupants);
        console.log('Total Current Dormers:', totalCurrentDormers);

        setMaxOccupants(totalMaxOccupants);
        setCurrentDormers(totalCurrentDormers);
      });

      return () => unsubscribe();
    };

    fetchData();

  }, [dormitoryId]); // Re-fetch data if dormitoryId changes

  const data = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [currentDormers, maxOccupants - currentDormers],
        backgroundColor: ['#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
