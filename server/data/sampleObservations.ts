import { InsertObservation } from "../../shared/schema";

// Sample data for observations in Islamabad region
export const sampleObservations: InsertObservation[] = [
  {
    userId: 1,
    speciesName: "Himalayan Bulbul",
    scientificName: "Pycnonotus leucogenys",
    location: "Trail 3, Margalla Hills, Islamabad",
    latitude: "33.7518",
    longitude: "73.0587",
    dateObserved: new Date("2025-05-10T08:45:00"),
    imageUrl: "/uploads/himalayan_bulbul.jpg",
    notes: "Spotted early morning, feeding on berries. Distinctive white cheeks clearly visible.",
    speciesType: "bird"
  },
  {
    userId: 2,
    speciesName: "Common Leopard",
    scientificName: "Panthera pardus",
    location: "Northern Margalla Hills, Islamabad",
    latitude: "33.7734",
    longitude: "73.0692",
    dateObserved: new Date("2025-05-02T18:20:00"),
    imageUrl: "/uploads/common_leopard.jpg",
    notes: "Brief sighting at dusk. Animal crossed the path approximately 50 meters ahead and disappeared into the forest. Reported to IWMB rangers.",
    speciesType: "mammal"
  },
  {
    userId: 1,
    speciesName: "Wild Boar",
    scientificName: "Sus scrofa",
    location: "Rawal Lake Park, Islamabad",
    latitude: "33.7014",
    longitude: "73.1391",
    dateObserved: new Date("2025-05-08T16:40:00"),
    imageUrl: "/uploads/wild_boar.jpg",
    notes: "Group of 5-6 individuals including juveniles, foraging near the edge of the lake.",
    speciesType: "mammal"
  },
  {
    userId: 3,
    speciesName: "Chir Pine",
    scientificName: "Pinus roxburghii",
    location: "F-6 Sector, Islamabad",
    latitude: "33.7259",
    longitude: "73.0790",
    dateObserved: new Date("2025-05-05T10:15:00"),
    imageUrl: "/uploads/chir_pine.jpg",
    notes: "Old growth specimen with approximately 15m height. Documenting urban trees in the diplomatic enclave.",
    speciesType: "plant"
  },
  {
    userId: 2,
    speciesName: "Monitor Lizard",
    scientificName: "Varanus bengalensis",
    location: "Shakarparian, Islamabad",
    latitude: "33.6941",
    longitude: "73.0775",
    dateObserved: new Date("2025-05-12T13:25:00"),
    imageUrl: "/uploads/monitor_lizard.jpg",
    notes: "Large individual (approximately 1m) sunning on rocks near the walking path. Did not appear disturbed by human presence.",
    speciesType: "reptile"
  },
  {
    userId: 4,
    speciesName: "Blue Whistling Thrush",
    scientificName: "Myophonus caeruleus",
    location: "Trail 5, Margalla Hills, Islamabad",
    latitude: "33.7489",
    longitude: "73.0645",
    dateObserved: new Date("2025-05-09T07:30:00"),
    imageUrl: "/uploads/blue_whistling_thrush.jpg",
    notes: "Heard distinctive whistling call first, then spotted near small stream. Beautiful blue plumage with yellow bill clearly visible.",
    speciesType: "bird"
  },
  {
    userId: 5,
    speciesName: "Indian Cobra",
    scientificName: "Naja naja",
    location: "E-7 Sector, Islamabad",
    latitude: "33.7240",
    longitude: "73.0608",
    dateObserved: new Date("2025-05-07T16:50:00"),
    imageUrl: "/uploads/indian_cobra.jpg",
    notes: "Found in garden of private residence. IWMB rescue team safely relocated the snake to natural habitat. Important to raise awareness of snake safety.",
    speciesType: "reptile"
  },
  {
    userId: 3,
    speciesName: "Himalayan Musk Rose",
    scientificName: "Rosa brunonii",
    location: "Trail 2, Margalla Hills, Islamabad",
    latitude: "33.7392",
    longitude: "73.0711",
    dateObserved: new Date("2025-05-11T09:20:00"),
    imageUrl: "/uploads/himalayan_musk_rose.jpg",
    notes: "In full bloom along the trail. Strong fragrance attracting numerous butterflies and bees.",
    speciesType: "plant"
  },
  {
    userId: 1,
    speciesName: "Indian Grey Mongoose",
    scientificName: "Herpestes edwardsii",
    location: "F-9 Park, Islamabad",
    latitude: "33.7027",
    longitude: "73.0284",
    dateObserved: new Date("2025-05-13T15:10:00"),
    imageUrl: "/uploads/grey_mongoose.jpg",
    notes: "Active hunting behavior observed. Moved quickly through underbrush, pausing occasionally to investigate holes.",
    speciesType: "mammal"
  },
  {
    userId: 4,
    speciesName: "Grey Francolin",
    scientificName: "Francolinus pondicerianus",
    location: "Fatima Jinnah Park, Islamabad",
    latitude: "33.7006",
    longitude: "73.0510",
    dateObserved: new Date("2025-05-14T16:15:00"),
    imageUrl: "/uploads/grey_francolin.jpg",
    notes: "Pair spotted foraging in grassy area. Characteristic call heard earlier in the morning. Seem to be resident in this area of the park.",
    speciesType: "bird"
  }
];