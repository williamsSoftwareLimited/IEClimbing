import { Crag } from '../types/climbing';

export const mockCrags: Crag[] = [
  {
    id: 'dalkey-quarry',
    name: 'Dalkey Quarry',
    county: 'Dublin',
    approachMinutes: 5,
    routes: [
      {
        id: 'fantasy-island',
        name: 'Fantasy Island',
        grade: 'VS 4c',
        style: 'trad',
        lengthMetres: 18,
        description: 'Popular crack and face climbing with solid gear placements.',
      },
      {
        id: 'eliminate-a',
        name: 'Eliminate A',
        grade: 'E1 5b',
        style: 'trad',
        lengthMetres: 20,
        description: 'Steeper wall climbing with technical moves through the middle section.',
      },
    ],
  },
  {
    id: 'fair-head',
    name: 'Fair Head',
    county: 'Antrim',
    approachMinutes: 25,
    routes: [
      {
        id: 'midnight-cruiser',
        name: 'Midnight Cruiser',
        grade: 'HVS 5a',
        style: 'trad',
        lengthMetres: 30,
        description: 'Classic corner pitch on compact dolerite with varied protection.',
      },
      {
        id: 'fireball',
        name: 'Fireball',
        grade: 'E3 5c',
        style: 'trad',
        lengthMetres: 35,
        description: 'A sustained and committing line on one of Ireland’s best sea cliffs.',
      },
    ],
  },
];
