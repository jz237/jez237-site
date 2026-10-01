export const MAX_ONLINE_PLAYERS=24;
export const LEGACY_ONLINE_PLAYERS=8;
export type OnlineCapacity=8|24;
export const validCapacity=(value:unknown):value is OnlineCapacity=>value===8||value===24;
