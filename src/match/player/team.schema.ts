import { Schema, Document } from 'mongoose';
import { Player } from './player.schema'; // Import the Player interface

export interface Team extends Document {
  name: string;
  players: Player[]; // Array of players in the team
}

// Define the Mongoose schema for the team model
export const TeamSchema = new Schema<Team>({
  name: { type: String, required: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }], // Reference to Player model
});