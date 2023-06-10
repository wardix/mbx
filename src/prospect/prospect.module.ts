import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProspectService } from './prospect.service';
import { ProspectController } from './prospect.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ProspectController],
  providers: [ProspectService],
  exports: [ProspectService],
})
export class ProspectModule {}
