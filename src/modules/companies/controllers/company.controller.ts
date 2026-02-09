import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { JwtAuthGuard } from '../../../core/decorators/public.decorators';

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  async findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  async findOne(@Param('id') id: string) {
    return this.companyService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get company by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.companyService.findByIdentifier(slug);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update company' })
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Put(':id/subscription')
  @ApiOperation({ summary: 'Update company subscription' })
  async updateSubscription(@Param('id') id: string, @Body() subscription: any) {
    return this.companyService.updateSubscription(id, subscription);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  async remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Get(':id/subsidiaries')
  @ApiOperation({ summary: 'Get company subsidiaries' })
  async getSubsidiaries(@Param('id') id: string) {
    return this.companyService.getSubsidiaries(id);
  }
}
