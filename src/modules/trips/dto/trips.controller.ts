import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { TripsService } from './trips.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  findAll() { return this.tripsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.tripsService.findOne(+id); }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.tripsService.create({ ...body, creator: { id: req.user.userId } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.tripsService.update(+id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.tripsService.remove(+id); }
}