import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company } from '../schemas/company.schema';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = new this.companyModel(createCompanyDto);
    return company.save();
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<Company> {
    return this.companyModel.findById(id).exec();
  }

  async findByIdentifier(identifier: string): Promise<Company> {
    return this.companyModel
      .findOne({
        $or: [
          { slug: identifier },
          { domain: identifier },
          { subdomain: identifier },
          { 'branding.customDomain': identifier },
        ],
        isActive: true,
      })
      .exec();
  }

  async findByCustomDomain(domain: string): Promise<Company> {
    return this.companyModel
      .findOne({
        'branding.customDomain': domain,
        isActive: true,
      })
      .exec();
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.companyModel.findByIdAndUpdate(id, { isActive: false }).exec();
  }

  async updateSubscription(id: string, subscription: any): Promise<Company> {
    return this.companyModel
      .findByIdAndUpdate(
        id,
        {
          subscription: {
            ...subscription,
            updatedAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();
  }

  async getSubsidiaries(parentId: string): Promise<Company[]> {
    return this.companyModel
      .find({
        parentCompany: parentId,
        isActive: true,
      })
      .exec();
  }
}
