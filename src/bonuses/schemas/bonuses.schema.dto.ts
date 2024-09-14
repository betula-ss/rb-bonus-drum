import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ versionKey: false })
export class Bonus {
    @Prop({ type: String, default: uuidv4 })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, default: 0 })
    chance: number;
}

export type BonusDocument = Bonus & Document;
export const BonusSchema = SchemaFactory.createForClass(Bonus);