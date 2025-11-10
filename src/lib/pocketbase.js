import PocketBase from 'pocketbase';

const pb = new PocketBase('https://aurelien.pb.andy-cinquin.fr');
pb.autoCancellation(false);

export default pb;