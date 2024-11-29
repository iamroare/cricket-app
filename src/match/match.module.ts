import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './player/player.schema';  // Correct import of Player schema
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TeamSchema } from './player/team.schema';

@Module({
  imports: [
    // Register Player schema with Mongoose
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),  // Make sure this is correct
     // Make sure this is correct
     MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]),
  ],
  providers: [MatchService],  // Register MatchService
  controllers: [MatchController],  // Register MatchController
})
export class MatchModule {}
