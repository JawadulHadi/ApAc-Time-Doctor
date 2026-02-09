import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../../companies/services/company.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly companyService: CompanyService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const companyIdentifier = this.extractCompanyIdentifier(req);

    if (!companyIdentifier) {
      throw new BadRequestException('Company not specified');
    }

    try {
      const company = await this.companyService.findByIdentifier(companyIdentifier);

      if (!company || !company.isActive) {
        throw new BadRequestException('Company not found or inactive');
      }

      if (company.subscription.status !== 'active' && company.subscription.status !== 'trial') {
        throw new BadRequestException('Company subscription is not active');
      }

      req['company'] = company;
      req['companyId'] = company._id;

      next();
    } catch (error) {
      throw new BadRequestException(`Invalid company: ${error.message}`);
    }
  }

  private extractCompanyIdentifier(req: Request): string {
    const host = req.get('host');

    if (host?.includes('.apac-dev.agilebrains.com')) {
      return host.split('.apac-dev.agilebrains.com')[0];
    }

    if (req.headers['x-company-id']) {
      return req.headers['x-company-id'] as string;
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.decode(token) as any;
        return decoded.companyId;
      } catch {
        return null;
      }
    }

    return null;
  }
}
