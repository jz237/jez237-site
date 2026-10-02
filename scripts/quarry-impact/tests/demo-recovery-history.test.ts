import test from 'node:test';
import {verifyDemoRecoveryRevision} from './demo-recovery-invariants';
test('camera recovery release preserves every prior revision snapshot',()=>verifyDemoRecoveryRevision());
