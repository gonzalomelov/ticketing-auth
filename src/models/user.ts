import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends UserAttrs, Document {}

const userSchema = new Schema<UserDoc>({
  email: { type: String, required: true },
  password: { type: String, required: true }
})

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = async ({ email, password }: UserAttrs) => {
  return new User({ email, password });
};

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };