export interface Match {
  match_id: number;
  tournament_id: number;
  team1: string;
  team2: string;
  score_team1: number | null;
  score_team2: number | null;
  winner: string | null;
}

export interface Tournament {
  id: number;
  name: string;
  university: string;
  logo: string;
  status: "VIEW" | "UPCOMING" | "APPLY";
  start_date?: string;
  end_date?: string;
  description?: string;
}
