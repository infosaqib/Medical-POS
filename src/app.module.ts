import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { MedicineModule } from './medicine/medicine.module';
import { AuthModule } from './auth/auth.module';
import { SalesModule } from './sales/sales.module';
import { CustomerModule } from './customer/customer.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [MedicineModule, AuthModule, SalesModule, CustomerModule, ServicesModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
