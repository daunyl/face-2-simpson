const CLIENT_NAV_KEYS: {
  path: string;
  name: string;
  iconKey: string;
  newTab?: boolean;
}[] = [
  {
    path: '/',
    name: 'Home',
    iconKey: 'home',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    iconKey: 'dashboard',
  },
  {
    path: 'https://github.com/ruslankotliar/face-2-simpson',
    name: 'GitHub',
    iconKey: 'github',
    newTab: true,
  },
  {
    path: '/retrain',
    name: 'Retrain',
    iconKey: 'retrain',
  },
];

export { CLIENT_NAV_KEYS };