import test from 'node:test';
import {verifyCupRevision} from './cup-invariants';
test('cup changes retain preceding frontend and multiplayer source bytes',verifyCupRevision);
