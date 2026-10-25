// Creates the one GPUDevice shared by the fluid solver and three.js.

import { RT_FEATURE } from '../rt/rt';
import { watchPipelines } from './pipelineCount';

/** Why the globes cannot run here: no WebGPU in the browser, no usable graphics device behind it,
 *  graphics code the browser's WebGPU rejects, or something else. */
export type SupportProblem = 'no-webgpu' | 'no-gpu' | 'shader' | 'other';

export class GpuUnsupportedError extends Error {
  constructor(
    readonly problem: SupportProblem,
    message: string,
  ) {
    super(message);
    this.name = 'GpuUnsupportedError';
  }
}

const SHADER_FAILURE = /wgsl|shader|pipeline|naga|abstract types|fluid solver setup|validation/i;

/** What a start-up failure means for the visitor (the full error stays in the console). */
export function classifyFailure(err: unknown): SupportProblem {
  if (err instanceof GpuUnsupportedError) return err.problem;
  const named = err instanceof Error ? `${err.name} ${err.message}` : String(err);
  return SHADER_FAILURE.test(named) ? 'shader' : 'other';
}

/** What the device runs on, for ?stats and ?bench (a phone's report names its GPU). */
export interface DeviceInfo {
  vendor: string;
  architecture: string;
  device: string;
  description: string;
  /** The features that decide what a phone can be given (timestamps to time it by, f16 maths,
   *  subgroups, the formats tier 1 adds), those of them it has. */
  features: string[];
  limits: { maxTextureDimension2D: number; maxStorageBuffersPerShaderStage: number; maxComputeWorkgroupStorageSize: number; maxBufferSize: number };
  /** Asked for the low-power GPU (?gpu=low; Chrome on Windows may keep the other). */
  lowPower: boolean;
}

/** The features DeviceInfo reports. */
const REPORTED = ['timestamp-query', 'shader-f16', 'subgroups', 'texture-formats-tier1'];

let info: DeviceInfo | null = null;

/** The device's report (once createDevice is done). */
export function deviceInfo(): DeviceInfo | null {
  return info;
}

export async function createDevice(): Promise<GPUDevice> {
  if (!('gpu' in navigator)) {
    throw new GpuUnsupportedError('no-webgpu', 'WebGPU is not available in this browser.');
  }

  // Hardware ray tracing where the browser offers it (?rt=0: trace in software anyway). A device
  // with it may fail to start (Chromium's GL interop on some setups): then one without it.
  const params = new URLSearchParams(location.search);
  const rt = params.get('rt') !== '0';
  // (?gpu=low, with ?stats or ?bench: the low-power GPU, where there are two - a laptop's
  // integrated one, nearer a phone's.)
  const lowPower = params.get('gpu') === 'low' && /[?&](stats|bench)\b/.test(location.search);
  let device = await requestDevice(rt, lowPower).catch((err: unknown) => {
    if (err instanceof GpuUnsupportedError || !rt) throw err;
    console.warn('[globes] no device with ray tracing, going without:', err);
    return null;
  });
  device ??= await requestDevice(false, lowPower).catch((err: unknown) => {
    if (err instanceof GpuUnsupportedError) throw err;
    throw new GpuUnsupportedError('no-gpu', `Could not create a WebGPU device: ${err instanceof Error ? err.message : String(err)}`);
  });

  device.lost.then((lost) => {
    if (lost.reason === 'destroyed') return;
    console.error('[globes] GPU device lost:', lost.message);
    recover();
  });
  // (?stats, ?bench and ?qa count the pipelines built, and time the bowl's: gpu/pipelineCount.ts.)
  if (/[?&](stats|bench|qa)\b/.test(location.search)) watchPipelines(device);

  return device;
}

async function requestDevice(rt: boolean, lowPower: boolean): Promise<GPUDevice> {
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: lowPower ? 'low-power' : 'high-performance' });
  if (!adapter) throw new GpuUnsupportedError('no-gpu', 'No WebGPU graphics adapter was found.');

  // Like three.js, ask for every feature the adapter offers.
  const requiredFeatures = [...adapter.features].filter((f) => rt || f !== RT_FEATURE) as GPUFeatureName[];

  // Raise the limits the solver leans on to whatever the hardware allows, and the size of a
  // texture (the picture of a screen wider or taller than 8192 pixels: an 8K ultrawide).
  const a = adapter.limits;
  const requiredLimits: Record<string, number> = {
    maxTextureDimension2D: a.maxTextureDimension2D,
    maxBufferSize: a.maxBufferSize,
    maxStorageBufferBindingSize: a.maxStorageBufferBindingSize,
    maxStorageBuffersPerShaderStage: a.maxStorageBuffersPerShaderStage,
    maxSampledTexturesPerShaderStage: a.maxSampledTexturesPerShaderStage,
    maxComputeWorkgroupsPerDimension: a.maxComputeWorkgroupsPerDimension,
    maxComputeInvocationsPerWorkgroup: a.maxComputeInvocationsPerWorkgroup,
    maxComputeWorkgroupStorageSize: a.maxComputeWorkgroupStorageSize,
  };

  const device = await adapter.requestDevice({ requiredFeatures, requiredLimits });
  // (A device that could not be made comes back lost.)
  const lost = await Promise.race([device.lost.then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), 0))]);
  if (lost && device.features.has(RT_FEATURE)) throw new Error('the device was lost as it was made');
  // (Chrome before 127, and its WebViews, have no adapter.info.)
  const ai: Partial<GPUAdapterInfo> = (adapter as { info?: GPUAdapterInfo }).info ?? {};
  const l = device.limits;
  info = {
    vendor: ai.vendor ?? '',
    architecture: ai.architecture ?? '',
    device: ai.device ?? '',
    description: ai.description ?? '',
    features: REPORTED.filter((f) => device.features.has(f)),
    limits: { maxTextureDimension2D: l.maxTextureDimension2D, maxStorageBuffersPerShaderStage: l.maxStorageBuffersPerShaderStage, maxComputeWorkgroupStorageSize: l.maxComputeWorkgroupStorageSize, maxBufferSize: l.maxBufferSize },
    lowPower,
  };
  return device;
}

const RECOVERIES_KEY = 'globes-recoveries';

/** Losing the device (the GPU process restarted under it: a driver fault, a reset) would leave
 *  the window blank for good, so start the page again, which makes a new one. The page can put
 *  what it needs to come back as it was in sessionStorage first (the 'globes-device-lost'
 *  event). Not more than three times in a minute, so a GPU that keeps failing is not hammered. */
function recover(): void {
  let times: number[] = [];
  try {
    times = JSON.parse(sessionStorage.getItem(RECOVERIES_KEY) ?? '[]') as number[];
  } catch {
    times = [];
  }
  const now = Date.now();
  times = times.filter((t) => now - t < 60_000);
  if (times.length >= 3) {
    console.error('[globes] the GPU keeps failing; not starting again');
    return;
  }
  try {
    sessionStorage.setItem(RECOVERIES_KEY, JSON.stringify([...times, now]));
  } catch {
    // (Without storage it still comes back, only without the limit.)
  }
  window.dispatchEvent(new Event('globes-device-lost'));
  setTimeout(() => location.reload(), 500);
}
