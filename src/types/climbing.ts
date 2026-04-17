export type ClimbingRoute = {
  id: string;
  name: string;
  grade: string;
  style: 'sport' | 'trad' | 'boulder';
  lengthMetres: number;
  description: string;
};

export type Crag = {
  id: string;
  name: string;
  county: string;
  approachMinutes: number;
  routes: ClimbingRoute[];
};
