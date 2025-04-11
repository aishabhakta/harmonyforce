// export interface Tournament {
//   id: number;
//   name: string;
//   university: string;
//   logo: string;
//   status: "APPLY" | "VIEW" | "UPCOMING";
//   description: string;
//   start_date: string;
//   end_date: string;
// }

// export interface Match {
//   match_id: number;
//   tournament_id: number;
//   team1_name: string;
//   team2_name: string;
//   score_team1: number;
//   score_team2: number;
//   winner: string;
// }

// export const dummyTournaments: Tournament[] = [
//   {
//     id: 1,
//     name: "A New World Tournament",
//     university: "RIT",
//     logo: "https://via.placeholder.com/50",
//     status: "APPLY",
//     description: "Current tournament to determine the best in the world.",
//     start_date: "2025-03-24",
//     end_date: "2025-04-01",
//   },
//   {
//     id: 2,
//     name: "Spring Showdown",
//     university: "Cornell",
//     logo: "https://via.placeholder.com/50",
//     status: "VIEW",
//     description: "An intense spring competition among top universities.",
//     start_date: "2024-04-01",
//     end_date: "2024-04-07",
//   },
//   {
//     id: 3,
//     name: "Midwest Mayhem",
//     university: "University of Michigan",
//     logo: "https://via.placeholder.com/50",
//     status: "VIEW",
//     description: "Clash of titans from the Midwest region.",
//     start_date: "2024-05-10",
//     end_date: "2024-05-15",
//   },
//   {
//     id: 4,
//     name: "Battle of the Best",
//     university: "NYU",
//     logo: "https://via.placeholder.com/50",
//     status: "UPCOMING",
//     description: "An upcoming battle of champions.",
//     start_date: "2025-08-12",
//     end_date: "2025-08-18",
//   },
// ];

// export const dummyMatches: Match[] = [
//   {
//     match_id: 31,
//     tournament_id: 1,
//     team1_name: "Team Beta",
//     team2_name: "Team Tau",
//     score_team1: 3,
//     score_team2: 2,
//     winner: "Team Beta",
//   },
//   {
//     match_id: 101,
//     tournament_id: 1,
//     team1_name: "Team Alpha",
//     team2_name: "Team Beta",
//     score_team1: 1,
//     score_team2: 3,
//     winner: "Team Beta",
//   },
//   {
//     match_id: 201,
//     tournament_id: 2,
//     team1_name: "Team Cornell",
//     team2_name: "Team Yale",
//     score_team1: 5,
//     score_team2: 4,
//     winner: "Team Cornell",
//   },
//   {
//     match_id: 301,
//     tournament_id: 3,
//     team1_name: "Team Wolverine",
//     team2_name: "Team Spartan",
//     score_team1: 2,
//     score_team2: 1,
//     winner: "Team Wolverine",
//   },
//   {
//     match_id: 401,
//     tournament_id: 4,
//     team1_name: "Team NYU",
//     team2_name: "Team Columbia",
//     score_team1: 0,
//     score_team2: 0,
//     winner: "",
//   },
// ];

// dummyTournaments.ts
export const USE_DUMMY_TOURNAMENTS = true;

export interface Match {
  match_id: number;
  tournament_id: number;
  team1: string;
  team2: string;
  score_team1: number;
  score_team2: number;
  winner?: string; // Optional – only exists for "VIEW" tournaments
}

export interface Tournament {
  id: number;
  name: string;
  university: string;
  logo: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "APPLY" | "RESULTS" | "VIEW";
  matches: Match[];
}

export const dummyTournaments: Tournament[] = [
  {
    id: 1,
    name: "A New World Tournament",
    university: "RIT",
    logo: "https://via.placeholder.com/50",
    description: "The ultimate bracket challenge for universities.",
    start_date: "2025-03-24",
    end_date: "2025-03-30",
    status: "APPLY",
    matches: [
      {
        match_id: 1,
        tournament_id: 1,
        team1: "Team Alpha",
        team2: "Team Beta",
        score_team1: 0,
        score_team2: 0,
      },
      {
        match_id: 2,
        tournament_id: 1,
        team1: "Team Gamma",
        team2: "Team Delta",
        score_team1: 0,
        score_team2: 0,
      },
    ],
  },
  {
    id: 2,
    name: "Spring Showdown",
    university: "MIT",
    logo: "https://via.placeholder.com/50",
    description: "Battle of minds and reflexes.",
    start_date: "2025-04-15",
    end_date: "2025-04-17",
    status: "VIEW",
    matches: [
      {
        match_id: 1,
        tournament_id: 2,
        team1: "Team Epsilon",
        team2: "Team Zeta",
        score_team1: 0,
        score_team2: 0,
      },
    ],
  },
  {
    id: 3,
    name: "Legends Cup",
    university: "Stanford",
    logo: "https://via.placeholder.com/50",
    description: "Where legends are born.",
    start_date: "2024-12-10",
    end_date: "2024-12-12",
    status: "RESULTS",
    matches: [
      {
        match_id: 31,
        tournament_id: 3,
        team1: "Team Sigma",
        team2: "Team Tau",
        score_team1: 5,
        score_team2: 4,
        winner: "Team Sigma", // final match
      },
      {
        match_id: 1,
        tournament_id: 3,
        team1: "Team Epsilon",
        team2: "Team Zeta",
        score_team1: 6,
        score_team2: 2,
        winner: "Team Epsilon",
      },
      {
        match_id: 2,
        tournament_id: 3,
        team1: "Team Alpha2",
        team2: "Team Beta2",
        score_team1: 1,
        score_team2: 2,
        winner: "Team Beta2",
      },
    ],
  },
  {
    id: 4,
    name: "Campus Clash",
    university: "NYU",
    logo: "https://via.placeholder.com/50",
    description: "NYU's annual battle royale.",
    start_date: "2025-05-01",
    end_date: "2025-05-03",
    status: "VIEW",
    matches: [],
  },
  {
    id: 5,
    name: "The Code War",
    university: "Carnegie Mellon",
    logo: "https://via.placeholder.com/50",
    description: "Coders compete, only the best survive.",
    start_date: "2025-06-10",
    end_date: "2025-06-12",
    status: "VIEW",
    matches: [],
  },
];
