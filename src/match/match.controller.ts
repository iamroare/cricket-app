import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { MatchService } from './match.service';
import { PlayerActionDto } from './dto/playerAction.dto';
import { Team } from './player/team.schema';

@Controller('api/match')
export class MatchController {

    constructor(private readonly matchService: MatchService){}


    @Post('/create-teams')
    async createTeams(
        @Body() teamsData: { teams: { name: string; players: { name: string; rank: number; isBowler: boolean; }[]; }[] },
        @Res() res
    ){
    //   return this.matchService.createTeams(teamsData)
      try {
        const result= await  this.matchService.createTeams(teamsData);
        // console.log("line 20",result);
        return res.status(HttpStatus.CREATED).send(result);
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: "Error creating players.",
            error: error.message,
        });
      }
    }

    // @Post('/initialize-players')
    // async initializePlayers(
    //     @Body() playerNames: { names: string[] },  // Expecting an array of player names
    //     @Res() res
    // ) {
    //     // console.log("ileieenre ")
    //     try {
    //         if (playerNames.names.length !== 11) {
    //             return res.status(HttpStatus.BAD_REQUEST).send({
    //                 message: "You must provide exactly 11 player names."
    //             });
    //         }

    //         console.log("line 22",playerNames);
    //         const result = await this.matchService.initializePlayers(playerNames.names);
    //         return res.status(HttpStatus.CREATED).send(result);
    //     } catch (error) {
    //         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    //             message: "Error initializing players.",
    //             error: error.message,
    //         });
    //     }
    // }


    @Post('/player-action') 
    async handlePlayerAction(
        @Body() playerActionDto: PlayerActionDto, 
        @Res() res) {
        try {
            const result = await this.matchService.processPlayerAction(playerActionDto);
            return res.status(HttpStatus.OK).send(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: "Error processing player action.",
                error: error.message,
            });
        }
    }

    @Get("/player-scorecard")
    async getPlayerScorecard(
        @Query('firstTeam') firstTeam: string,
        @Query('secondTeam') secondTeam: string,
        @Res() res
    ){
        try {
            const result = await this.matchService.getPlayerScorecardMatch(firstTeam,secondTeam);
            return res.status(HttpStatus.OK).send(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: "Error in getting player scorecard",
                error: error.message,
            });
        }
    }

    @Get("/team-scorecard")
    async getTeamScorecard(
        @Query('team') team: string,
        @Res() res
    ){
        try {
            const result = await this.matchService.getTeamScorecardMatch(team);
            return res.status(HttpStatus.OK).send(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: "Error in getting team scorecard",
                error: error.message,
            });
        }
    }
    @Get("/get-bowlers")
    async getBowlers(
        @Query('team') team: string,
        @Res() res
    ){
        try {
            const result = await this.matchService.getBowlers(team);
            return res.status(HttpStatus.OK).send(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: "Error in getting bowlers of team",
                error: error.message,
            });
        }
    }

    @Get("/get-batters")
    async getStrikerNonStriker(
        @Query('team') team: string,
        @Res() res
    ){
        try {
            const result = await this.matchService.getStrikerNNonStriker(team);
            return res.status(HttpStatus.OK).send(result);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: "Error in getting striker and non striker of team",
                error: error.message,
            });
        }
    }

    @Get("/current")
    async getCurrentInfo(
        @Req() req,
        @Res() res
    ){
        const result = await this.matchService.getAllPlayers();
        // {"mewo ": "asdfasdf"};
        return res.status(HttpStatus.OK).send(result);
    }
}
