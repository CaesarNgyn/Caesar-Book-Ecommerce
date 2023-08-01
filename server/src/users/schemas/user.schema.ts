import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';

export type UserDocument = HydratedDocument<User> & SchemaTimestampsConfig;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  fullName: string;

  @Prop()
  role: string;

  @Prop()
  avatar: string;

  @Prop()
  phone: string;

  @Prop()
  refreshToken: string

}

export const UserSchema = SchemaFactory.createForClass(User);