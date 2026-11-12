import test from 'node:test';
import {verifyStartupLatencyRevision} from './startup-latency-invariants';
import {verifyLoadingSpeedRevision} from './loading-speed-invariants';
test('startup concurrency preserves the preceding release bytes',()=>{verifyStartupLatencyRevision();verifyLoadingSpeedRevision();});
