import args from './args';
import snapshotgun from './snapshotgun';

snapshotgun(process.cwd(), args(process.argv));
