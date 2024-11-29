import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './player/player.schema'; // Correct import
import { PlayerActionDto } from './dto/playerAction.dto';
import { Team } from './player/team.schema';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>, // Inject Player model
    @InjectModel('Team') private readonly teamModel: Model<Team>, 
  ) {}


  async createTeams(teamsData: { teams: { name: string; players: { name: string; rank: number; isBowler: boolean; }[]; }[] }): Promise<Team[]> {
    const createdTeams = [];

    for (const teamData of teamsData.teams) {
        const players = teamData.players.map(player => ({
            name: player.name,
            rank: player.rank,
            score: 0,
            wide: 0,
            noBall: 0,
            legByes: 0,
            bye: 0,
            striker: player.rank<2, 
            isPlaying: player.rank <3,
            out: false,
            numBall: 0,
            isBowler: player.isBowler,
            team: teamData.name, // Set the team name for each player
        }));

        const createdPlayers = await this.playerModel.insertMany(players);
        const team = new this.teamModel({ name: teamData.name, players: createdPlayers.map(player => player._id) });
        createdTeams.push(await team.save());
    }
 
    return createdTeams;
}

async getBowlers(team: string){
  const players = await this.playerModel.find().exec();

  const teamPlayers = players.filter(player => player.team === team);

  const bowlerFromSecondTeam= teamPlayers.filter(player => player.isBowler);
  // console.log("line 83",bowlerFromSecondTeam);

  const bowlers= bowlerFromSecondTeam.map(player =>({
    name:player.name,
    runGiven:player.runGiven,
    numOfBowlBowled: player.ballsBowled
  }))
  return bowlers;

}


async getStrikerNNonStriker(team: string){
  const players = await this.playerModel.find().exec();

  const teamPlayers = players.filter(player => player.team === team);

  const twoBatters= teamPlayers.filter(player => player.isPlaying);
  const striker = twoBatters.find(player => player.striker === true);
  const nonStriker = twoBatters.find(player => player.striker === false);

  const result = {
    striker: {
      name: striker ? striker.name : null,
      runs: striker ? striker.score : 0,
      balls: striker? striker.numBall : 0
    },
    nonStriker: {
      name: nonStriker ? nonStriker.name : null,
      runs: nonStriker ? nonStriker.score : 0,
      balls: nonStriker ? nonStriker.numBall: 0
    }
  };

  return result;

}




//   async initializePlayers(playerNames: string[]): Promise<Player[]> {
//     // Create an array of Player documents
//     const players = playerNames.map((name, index) => ({
//       name,
//       rank:index+1,
//       score: 0,
//       wide: 0,
//       noBall: 0,
//       legByes: 0,
//       bye: 0,
//       striker: index < 1, // Set striker to true for the first two players
//       isPlaying: index <2,
//       out: false,
//       numBall: 0,
//   }));

//     // Insert players into the database
//     const createdPlayers = await this.playerModel.insertMany(players);
//     return createdPlayers;
// }

async getPlayerScorecardMatch(firstTeam: string,secondTeam:string)
// : Promise<{ name: string; runs: number; ballsPlayed: number }[]> 
{
  // Fetch all players from the database
  const players = await this.playerModel.find().exec();

  // Validate if the team exists
  const firstTeamPlayers = players.filter(player => player.team === firstTeam); // Assuming 'team' is the field for team name
  const secondTeamPlayers = players.filter(player => player.team === secondTeam);
  if (firstTeamPlayers.length === 0) {
    throw new Error(`Team "${firstTeam}" does not exist in the database.`);
  }
  if(secondTeamPlayers.length ===0){
    throw new Error(`Team "${secondTeam}" does not exist in the database.`);
  }

  // Filter players who are currently playing (not out)
  const currentlyPlaying = firstTeamPlayers.filter(player => player.isPlaying);
  // console.log("line 78",currentlyPlaying);
  const bowlerFromSecondTeam= secondTeamPlayers.filter(player => player.isBowler && player.ballsBowled>0 );
  // console.log("line 83",bowlerFromSecondTeam);

  // Filter players who have played and are out
  const playedAndOut = firstTeamPlayers.filter(player => player.out);

  // Combine both arrays
  const allPlayers = [...playedAndOut, ...currentlyPlaying];
  
  // Map to desired format
    const batting = allPlayers.map(player => ({
    name: player.name,
    runs: player.score, // Assuming 'score' is the field for runs
    ballsPlayed: player.numBall // Assuming 'numBall' is the field for balls played
  }));
  
  const bowling= bowlerFromSecondTeam.map(player =>({
    name:player.name,
    runGiven:player.runGiven,
    numOfBowlBowled: player.ballsBowled
  }))

  // console.log("line 104",secondTeamResult)

  // Return the combined result
  return {batting,bowling};
}
async getTeamScorecardMatch(firstTeam: string): Promise<{ totalRuns: number; totalOuts: number; totalBallsPlayed: number ,totalWide:number, totalNoBall:number,totalBye:number,totalLegBye:number }> {
  // Fetch all players from the database
  const players = await this.playerModel.find().exec();

  const teamPlayers = players.filter(player => player.team === firstTeam);
  // Initialize counters
  let totalRuns = 0;
  let totalOuts = 0;
  let totalBallsPlayed = 0;
  let totalWide=0;
  let totalNoBall=0;
  let totalBye=0;
  let totalLegBye=0;

  // Traverse through all players and accumulate the statistics
  teamPlayers.forEach(player => {
    totalRuns += player.score; // Assuming 'score' holds the runs
    if (player.out) {
      totalOuts += 1; // Increment out count if the player is out
    }
    totalBallsPlayed += player.numBall; // Assuming 'numBall' holds the number of balls played
    totalWide +=player.wide;
    totalNoBall +=player.noBall;
    totalBye += player.bye;
    totalLegBye +=player.legByes;
  });

  // console.log("line 184",totalNoBall);

  totalRuns= totalRuns+ totalWide+totalNoBall;
  // console.log("line 187",totalRuns)
  // Return the accumulated statistics
  return {
    totalRuns,
    totalOuts,
    totalBallsPlayed,
    totalWide,
    totalNoBall,
    totalBye,
    totalLegBye
  };
}

async processPlayerAction(playerActionDto: PlayerActionDto): Promise<{ player1?: Player, player2?: Player, nextPlayer?: Player }> {
  const { striker, nonStriker, run, wicket, bye, legByes, noBall, wide, strikerTeam, bowler } = playerActionDto;
  //  console.log("line203",playerActionDto);
  // Fetch all players from the database 
  const players = await this.playerModel.find().exec();
  const player1 = players.find(player => player.name === striker);
  const player2 = players.find(player => player.name === nonStriker);
  const bowlerPlayer = players.find(player => player.name === bowler);

  // Check if players exist
  if (!player1 || !player2 || !bowlerPlayer) {
      throw new Error('One or more players not found');
  }

  // Check if the striker's team matches the expected team
  if (player1.team !== strikerTeam) {
      throw new Error('Striker team does not match the player\'s team');
  }

  // Handle wicket scenario
  if (wicket) {
      player1.out = true; // Mark player 1 as out
      player1.isPlaying = false;
      player1.striker = false;
      player1.numBall+=1;
      await player1.save();

      const totalOuts = players.filter(player => player.out).length;
      // console.log("Total Outs:", totalOuts);

      if (totalOuts === 10) {
          return { player1, player2 }; // All players are out
      }

      // Find the next player to come in
      const nextPlayer = players.find(player => player.rank === totalOuts + 2);
      if (!nextPlayer) {
          throw new Error('Next player not found'); // Handle case where next player is not found
      }
      nextPlayer.striker = true;
      nextPlayer.isPlaying = true;
      await nextPlayer.save(); // Save the new player's state

      if (bowlerPlayer.isBowler) {

        bowlerPlayer.ballsBowled+=1;
        bowlerPlayer.wicketsTaken+=1;
        await bowlerPlayer.save(); // Save bowler stats
    }
      return { nextPlayer, player2 };
  }

  // Update bowler's statistics
  if (bowlerPlayer.isBowler) {
      bowlerPlayer.ballsBowled += 1; // Increment balls bowled
      if (wide) {
          bowlerPlayer.extrasGiven += 1; // Increment extras given for wide
      }
      if (noBall) {
          bowlerPlayer.extrasGiven += 1; // Increment extras given for no ball
      }
      else{
        bowlerPlayer.runGiven+=run;
      }
      await bowlerPlayer.save(); // Save bowler stats
  }

  // Update player stats based on the action
  if (wide) {
      // player1.score += run; // All runs are added to player 1's score
      player1.wide += 1; // Increment wide coun t
  } else if (noBall) {
      // player1.numBall += 1; // Batsman balls increase by 1
      player1.score += run; // All runs added to player 1's score
      player1.noBall += 1; // Increment noBall count

     
  } else {
      player1.score += run; // Add runs to player 1's score
      player1.numBall+=1;
  }

  if (legByes) {
      player1.legByes += 1; // Increment leg bye count
      player1.score += run; // All runs added to player 1's score
      player1.numBall+1;
  }

  if (bye) {
      player1.bye += run; // All runs added in extras as bye
  }

  // Handle odd runs for player 1
  if (run % 2 !== 0) {
      // If player 1 takes an odd number of runs, switch the striker
      player1.striker = !player1.striker;
      player2.striker = !player2.striker;
      await player1.save();
      await player2.save();
      return {player2,player1};
  }
 
  // Save the updated player stats back to the database
  await player1.save();
  await player2.save();

  // Return both players' data
  return { player1, player2 };
}

  // Fetch all players
  async getAllPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec(); // Fetch all player documents
  }
}
