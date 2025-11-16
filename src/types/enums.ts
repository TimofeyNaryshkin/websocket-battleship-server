export enum AttackStatus {
  Miss = "miss",
  Killed = "killed",
  Shot = "shot",
}

export enum ShipSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  Huge = "huge",
}

export type ServerResponseType =
  | "create_game"
  | "update_room"
  | "reg"
  | "update_winners"
  | "attack"
  | "turn"
  | "finish"
  | "start_game";

export type ClientRequestType =
  | "create_room"
  | "add_user_to_room"
  | "reg"
  | "add_ships"
  | "attack"
  | "randomAttack";

export type CellState = 'empty' | 'ship' | 'hit' | 'miss';
export type Board = CellState[][]