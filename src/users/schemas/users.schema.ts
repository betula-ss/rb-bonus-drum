import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ versionKey: false })
export class User {
    @Prop({ type: String, default: uuidv4 })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, default: false })
    isInfluencer: boolean;

    @Prop({ default: null })
    lastScroll: Date | null;

    @Prop({ required: true, default: 0 })
    balance: number;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);