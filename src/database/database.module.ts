import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load the .env file
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to make ConfigService available
      inject: [ConfigService], // Inject the ConfigService
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'), // Use the URI from the .env file
      }),
    }),
  ],
  exports: [MongooseModule], // Export the Mongoose module for global use
})
export class DatabaseModule implements OnModuleInit {
  constructor(private config: ConfigService) {}
  async onModuleInit() {
    try {
      await this.connectToDatabase();
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  private async connectToDatabase() {
    return MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: this.config.get<string>('DATABASE_URL'),
      }),
    });
  }
}
