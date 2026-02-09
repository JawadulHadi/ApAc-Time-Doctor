import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import path from 'path';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  PayloadTooLargeException,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiResponseDto } from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { Permission } from '../../core/decorators/permission.decorators';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { Permissions } from '../../types/enums/permissions.enum';
import * as jwtInterface from '../../types/interfaces/jwt.interface';
import { UploadDocumentDto } from '../document/dto/document.dto';
import { DocumentService } from './document.service';
import { Doc } from './schemas/document.schema';
import { Bucket, fileCategory, FileValidator, maxFileSize } from '@/types/enums/doc.enums';
@ApiTags('documents')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt-auth')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentService) {}
  @Get('')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_VIEW_COMPANY_RESOURCE)
  @ApiOperation({
    summary: 'Get all documents',
    description: 'Retrieve a paginated list of all documents accessible to the authenticated user',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10, max: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                description: 'Document object with metadata and file information',
              },
              description: 'Array of document objects',
            },
            total: { type: 'number', example: 50, description: 'Total number of documents' },
            page: { type: 'number', example: 1, description: 'Current page number' },
            limit: { type: 'number', example: 10, description: 'Items per page' },
            totalPages: { type: 'number', example: 5, description: 'Total number of pages' },
          },
        },
        message: { type: 'string', example: 'Documents retrieved successfully' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid JWT token required',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions to view documents',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Insufficient permissions' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  async getAllDocuments(
    mockUser?: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<{ documents: Doc[] }>> {
    const documents = await this.documentService.getAllDocuments();
    return ApiResponseDto.success({ documents }, 'Documents retrieved successfully');
  }
  @Post('upload')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_UPDATE_COMPANY_RESOURCE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a new document',
    description: 'Upload a document file with metadata to the system storage',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document file and metadata for upload',
    type: UploadDocumentDto,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file to upload',
        },
        title: {
          type: 'string',
          example: 'Employee Contract',
          description: 'Document title',
        },
        category: {
          type: 'string',
          enum: Object.values(fileCategory),
          example: fileCategory.PUBLIC,
          description: 'Document category',
        },
        isPublic: {
          type: 'boolean',
          example: true,
          description: 'Whether document is publicly accessible',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'object', description: 'Uploaded document details' },
        message: { type: 'string', example: 'Document uploaded successfully' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or validation error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Invalid file type. Allowed types: image/jpeg, image/png, application/pdf',
        },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid JWT token required',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Insufficient permissions' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 413,
    description: 'File size exceeds maximum limit',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'File size too large. Maximum allowed file size is 10MB.',
        },
        statusCode: { type: 'number', example: 413 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during upload',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  /**
   * Uploads a document to the server.
   * @param file The document to be uploaded.
   * @param uploadDto The document metadata.
   * @param req The requesting user.
   * @returns A promise that resolves to an ApiResponseDto object containing the uploaded document and a success message.
   * @throws PayloadTooLargeException if the document size exceeds the maximum allowed size.
   * @throws BadRequestException if the document type is not allowed.
   */
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: maxFileSize.maxFile,
            message: `File size too large. Maximum allowed file size is ${maxFileSize.maxFile / (1024 * 1024)}MB.`,
          }),
          new FileTypeValidator({
            fileType: FileValidator.allowedMime.join('|'),
          }),
        ],
        exceptionFactory: error => {
          if (
            error.includes('large') ||
            error.includes('size') ||
            error.includes('MaxFileSizeValidator')
          ) {
            throw new PayloadTooLargeException(
              `File size too large. Maximum allowed file size is ${maxFileSize.maxFile / (1024 * 1024)}MB.`,
            );
          }
          throw new BadRequestException(
            `Invalid file type. Allowed types: ${FileValidator.allowedMime.join(', ')}`,
          );
        },
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDto: UploadDocumentDto,
    @GetUser() req: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<any>> {
    const uploadedBy = new Types.ObjectId(req._id);
    const document = await this.documentService.uploadDocument(file, uploadDto, uploadedBy);
    return ApiResponseDto.success(document, 'Document uploaded successfully', HttpStatus.OK);
  }
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_VIEW_COMPANY_RESOURCE)
  @ApiOperation({
    summary: 'Get document by ID',
    description: 'Retrieve a specific document by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Document unique identifier',
    example: '68cc78ef4e52b0263fb18870',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            document: {
              type: 'object',
              description: 'Document details including metadata and file information',
            },
          },
        },
        message: { type: 'string', example: 'Document retrieved successfully' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID format',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid document ID format' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid JWT token required',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions to view document',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Insufficient permissions' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Document not found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  /**
   * Retrieves a document by ID.
   * @param id The ID of the document to be retrieved.
   * @returns A promise that resolves to an ApiResponseDto object containing the retrieved document and a success message.
   * @throws HttpException if the document was not found.
   */
  async getDocument(@Param('id') id: string): Promise<ApiResponseDto<{ document: Doc }>> {
    const document = await this.documentService.getDocumentById(id);
    return ApiResponseDto.success({ document }, 'Document retrieved successfully', HttpStatus.OK);
  }
  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_UPDATE_COMPANY_RESOURCE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Update document',
    description: 'Update document metadata and optionally replace the file',
  })
  @ApiParam({
    name: 'id',
    description: 'Document unique identifier to update',
    example: '68cc78ef4e52b0263fb18870',
    type: 'string',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Updated document data and optional new file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'New document file (optional)',
        },
        title: {
          type: 'string',
          example: 'Updated Employee Contract',
          description: 'Updated document title',
        },
        category: {
          type: 'string',
          enum: Object.values(fileCategory),
          example: fileCategory.NON_PUBLIC,
          description: 'Updated document category',
        },
        isPublic: {
          type: 'boolean',
          example: false,
          description: 'Updated public access setting',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            document: { type: 'object', description: 'Updated document details' },
          },
        },
        message: { type: 'string', example: 'Document Updated successfully' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid update data or document ID',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid update data provided' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid JWT token required',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions to update document',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Insufficient permissions' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Document not found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during update',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  /**
   * Updates a document with the given ID and file.
   * @param id The ID of the document to be updated.
   * @param file The file to be uploaded and associated with the document.
   * @param updateDto The document metadata to be updated.
   * @param req The requesting user.
   * @returns A promise that resolves to an ApiResponseDto object containing the updated document and a success message.
   * @throws HttpException if the document ID is invalid or the document is not found.
   * @throws HttpException if the file is invalid or if there is an error during file upload.
   */
  async updateDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: any,
    @GetUser() req: jwtInterface.UserPayload,
  ) {
    const updatedBy = new Types.ObjectId(req._id);
    const result = await this.documentService.updateDocument(id, file, updateDto, updatedBy);
    return ApiResponseDto.success(
      { document: result.document },
      'Document Updated successfully',
      HttpStatus.OK,
    );
  }
  @Get('gcs-to-base64/:fileUrl/:bucket')
  @ApiOperation({
    summary: 'Convert GCS file URL to base64',
    description:
      'Convert a Google Cloud Storage file to base64 encoded string for client-side usage',
  })
  @ApiParam({
    name: 'fileUrl',
    description: 'Google Cloud Storage file URL or filename',
    example: 'documents/employee-contract.pdf',
    type: 'string',
  })
  @ApiParam({
    name: 'bucket',
    description: 'GCS bucket name',
    enum: Object.values(Bucket),
    example: Bucket.APAC,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Base64 conversion successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            base64: {
              type: 'string',
              description: 'Base64 encoded file content',
              example:
                'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo...',
            },
          },
        },
        message: { type: 'string', example: 'Base64 conversion successful' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Missing or invalid file URL or bucket parameters',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Missing or invalid file or bucket parameters' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid JWT token required',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'File not found in specified bucket',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'File not found in bucket' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during conversion',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  async gcsToBase64(
    @Param('fileUrl') fileUrl: string,
    @Param('bucket') bucket: Bucket,
  ): Promise<ApiResponseDto<{ base64: string }>> {
    if (!fileUrl || !bucket) {
      return ApiResponseDto.badRequest('Missing or invalid file or bucket parameters');
    }
    const fileName = path.basename(fileUrl);
    const base64 = await this.documentService.getBase64FromGcs(fileName, bucket);
    return ApiResponseDto.success({ base64 }, 'Base64 conversion successful', HttpStatus.OK);
  }
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_UPDATE_COMPANY_RESOURCE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a document (Soft Delete)',
    description: 'Soft delete a document - marks as deleted but keeps file in storage for recovery',
  })
  @ApiParam({
    name: 'id',
    description: 'Document unique identifier to delete',
    example: '68cc78ef4e52b0263fb18870',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            result: { type: 'object', description: 'Deletion result details' },
          },
        },
        message: { type: 'string', example: 'Document deleted successfully' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID format',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid document ID format' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - valid JWT token required',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions to delete document',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Insufficient permissions' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Document not found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during deletion',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  async deleteDocument(
    @Param('id') id: string,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<any>> {
    const deletedBy = new Types.ObjectId(user._id);
    const result = await this.documentService.deleteDocument(id, deletedBy);
    return ApiResponseDto.success({ result }, result.message, HttpStatus.OK);
  }
  @Get('admin/deleted')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_VIEW_COMPANY_RESOURCE)
  @ApiOperation({
    summary: 'Get deleted documents (Admin)',
    description: 'Retrieve a list of soft-deleted documents (Admin only)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10, max: 100)',
  })
  async getDeletedDocuments(@Query() query: any): Promise<ApiResponseDto<any>> {
    const hasPaginationParams = query.page !== undefined || query.limit !== undefined;
    const paginationDto = hasPaginationParams
      ? {
          page: query.page ? parseInt(query.page) : 1,
          limit: query.limit ? parseInt(query.limit) : 10,
        }
      : undefined;
    const result = await this.documentService.getDeletedDocuments(paginationDto);
    return ApiResponseDto.success(
      result,
      'Deleted documents retrieved successfully',
      HttpStatus.OK,
    );
  }
  @Put('admin/restore/:id')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_UPDATE_COMPANY_RESOURCE)
  @ApiOperation({
    summary: 'Restore deleted document (Admin)',
    description: 'Restore a soft-deleted document (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Document unique identifier to restore',
    example: '68cc78ef4e52b0263fb18870',
    type: 'string',
  })
  async restoreDocument(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const result = await this.documentService.restoreDocument(id);
    return ApiResponseDto.success({ result }, result.message, HttpStatus.OK);
  }
  @Delete('admin/permanent/:id')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_UPDATE_COMPANY_RESOURCE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Permanently delete document (Admin)',
    description: 'Permanently delete a document and its file from GCS (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Document unique identifier to permanently delete',
    example: '68cc78ef4e52b0263fb18870',
    type: 'string',
  })
  async permanentlyDeleteDocument(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const result = await this.documentService.permanentlyDeleteDocument(id);
    return ApiResponseDto.success({ result }, result.message, HttpStatus.OK);
  }
}
