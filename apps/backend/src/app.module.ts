import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AiModule } from './modules/ai/ai.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AdminModule } from './modules/admin/admin.module';
import { VisitRequestsModule } from './modules/visit-requests/visit-requests.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AiModule,
    UsersModule,
    AuthModule,
    AdminModule,
    AgenciesModule,
    AnnouncementsModule,
    VisitRequestsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
