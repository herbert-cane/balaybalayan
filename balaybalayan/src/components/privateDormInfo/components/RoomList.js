import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import RoomCard from './RoomCard';

const RoomList = ({ dormID }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomImages, setRoomImages] = useState({});

  const roomMapping = {
    sharedroom: { name: 'Shared Room', image: 'Shared.png' },
    bedspace: { name: 'Bedspace', image: 'Bedspace.png' },
    soloroom: { name: 'Solo Room', image: 'Solo.png' },
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, 'dorms', dormID, 'rooms');
        const roomSnapshot = await getDocs(roomsCollection);
        const roomList = roomSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomList);

        const imagePromises = Object.keys(roomMapping).map(async (roomId) => {
          const imagePath = `outside_room_photos/balay_cawayan/${roomMapping[roomId].image}`;
          const url = await getDownloadURL(ref(storage, imagePath));
          return { [roomId]: url };
        });
        const images = await Promise.all(imagePromises);
        setRoomImages(Object.assign({}, ...images));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [dormID]);

  if (loading) {
    return <p>Loading rooms...</p>;
  }

  return (
    <div className="room-list">
      {rooms.length === 0 ? (
        <p>No rooms available</p>
      ) : (
        rooms.map(room => (
          <RoomCard
            key={room.id}
            roomName={roomMapping[room.id]?.name || 'Room'}
            roomPrice={room.roomPrice}
            roomImage={roomImages[room.id]}
          />
        ))
      )}
    </div>
  );
};

export default RoomList;
