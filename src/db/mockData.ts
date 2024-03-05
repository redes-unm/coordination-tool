import {
  Annotation, Campaign, CampaignAnnotationPairing, Collaborator, Community, Task, User,
} from './types';

export const communities: Community[] = [
  {
    id: 'community0',
    name: 'Georgia Tech',
    defaultCampaignId: 'campaign0',
  },
  {
    id: 'community1',
    name: 'Emory',
    defaultCampaignId: 'campaign0',
  },
];

export const campaigns: Campaign[] = [
  {
    id: 'campaign0',
    communityId: 'community0',
    name: 'uncategorized',
  },
  {
    id: 'campaign1',
    communityId: 'community0',
    name: 'Measure campus',
  },
  {
    id: 'campaign2',
    communityId: 'community0',
    name: 'Measure Home Park',
  },
];

export const annotations: Annotation[] = [
  {
    id: 'annotation0',
    communityId: 'community0',
    name: 'Klaus building',
    type: 'infra',
    visible: true,
    geojson: { type: 'Point', coordinates: [-84.3963, 33.7772] },
  },
  {
    id: 'annotation1',
    communityId: 'community0',
    name: 'CoC building',
    type: 'infra',
    visible: true,
    geojson: { type: 'Point', coordinates: [-84.3972, 33.7773] },
  },
  {
    id: 'annotation2',
    communityId: 'community0',
    name: 'main campus',
    type: 'region',
    visible: false,
    geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [-84.40721130335966, 33.78146868021399],
          [-84.39179443631156, 33.781410567041206],
          [-84.39078062872775, 33.771617934347674],
          [-84.39885613051518, 33.77141451467952],
          [-84.40004473250934, 33.770978613764214],
          [-84.40245689538126, 33.77301279906288],
          [-84.40556823589634, 33.77420422802362],
          [-84.40682675565535, 33.775802460364275],
          [-84.40584790695397, 33.777284430982164],
          [-84.4064072490692, 33.77818522412362],
          [-84.40714138559542, 33.779434695701255],
          [-84.40721130335966, 33.78146868021399],
        ],
      ],
    },
  },
  {
    id: 'annotation3',
    communityId: 'community0',
    name: 'Tech Square',
    type: 'region',
    visible: true,
    geojson: {
      type: 'Polygon',
      coordinates: [
        [
          [-84.39042545928058, 33.77893750425781],
          [-84.38294442480331, 33.77893750425781],
          [-84.38294442480331, 33.774610477507025],
          [-84.39042545928058, 33.774610477507025],
          [-84.39042545928058, 33.77893750425781],
        ],
      ],
    },
  },
  {
    id: 'annotation4',
    communityId: 'community0',
    name: 'Home Park Park',
    type: 'poi',
    visible: true,
    geojson: { type: 'Point', coordinates: [-84.39990549471283, 33.78242533958185] },
  },
];

export const campaignAnnotationPairings: CampaignAnnotationPairing[] = [
  { campaignId: 'campaign0', annotationId: 'annotation0' },
  { campaignId: 'campaign0', annotationId: 'annotation1' },
  { campaignId: 'campaign0', annotationId: 'annotation2' },
  { campaignId: 'campaign0', annotationId: 'annotation3' },
  { campaignId: 'campaign0', annotationId: 'annotation4' },
  { campaignId: 'campaign1', annotationId: 'annotation0' },
  { campaignId: 'campaign1', annotationId: 'annotation1' },
  { campaignId: 'campaign1', annotationId: 'annotation2' },
  { campaignId: 'campaign1', annotationId: 'annotation3' },
  { campaignId: 'campaign2', annotationId: 'annotation4' },
];

export const tasks: Task[] = [
  {
    id: 'task0',
    campaignId: 'campaign1',
    name: 'recruit students to measure',
    priority: 'high',
    status: 'in progress',
  },
  {
    id: 'task1',
    campaignId: 'campaign1',
    name: 'plan measurement areas',
    priority: 'high',
    status: 'done',
  },
  {
    id: 'task2',
    campaignId: 'campaign1',
    name: 'measure around Klaus building',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'task3',
    campaignId: 'campaign1',
    name: 'measure around CoC building',
    priority: 'low',
    status: 'todo',
  },
  {
    id: 'task4',
    campaignId: 'campaign1',
    name: 'measure around TSRB',
    priority: 'medium',
    status: 'done',
  },
  {
    id: 'task5',
    campaignId: 'campaign1',
    name: 'measure around Coda',
    priority: 'medium',
    status: 'in progress',
  },
  {
    id: 'task6',
    campaignId: 'campaign2',
    name: 'determine houses for measurements',
    priority: 'high',
    status: 'in progress',
  },
  {
    id: 'task7',
    campaignId: 'campaign2',
    name: 'obtain permission to measure at selected houses',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'task8',
    campaignId: 'campaign0',
    name: 'plan measurement campaigns',
    priority: 'high',
    status: 'in progress',
  },
];

export const users: User[] = [
  {
    id: 'user0',
    email: 'jason@example.com',
    name: 'Jason Cox',
  },
  {
    id: 'user1',
    email: 'beatriz@example.com',
    name: 'Beatriz Palacios Abad',
  },
  {
    id: 'user2',
    email: 'someguy@example.com',
    name: 'Some Guy',
  },
  {
    id: 'user3',
    email: 'somelady@example.com',
    name: 'Some Lady',
  },
];

export const collaborators: Collaborator[] = [
  {
    communityId: 'community0',
    userId: 'user0',
  },
  {
    communityId: 'community0',
    userId: 'user1',
  },
  {
    communityId: 'community0',
    userId: 'user3',
  },
];
