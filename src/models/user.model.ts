// user.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  // other fields as needed
}

export const UserModel = SchemaFactory.createForClass(User);
