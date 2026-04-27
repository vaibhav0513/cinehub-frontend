export type MovieFormat = '2D' | '3D' | 'IMAX' | '4DX' | 'IMAX 3D'
export type MovieLanguage = 'Hindi' | 'English' | 'Tamil' | 'Telugu' | 'Marathi' | 'Malayalam'
export type MovieGenre = 'Action' | 'Comedy' | 'Drama' | 'Horror' | 'Romance' | 'Sci-Fi' | 'Thriller' | 'Animation'

export interface Movie {
  id: string
  title: string
  genre: MovieGenre[]
  language: MovieLanguage
  rating: number
  votes: string
  poster: string
  backdrop: string
  duration: number
  releaseDate: string
  format: MovieFormat[]
  tag?: string
  tagColor?: string
  description: string
  director: string
  cast: string[]
  certificate: 'U' | 'UA' | 'A'
  isNew?: boolean
  isTrending?: boolean
}

export const ALL_MOVIES: Movie[] = [
  {
    id: '1', title: 'Kalki 2898 AD', genre: ['Sci-Fi', 'Action'], language: 'Telugu',
    rating: 8.4, votes: '142K',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
    duration: 181, releaseDate: 'Jun 27, 2024', format: ['2D', '3D', 'IMAX'],
    tag: 'Blockbuster', tagColor: '#ff3b5c',
    description: 'A mythological sci-fi epic set in the dystopian city of Kasi.',
    director: 'Nag Ashwin', cast: ['Prabhas', 'Deepika Padukone', 'Amitabh Bachchan'], certificate: 'UA', isTrending: true,
  },
  {
    id: '2', title: 'Stree 2', genre: ['Horror', 'Comedy'], language: 'Hindi',
    rating: 8.9, votes: '198K',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&h=600&fit=crop',
    duration: 145, releaseDate: 'Aug 15, 2024', format: ['2D', '4DX'],
    tag: 'Superhit', tagColor: '#f59e0b',
    description: 'The terror returns to Chanderi with a new chilling form.',
    director: 'Amar Kaushik', cast: ['Shraddha Kapoor', 'Rajkummar Rao', 'Pankaj Tripathi'], certificate: 'UA', isTrending: true,
  },
  {
    id: '3', title: 'Pushpa 2: The Rule', genre: ['Action', 'Drama'], language: 'Telugu',
    rating: 7.6, votes: '76K',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1400&h=600&fit=crop',
    duration: 190, releaseDate: 'Dec 5, 2024', format: ['2D', '3D', 'IMAX', '4DX'],
    tag: 'New', tagColor: '#00e5a0',
    description: 'Pushpa Raj expands his empire while facing a formidable new enemy.',
    director: 'Sukumar', cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'], certificate: 'UA', isNew: true,
  },
  {
    id: '4', title: 'Singham Again', genre: ['Action'], language: 'Hindi',
    rating: 6.8, votes: '54K',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&h=600&fit=crop',
    duration: 175, releaseDate: 'Nov 1, 2024', format: ['2D', 'IMAX'],
    description: 'ACP Singham returns in an epic battle of good vs evil.',
    director: 'Rohit Shetty', cast: ['Ajay Devgn', 'Kareena Kapoor', 'Ranveer Singh'], certificate: 'UA',
  },
  {
    id: '5', title: 'The Buckingham Murders', genre: ['Thriller', 'Drama'], language: 'Hindi',
    rating: 7.2, votes: '31K',
    poster: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1400&h=600&fit=crop',
    duration: 100, releaseDate: 'Sep 13, 2024', format: ['2D'],
    tag: 'Award Winner', tagColor: '#a78bfa',
    description: 'A grieving detective investigates the murder of a child.',
    director: 'Hansal Mehta', cast: ['Kareena Kapoor', 'Ash Tandon'], certificate: 'UA',
  },
  {
    id: '6', title: 'Devara: Part 1', genre: ['Action', 'Drama'], language: 'Telugu',
    rating: 6.5, votes: '48K',
    poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=600&fit=crop',
    duration: 166, releaseDate: 'Sep 27, 2024', format: ['2D', '3D', 'IMAX'],
    description: 'A fearless sea-lord fights against ruthless forces of evil.',
    director: 'Koratala Siva', cast: ['Jr. NTR', 'Janhvi Kapoor', 'Saif Ali Khan'], certificate: 'UA',
  },
  {
    id: '7', title: 'Vettaiyan', genre: ['Action', 'Thriller'], language: 'Tamil',
    rating: 7.4, votes: '29K',
    poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&h=600&fit=crop',
    duration: 169, releaseDate: 'Oct 10, 2024', format: ['2D', '3D'],
    tag: 'Must Watch', tagColor: '#00e5a0',
    description: 'A veteran cop faces a crisis when his son joins the force.',
    director: 'TJ Gnanavel', cast: ['Rajinikanth', 'Amitabh Bachchan', 'Fahadh Faasil'], certificate: 'UA', isTrending: true,
  },
  {
    id: '8', title: 'Lucky Baskhar', genre: ['Drama', 'Thriller'], language: 'Telugu',
    rating: 8.1, votes: '67K',
    poster: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&h=600&fit=crop',
    duration: 155, releaseDate: 'Oct 31, 2024', format: ['2D'],
    tag: 'Hidden Gem', tagColor: '#ffd166',
    description: 'A bank employee stumbles into money laundering chaos.',
    director: 'Venky Atluri', cast: ['Dulquer Salmaan', 'Meenakshi Chaudhary'], certificate: 'UA', isNew: true,
  },
]

export const FILTER_OPTIONS = {
  languages: ['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Malayalam'],
  genres: ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'],
  formats: ['All', '2D', '3D', 'IMAX', '4DX'],
  sort: ['Popularity', 'Rating', 'Release Date', 'Name A-Z'],
}