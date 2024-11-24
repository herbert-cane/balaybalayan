const dormitories = [
  {
    id: "balaycawayan",
    dormName: "Balay Cawayan",
    banner:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/outside_dorm_banner%2FbalaycawayanBanner.png?alt=media&token=424ba3c9-0937-4279-be46-a54004dbdf32",
    dormLogo:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/dorm_logos%2FbalaycawayanLogo.png?alt=media&token=247e53ae-6583-41e8-a541-271a32336120",
    dormAddress: "Hollywood St., Mat-Y (Pob.), Miagao",
    dormPhoto:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    isVisitors: true,
    managers: "None",
    type: "Private",
    priceRange: "₱1000 - ₱3000",
    amenities: ["Wi-Fi", "Cabinet", "Study Table", "Personal Bathroom"],
    curfew: "9:00PM - 6:00AM",
    description: " The Camping Dorm",
    NumberOfRooms: 21739812379, // Placeholder
    AvailableRooms: 827193789127893127982, // Placeholder
    rooms: [
      {
        id: "room101",
        name: "Room 101",
        price: 1200,
        size: "Single Bed",
        maxOccupants: 1,
      },
    ],
    path: "/private/balaycawayan",
  },
  {
    id: "balaygumamela",
    dormName: "Balay Gumamela",
    banner: "https://example.com/image2.jpg",
    dormLogo: "https://example.com/logo2.jpg",
    dormPhoto:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "Sunset Blvd., Downtown",
    isVisitors: false,
    managers: "None",
    type: "University",
    priceRange: "₱2000 - ₱4000",
    amenities: ["Wi-Fi", "Shared Kitchen", "Laundry Service"],
    curfew: "None",
    description: "Most Fabulous Dorm",
    NumberOfRooms: 8, // Placeholder
    AvailableRooms: 3, // Placeholder
    rooms: [
      {
        id: "room201",
        name: "Room 201",
        price: 2500,
        size: "Single Bed",
        maxOccupants: 1,
      },
      {
        roomName: "Basic Room",
        roomPrice: "300",
        numPersons: "4 pax",
        roomAmenities: ["Study Table", "Bed", "Comfort Room"],
      }
    ],
    appliances: [
      {
        applianceName: [
          "Mobile Phone",
          "Laptop",
          "Electric Fan",
          "Printer",
          "Lampshade",
        ]
      },
      {
        applianceFee: [15, 100, 100, 25, 25],
      },
    ],
    path: "/dormitories/balaygumamela",
  },
  {
    id: "balaylampirong",
    dormName: "Balay Lampirong",
    banner: "https://example.com/banner-lampirong.jpg",
    dormLogo: "https://example.com/logo-lampirong.jpg",
    dormPhoto:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "University",
    priceRange: "₱1500 - ₱2500",
    amenities: ["Wi-Fi", "Study Hall", "Shared Bathroom"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    description: "The Diseased <3",
    NumberOfRooms: 15, // Placeholder
    AvailableRooms: 7, // Placeholder
    rooms: [
      {
        id: "room201",
        name: "Room 201",
        price: 2500,
        size: "Single Bed",
        maxOccupants: 1,
      },
      {
        roomName: "Basic Room",
        roomPrice: "300",
        numPersons: "4 pax",
        roomAmenities: ["Study Table", "Bed", "Kid Ghost"],
      }
    ],
    appliances: [
      {
        applianceName: [
          "Mobile Phone",
          "Laptop",
          "Electric Fan",
          "Printer",
          "Lampshade",
        ]
      },
      {
        applianceFee: [15, 100, 100, 25, 25],
      },
    ],
    path: "/dormitories/balaylampirong",
  },
  {
    id: "balayapitong",
    dormName: "Balay Apitong",
    banner: "https://example.com/banner-apitong.jpg",
    dormLogo: "https://example.com/logo-apitong.jpg",
    dormPhoto:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "University",
    priceRange: "₱0",
    amenities: ["Wi-Fi", "Common Room", "Study Desks"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    description: "The Unknown Dorm",
    NumberOfRooms: 20, // Placeholder
    AvailableRooms: 10, // Placeholder
    rooms: [
      {
        id: "room201",
        name: "Room 201",
        price: 2500,
        size: "Single Bed",
        maxOccupants: 1,
      },
      {
        roomName: "Basic Room",
        roomPrice: "300",
        numPersons: "4 pax",
        roomAmenities: ["Study Table", "Bed", "Smiling Anino"],
      }
    ],
    appliances: [
      {
        applianceName: [
          "Mobile Phone",
          "Laptop",
          "Electric Fan",
          "Printer",
          "Lampshade",
        ]
      },
      {
        applianceFee: [15, 100, 100, 25, 25],
      },
    ],
    path: "/dormitories/balayapitong",
  },
  {
    id: "balaykanlaon",
    dormName: "Balay Kanlaon",
    banner: "https://example.com/banner-kanlaon.jpg",
    dormLogo: "https://example.com/logo-kanlaon.jpg",
    dormPhoto:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "University",
    priceRange: "₱1500 - ₱2500",
    amenities: ["Wi-Fi", "Recreation Room", "Shared Bathroom"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    description: "The Calming Dorm",
    NumberOfRooms: 25, // Placeholder
    AvailableRooms: 15, // Placeholder
    rooms: [
      {
        id: "room201",
        name: "Room 201",
        price: 2500,
        size: "Single Bed",
        maxOccupants: 1,
      }
    ],
    appliances: [
      {
        applianceName: [
          "Mobile Phone",
          "Laptop",
          "Electric Fan",
          "Printer",
          "Lampshade",
        ]
      },
      {
        applianceFee: [15, 100, 100, 25, 25],
      },
    ],
    path: "/dormitories/balaykanlaon",
  },
  {
    id: "balaymadyaas",
    dormName: "Balay Madyaas",
    banner: "https://example.com/banner-madyaas.jpg",
    dormLogo: "https://example.com/logo-madyaas.jpg",
    dormPhoto:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "University",
    priceRange: "₱1500 - ₱2500",
    amenities: ["Wi-Fi", "Recreation Room", "Shared Bathroom"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    description: "The Slowest Wifi",
    NumberOfRooms: 25, // Placeholder
    AvailableRooms: 15, // Placeholder
    rooms: [
      {
        id: "room201",
        name: "Room 201",
        price: 2500,
        size: "Single Bed",
        maxOccupants: 1,
      }
    ],
    appliances: [
      {
        applianceName: [
          "Mobile Phone",
          "Laptop",
          "Electric Fan",
          "Printer",
          "Lampshade",
        ]
      },
      {
        applianceFee: [15, 100, 100, 25, 25],
      },
    ],
    path: "/dormitories/balaymadyaas",
  },
];

export default dormitories;
