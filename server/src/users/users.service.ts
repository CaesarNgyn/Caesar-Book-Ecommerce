import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await this.userModel.create({ ...rest, password: hashedPassword })

    return createdUser;
  }

  async findAll() {
    // const users = await User.find().select('-password').lean()
    const findAllUsers = await this.userModel.find({})
    return findAllUsers;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found'
    }
    const user = await this.userModel.findById(id)
    return user
  }

  async findOneByUsername(username: string) {

    const user = await this.userModel.findOne({ email: username })
    // console.log(user)
    return user
  }

  async update(updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) {
      return 'User not found'
    }
    return this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found'
    }
    const deleteUserById = await this.userModel.deleteOne({ _id: id })
    return deleteUserById
  }
}
