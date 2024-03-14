import {
  Annotation, Campaign, CampaignAnnotationPairing, Collaborator, Community, Task, User,
} from './types';

export const communities: Community[] = [
  {
    id: 'community0',
    name: 'Georgia Tech',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sapien pellentesque habitant morbi tristique senectus et netus et. Et tortor consequat id porta nibh venenatis. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Tortor pretium viverra suspendisse potenti nullam ac tortor. Duis at consectetur lorem donec massa sapien faucibus et. Viverra vitae congue eu consequat ac felis donec. Neque volutpat ac tincidunt vitae semper quis lectus nulla. Tincidunt nunc pulvinar sapien et. Morbi tristique senectus et netus et malesuada fames. Vestibulum lectus mauris ultrices eros in. Vitae proin sagittis nisl rhoncus. Consequat nisl vel pretium lectus quam. Tristique senectus et netus et malesuada.

Urna et pharetra pharetra massa massa ultricies mi quis hendrerit. Sit amet justo donec enim diam vulputate ut pharetra. Euismod lacinia at quis risus. Ullamcorper morbi tincidunt ornare massa eget. Quis varius quam quisque id diam vel quam. Diam vel quam elementum pulvinar etiam non quam lacus. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Mattis nunc sed blandit libero volutpat. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Eu scelerisque felis imperdiet proin. Nunc scelerisque viverra mauris in aliquam sem. Dui faucibus in ornare quam viverra. Praesent tristique magna sit amet purus. Urna id volutpat lacus laoreet non curabitur gravida arcu ac. Sagittis eu volutpat odio facilisis mauris sit amet massa. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim tortor. In fermentum et sollicitudin ac. Eget dolor morbi non arcu.

Tortor id aliquet lectus proin nibh nisl. Turpis nunc eget lorem dolor sed viverra. Eget mi proin sed libero enim sed. Diam sollicitudin tempor id eu. Scelerisque purus semper eget duis. Neque vitae tempus quam pellentesque nec nam. Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc. Molestie a iaculis at erat pellentesque adipiscing. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Hendrerit dolor magna eget est lorem. Gravida in fermentum et sollicitudin ac orci phasellus. At urna condimentum mattis pellentesque id nibh tortor. Purus ut faucibus pulvinar elementum integer enim. Ipsum suspendisse ultrices gravida dictum. Justo donec enim diam vulputate. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse. Proin nibh nisl condimentum id venenatis a. Facilisis volutpat est velit egestas dui id ornare arcu.

Ultrices neque ornare aenean euismod. Diam donec adipiscing tristique risus nec feugiat. Sed nisi lacus sed viverra tellus in hac habitasse. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Lectus urna duis convallis convallis tellus id interdum velit laoreet. Id neque aliquam vestibulum morbi blandit cursus risus at. Hac habitasse platea dictumst quisque. Fringilla phasellus faucibus scelerisque eleifend donec. Turpis nunc eget lorem dolor sed viverra ipsum nunc aliquet. Sollicitudin nibh sit amet commodo nulla. Facilisis magna etiam tempor orci. Neque convallis a cras semper auctor neque vitae. Risus feugiat in ante metus dictum at tempor commodo ullamcorper. Elementum nisi quis eleifend quam adipiscing vitae proin. Sed libero enim sed faucibus turpis in eu. Accumsan lacus vel facilisis volutpat est velit egestas dui id. Sem fringilla ut morbi tincidunt augue interdum. Faucibus interdum posuere lorem ipsum dolor. Egestas erat imperdiet sed euismod nisi.`,
    defaultCampaignId: 'campaign0',
  },
  {
    id: 'community1',
    name: 'Emory',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    defaultCampaignId: 'campaign0',
  },
];

export const campaigns: Campaign[] = [
  {
    id: 'campaign0',
    communityId: 'community0',
    name: 'uncategorized',
    description: '',
  },
  {
    id: 'campaign1',
    communityId: 'community0',
    name: 'Measure campus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
  },
  {
    id: 'campaign2',
    communityId: 'community0',
    name: 'Measure Home Park',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
  },
];

export const annotations: Annotation[] = [
  {
    id: 'annotation0',
    communityId: 'community0',
    name: 'Klaus building',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    type: 'infra',
    visible: true,
    geometry: { type: 'Point', coordinates: [-84.3963, 33.7772] },
  },
  {
    id: 'annotation1',
    communityId: 'community0',
    name: 'CoC building',
    description: '',
    type: 'infra',
    visible: true,
    geometry: { type: 'Point', coordinates: [-84.3972, 33.7773] },
  },
  {
    id: 'annotation2',
    communityId: 'community0',
    name: 'main campus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    type: 'region',
    visible: false,
    geometry: {
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
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    type: 'region',
    visible: true,
    geometry: {
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
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    type: 'poi',
    visible: true,
    geometry: { type: 'Point', coordinates: [-84.39990549471283, 33.78242533958185] },
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
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    priority: 'high',
    status: 'in progress',
  },
  {
    id: 'task1',
    campaignId: 'campaign1',
    name: 'plan measurement areas',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    priority: 'high',
    status: 'done',
  },
  {
    id: 'task2',
    campaignId: 'campaign1',
    name: 'measure around Klaus building',
    description: '',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'task3',
    campaignId: 'campaign1',
    name: 'measure around CoC building',
    description: '',
    priority: 'low',
    status: 'todo',
  },
  {
    id: 'task4',
    campaignId: 'campaign1',
    name: 'measure around TSRB',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    priority: 'medium',
    status: 'done',
  },
  {
    id: 'task5',
    campaignId: 'campaign1',
    name: 'measure around Coda',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    priority: 'medium',
    status: 'in progress',
  },
  {
    id: 'task6',
    campaignId: 'campaign2',
    name: 'determine houses for measurements',
    description: '',
    priority: 'high',
    status: 'in progress',
  },
  {
    id: 'task7',
    campaignId: 'campaign2',
    name: 'obtain permission to measure at selected houses',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'task8',
    campaignId: 'campaign0',
    name: 'plan measurement campaigns',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus urna. Amet justo donec enim diam vulputate. Hendrerit gravida rutrum quisque non. Nam aliquam sem et tortor consequat id. Non quam lacus suspendisse faucibus. Ut sem viverra aliquet eget sit amet. Turpis massa tincidunt dui ut. Scelerisque varius morbi enim nunc faucibus a. Id diam maecenas ultricies mi eget mauris pharetra et. Lectus vestibulum mattis ullamcorper velit. Nisi lacus sed viverra tellus in hac habitasse platea. Non blandit massa enim nec dui nunc mattis. Nam libero justo laoreet sit amet cursus. Arcu risus quis varius quam quisque id diam. Facilisis gravida neque convallis a cras.',
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
