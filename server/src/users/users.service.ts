import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto

    const isExist = await this.userModel.findOne({ email: createUserDto.email })

    if (isExist) {
      throw new BadRequestException(`Email ${createUserDto.email} đã tồn tại. Vui lòng đăng ký Email khác.`)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await this.userModel.create({ ...rest, password: hashedPassword })

    return createdUser;
  }

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    // console.log('>>filter', filter)

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // using mongoose regular expression
    // const result = await this.userModel.find({ name: { $regex: 'vin', $options: 'i' } })

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .sort(sort)
      .select('-password')


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    };
  }


  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'User not found'
    }
    const user = await this.userModel.findOne({ _id: id }).select('-password')
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
    const user = await this.userModel.findOne({ _id: id })
    const deleteUserById = await this.userModel.softDelete({ _id: id })
    return deleteUserById
  }

  async register(registerUserDto: RegisterUserDto) {
    const { password, ...rest } = registerUserDto

    const isExist = await this.userModel.findOne({ email: registerUserDto.email })

    if (isExist) {
      throw new BadRequestException(`Email ${registerUserDto.email} đã tồn tại. Vui lòng đăng ký Email khác.`)
    }
    const hashedPassword = await bcrypt.hash(password, 10)


    const createdUser = await this.userModel.create({
      ...rest,
      password: hashedPassword,
      role: "USER",
      avatar: 'user-1691143487595.png'
    })
    return createdUser
  }


  setRefreshToken = async (refresh_token: string, _id: string) => {
    return await this.userModel.findOneAndUpdate({
      _id
    },
      { refreshToken: refresh_token }
    )
  }


  async findOneByToken(refresh_token: string) {

    const user = (await this.userModel.findOne({ refreshToken: refresh_token }).select('-password'))

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user
  }


}
