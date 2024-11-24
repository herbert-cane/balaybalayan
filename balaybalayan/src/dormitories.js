const dormitories = [
  {
    id: "balaycawayan",
    dormName: "Balay Cawayan",
    banner:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/outside_dorm_banner%2FbalaycawayanBanner.png?alt=media&token=424ba3c9-0937-4279-be46-a54004dbdf32",
    dormLogo:
      "https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/dorm_logos%2FbalaycawayanLogo.png?alt=media&token=247e53ae-6583-41e8-a541-271a32336120",
    dormAddress: "Hollywood St., Mat-Y (Pob.), Miagao",
    dormPhoto:"https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    isVisitors: true,
    managers: "None",
    type: "private",
    priceRange: "₱1000 - ₱3000",
    amenities: ["Wi-Fi", "Cabinet", "Study Table", "Personal Bathroom", "Birthday Parties"],
    curfew: "9:00PM - 6:00AM",
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
    pageFile: "/BalayCawayan" // Added pageFile attribute
  },
  {
    id: "balaygumamela",
    dormName: "Balay Gumamela",
    banner: "https://example.com/image2.jpg",
    dormLogo: "https://example.com/logo2.jpg",
    dormPhoto:"https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "Sunset Blvd., Downtown",
    isVisitors: false,
    managers: "None",
    type: "university",
    priceRange: "₱2000 - ₱4000",
    amenities: ["Wi-Fi", "Shared Kitchen", "Laundry Service"],
    curfew: "None",
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
    ],
    pageFile: "../../BalayGumamela" // Added pageFile attribute
  },

  {
    id: "balaylampirong",
    dormName: "Balay Lampirong",
    banner: "https://example.com/banner-lampirong.jpg",
    dormLogo: "https://example.com/logo-lampirong.jpg",
    dormPhoto:"https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "university",
    priceRange: "₱1500 - ₱2500",
    amenities: ["Wi-Fi", "Study Hall", "Shared Bathroom"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    NumberOfRooms: 15, // Placeholder
    AvailableRooms: 7, // Placeholder
    rooms: [
      {
      id: "room201",
      name: "Room 201",
      price: 2500,
      size: "Single Bed",
      maxOccupants: 1,
      }
    ],
    pageFile: "../../BalayLampirong" // Added pageFile attribute
  },
  {
    id: "balayapitong",
    dormName: "Balay Apitong",
    banner: "https://example.com/banner-apitong.jpg",
    dormLogo: "https://example.com/logo-apitong.jpg",
    dormPhoto:"https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "university",
    priceRange: "₱0",
    amenities: ["Wi-Fi", "Common Room", "Study Desks"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    NumberOfRooms: 20, // Placeholder
    AvailableRooms: 10, // Placeholder
    rooms: [
      {
        id: "room201",
        name: "Room 201",
        price: 2500,
        size: "Single Bed",
        maxOccupants: 1,
        }
    ],
    pageFile: "../../BalayApitong" // Added pageFile attribute
  },
  {
    id: "balaykanlaon",
    dormName: "Balay Kanlaon",
    banner: "https://example.com/banner-kanlaon.jpg",
    dormLogo: "https://example.com/logo-kanlaon.jpg",
    dormPhoto:"https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "university",
    priceRange: "₱1500 - ₱2500",
    amenities: ["Wi-Fi", "Recreation Room", "Shared Bathroom"],
    curfew: "10:00PM - 6:00AM", // Placeholder
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
    pageFile: "../../BalayKanlaon" // Added pageFile attribute
  },
  {
    id: "balaymadyaas",
    dormName: "Balay Madyaas",
    banner: "https://example.com/banner-madyaas.jpg",
    dormLogo: "https://example.com/logo-madyaas.jpg",
    dormPhoto:"https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "university",
    priceRange: "₱1500 - ₱2500",
    amenities: ["Wi-Fi", "Common Kitchen", "Study Hall"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    NumberOfRooms: 18, // Placeholder
    AvailableRooms: 9, // Placeholder
    rooms: [
      {
      id: "room201",
      name: "Room 201",
      price: 2500,
      size: "Single Bed",
      maxOccupants: 1,
      }
    ],
    pageFile: "../../BalayMadyaas" // Added pageFile attribute
  },
  {
    id: "balaymiagos",
    dormName: "Balay Miagos",
    banner: "https://example.com/banner-miagos.jpg",
    dormLogo: "https://example.com/logo-miagos.jpg",
    dormPhoto:"https://firebasestorage.googleapis.com/v0/b/balay-balayan-b6fba.appspot.com/o/placeholders%2Fphoto_sample.jpg?alt=media&token=a6a71b8a-69c2-4e11-8ae3-4262d5b88248",
    dormAddress: "University Avenue",
    isVisitors: true, // Placeholder
    managers: "None", // Placeholder
    type: "university",
    priceRange: "₱1500 - ₱2500",
    amenities: ["Wi-Fi", "Common Area", "Laundry Service"],
    curfew: "10:00PM - 6:00AM", // Placeholder
    NumberOfRooms: 15, // Placeholder
    AvailableRooms: 5, // Placeholder
    rooms: [
      {
        id: "room201",
        name: "Room 201",
        price: 2500,
        size: "Single Bed",
        maxOccupants: 1,
        }
    ],
    pageFile: "../../BalayMiagos" // Added pageFile attribute
  }
];
