import { Schema, Document } from 'mongoose';

export interface Player extends Document {
  name: string;
  rank: number;
  score: number;
  wide: number;
  noBall: number;
  legByes: number;
  bye: number;
  striker: boolean;
  isPlaying: boolean;
  out: boolean;
  numBall: number;
  isBowler: boolean;
  wicketsTaken: number;
  ballsBowled: number;
  extrasGiven: number;
  runGiven:number;
  team: string; // New field for team name
}

// Define the Mongoose schema for the player model
export const PlayerSchema = new Schema<Player>({
  name: { type: String, required: true },
  rank: { type: Number, required: true },
  score: { type: Number, default: 0 },
  wide: { type: Number, default: 0 },
  noBall: { type: Number, default: 0 },
  legByes: { type: Number, default: 0 },
  bye: { type: Number, default: 0 },
  striker: { type: Boolean, default: false },
  isPlaying: { type: Boolean, default: false },
  out: { type: Boolean, default: false },
  numBall: { type: Number, default: 0 },
  isBowler: { type: Boolean, default: false },
  wicketsTaken: { type: Number, default: 0 },
  ballsBowled: { type: Number, default: 0 },
  extrasGiven: { type: Number, default: 0 },
  runGiven:{type:Number,default:0},
  team: { type: String, required: true }, // Initialize team field
});