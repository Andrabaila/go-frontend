import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PlayersModule } from './players/players.module.js';
import { GameObjectsModule } from './game-objects/game-objects.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './players/player.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { User } from './users/user.entity.js';
import { TileModule } from './tiles/tile.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'very-secret-password',
      database: 'go_game',
      entities: [Player, User],
      synchronize: true,
    }),
    PlayersModule,
    GameObjectsModule,
    AuthModule,
    UsersModule,
    TileModule,
  ],
  controllers: [AppController], // <── UsersController УБРАТЬ
  providers: [AppService], // <── UsersService УБРАТЬ
})
export class AppModule {}
