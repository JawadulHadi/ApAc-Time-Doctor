import { HttpException, HttpStatus, PayloadTooLargeException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserPayload } from '../../types/interfaces/jwt.interface';
import { DocumentsController } from './document.controller';
import { DocumentService } from './document.service';
import { Bucket, fileCategory, fileType } from '@/types/enums/doc.enums';
/**
 * Mock GCS utilities to prevent side effects during imports
 */
jest.mock('@/shared/utils/gcs.utils', () => ({
  initializeGCS: jest.fn(),
  ensureGcsInitialized: jest.fn(),
  getGcsConfig: jest.fn(),
  uploadFileToGcs: jest.fn(),
  streamFileFromGcs: jest.fn(),
}));
describe('DocumentsController (unit)', () => {
  let controller: DocumentsController;
  let documentService: jest.Mocked<DocumentService>;
  const mockUser: UserPayload = {
    _id: new Types.ObjectId().toString(),
    email: 'test@mailinator.com',
    role: 'ADMIN',
  } as any;
  const mockDocument = {
    _id: new Types.ObjectId(),
    title: 'Test Document',
    originalName: 'test.pdf',
    fileName: 'doc_123456.pdf',
    fileUrl: 'https://storage.googleapis.com/bucket/doc_123456.pdf',
    mimeType: fileType.PDF,
    fileSize: 1024,
    category: fileCategory.PUBLIC,
    isPublic: true,
    uploadedBy: new Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from('fake pdf content'),
    size: 1024,
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const documentServiceMock = {
      uploadDocument: jest.fn(),
      getDocumentById: jest.fn(),
      updateDocument: jest.fn(),
      getAllDocuments: jest.fn(),
      getBase64FromGcs: jest.fn(),
      deleteDocument: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentService,
          useValue: documentServiceMock,
        },
      ],
    }).compile();
    controller = module.get<DocumentsController>(DocumentsController);
    documentService = module.get(DocumentService);
  });
  describe('uploadDocument', () => {
    const uploadDto = {
      title: 'Test Document',
      category: fileCategory.PUBLIC,
      isPublic: true,
    };
    it('should successfully upload a document and return 200', async () => {
      documentService.uploadDocument.mockResolvedValue(mockDocument as any);
      const result = await controller.uploadDocument(mockFile, uploadDto, mockUser);
      expect(documentService.uploadDocument).toHaveBeenCalledWith(
        mockFile,
        uploadDto,
        expect.any(Types.ObjectId),
      );
      expect(result).toBeDefined();
      expect(result.data).toEqual(mockDocument);
      expect(result.message).toBe('Document uploaded successfully');
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
    it('should throw PayloadTooLargeException when file size exceeds limit', async () => {
      const largeFile = { ...mockFile, size: 100 * 1024 * 1024 };
      documentService.uploadDocument.mockRejectedValue(
        new PayloadTooLargeException('File size too large. Maximum allowed file size is 10MB.'),
      );
      await expect(controller.uploadDocument(largeFile, uploadDto, mockUser)).rejects.toThrow(
        PayloadTooLargeException,
      );
    });
    it('should throw BadRequestException for invalid file type', async () => {
      const invalidFile = { ...mockFile, mimetype: 'application/exe' };
      documentService.uploadDocument.mockRejectedValue(
        new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
      );
      await expect(
        controller.uploadDocument(invalidFile as any, uploadDto, mockUser),
      ).rejects.toThrow(HttpException);
    });
    it('should handle service errors gracefully', async () => {
      documentService.uploadDocument.mockRejectedValue(
        new HttpException('Upload failed', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      await expect(controller.uploadDocument(mockFile, uploadDto, mockUser)).rejects.toThrow(
        HttpException,
      );
      expect(documentService.uploadDocument).toHaveBeenCalled();
    });
  });
  describe('getDocument', () => {
    const documentId = new Types.ObjectId().toString();
    it('should successfully retrieve a document by ID', async () => {
      documentService.getDocumentById.mockResolvedValue(mockDocument as any);
      const result = await controller.getDocument(documentId);
      expect(documentService.getDocumentById).toHaveBeenCalledWith(documentId);
      expect(result).toBeDefined();
      expect(result.data).toEqual({ document: mockDocument });
      expect(result.message).toBe('Document retrieved successfully');
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
    it('should throw HttpException when document not found', async () => {
      documentService.getDocumentById.mockRejectedValue(
        new HttpException('Document not found', HttpStatus.NOT_FOUND),
      );
      await expect(controller.getDocument(documentId)).rejects.toThrow(HttpException);
      expect(documentService.getDocumentById).toHaveBeenCalledWith(documentId);
    });
    it('should handle invalid ObjectId format', async () => {
      const invalidId = 'invalid-id-format';
      documentService.getDocumentById.mockRejectedValue(
        new HttpException('Invalid document ID', HttpStatus.BAD_REQUEST),
      );
      await expect(controller.getDocument(invalidId)).rejects.toThrow(HttpException);
    });
  });
  describe('updateDocument', () => {
    const documentId = new Types.ObjectId().toString();
    const updateDto = {
      title: 'Updated Document',
      category: fileCategory.NON_PUBLIC,
    };
    it('should successfully update document metadata without file', async () => {
      const updatedDoc = { ...mockDocument, title: 'Updated Document' };
      documentService.updateDocument.mockResolvedValue({
        document: updatedDoc as any,
        message: 'Document metadata updated successfully',
      });
      const result = await controller.updateDocument(documentId, null as any, updateDto, mockUser);
      expect(documentService.updateDocument).toHaveBeenCalledWith(
        documentId,
        null,
        updateDto,
        expect.any(Types.ObjectId),
      );
      expect(result).toBeDefined();
      expect(result.data.document).toEqual(updatedDoc);
      expect(result.message).toBe('Document Updated successfully');
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
    it('should successfully update document with new file', async () => {
      const updatedDoc = { ...mockDocument, fileName: 'doc_newfile.pdf' };
      documentService.updateDocument.mockResolvedValue({
        document: updatedDoc as any,
        message: 'Document file replaced successfully',
      });
      const result = await controller.updateDocument(documentId, mockFile, updateDto, mockUser);
      expect(documentService.updateDocument).toHaveBeenCalledWith(
        documentId,
        mockFile,
        updateDto,
        expect.any(Types.ObjectId),
      );
      expect(result).toBeDefined();
      expect(result.data.document).toEqual(updatedDoc);
    });
    it('should throw HttpException when document not found', async () => {
      documentService.updateDocument.mockRejectedValue(
        new HttpException('Document not found', HttpStatus.NOT_FOUND),
      );
      await expect(
        controller.updateDocument(documentId, null as any, updateDto, mockUser),
      ).rejects.toThrow(HttpException);
    });
    it('should handle file validation errors during update', async () => {
      const invalidFile = { ...mockFile, mimetype: 'application/exe' };
      documentService.updateDocument.mockRejectedValue(
        new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
      );
      await expect(
        controller.updateDocument(documentId, invalidFile as any, updateDto, mockUser),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('gcsToBase64', () => {
    const fileUrl = 'https://storage.googleapis.com/bucket/doc_123456.pdf';
    const bucket = Bucket.APAC;
    const base64String = 'data:application/pdf;base64,JVBERi0xLjQK...';
    it('should successfully convert GCS file to base64', async () => {
      documentService.getBase64FromGcs.mockResolvedValue(base64String);
      const result = await controller.gcsToBase64(fileUrl, bucket);
      expect(documentService.getBase64FromGcs).toHaveBeenCalledWith('doc_123456.pdf', bucket);
      expect(result).toBeDefined();
      expect(result.data.base64).toBe(base64String);
      expect(result.message).toBe('Base64 conversion successful');
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
    it('should return bad request when fileUrl is missing', async () => {
      const result = await controller.gcsToBase64('' as any, bucket);
      expect(result).toBeDefined();
      expect(result.message).toBe('Missing or invalid file or bucket parameters');
      expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
    it('should return bad request when bucket is missing', async () => {
      const result = await controller.gcsToBase64(fileUrl, null as any);
      expect(result).toBeDefined();
      expect(result.message).toBe('Missing or invalid file or bucket parameters');
      expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
    it('should handle conversion errors', async () => {
      documentService.getBase64FromGcs.mockRejectedValue(
        new HttpException('File not found in GCS', HttpStatus.NOT_FOUND),
      );
      await expect(controller.gcsToBase64(fileUrl, bucket)).rejects.toThrow(HttpException);
    });
  });
  describe('deleteDocument', () => {
    const documentId = new Types.ObjectId().toString();
    it('should successfully delete a document', async () => {
      const deleteResult = {
        success: true,
        message: 'Document and associated file deleted successfully',
      };
      documentService.deleteDocument.mockResolvedValue(deleteResult);
      const result = await controller.deleteDocument(documentId, mockUser);
      expect(documentService.deleteDocument).toHaveBeenCalledWith(
        documentId,
        expect.any(Types.ObjectId),
      );
      expect(result).toBeDefined();
      expect(result.data.result).toEqual(deleteResult);
      expect(result.message).toBe('Document deleted successfully');
      expect(result.statusCode).toBe(HttpStatus.OK);
    });
    it('should throw HttpException when document not found', async () => {
      documentService.deleteDocument.mockRejectedValue(
        new HttpException('Document not found', HttpStatus.NOT_FOUND),
      );
      await expect(controller.deleteDocument(documentId, mockUser)).rejects.toThrow(HttpException);
      expect(documentService.deleteDocument).toHaveBeenCalledWith(documentId);
    });
    it('should handle deletion failures gracefully', async () => {
      documentService.deleteDocument.mockRejectedValue(
        new HttpException('Failed to delete file from GCS', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      await expect(controller.deleteDocument(documentId, mockUser)).rejects.toThrow(HttpException);
    });
    it('should handle invalid document ID format', async () => {
      const invalidId = 'invalid-id';
      documentService.deleteDocument.mockRejectedValue(
        new HttpException('Invalid document ID', HttpStatus.BAD_REQUEST),
      );
      await expect(controller.deleteDocument(invalidId, mockUser)).rejects.toThrow(HttpException);
    });
  });
  describe('Edge Cases and Validation', () => {
    it('should handle concurrent upload requests', async () => {
      const uploadDto = { title: 'Test Doc', category: fileCategory.PUBLIC };
      documentService.uploadDocument.mockResolvedValue(mockDocument as any);
      const promises = [
        controller.uploadDocument(mockFile, uploadDto, mockUser),
        controller.uploadDocument({ ...mockFile, originalname: 'test2.pdf' }, uploadDto, mockUser),
      ];
      const results = await Promise.all(promises);
      expect(results).toHaveLength(2);
      expect(documentService.uploadDocument).toHaveBeenCalledTimes(2);
      results.forEach(result => {
        expect(result.statusCode).toBe(HttpStatus.OK);
      });
    });
    it('should preserve user context in uploadedBy field', async () => {
      const uploadDto = { title: 'Test', category: fileCategory.PUBLIC };
      documentService.uploadDocument.mockResolvedValue(mockDocument as any);
      await controller.uploadDocument(mockFile, uploadDto, mockUser);
      const capturedUserId = documentService.uploadDocument.mock.calls[0][2].toString();
      expect(capturedUserId).toBe(mockUser._id);
    });
    it('should handle empty title in upload DTO', async () => {
      const invalidDto = { title: '', category: fileCategory.PUBLIC };
      // Validation should be handled by class-validator before reaching controller
      // This test ensures the controller receives validated data
      documentService.uploadDocument.mockRejectedValue(
        new HttpException('Title is required', HttpStatus.BAD_REQUEST),
      );
      await expect(
        controller.uploadDocument(mockFile, invalidDto as any, mockUser),
      ).rejects.toThrow();
    });
    it('should handle multiple document categories correctly', async () => {
      const categories = [fileCategory.PUBLIC, fileCategory.NON_PUBLIC, fileCategory.OTHER];
      for (const category of categories) {
        const uploadDto = { title: `Test ${category}`, category };
        const docWithCategory = {
          ...mockDocument,
          category,
          isPublic: category === fileCategory.PUBLIC,
        };
        documentService.uploadDocument.mockResolvedValue(docWithCategory as any);
        const result = await controller.uploadDocument(mockFile, uploadDto, mockUser);
        expect(result.data.category).toBe(category);
        expect(result.data.isPublic).toBe(category === fileCategory.PUBLIC);
      }
    });
    it('should handle base64 conversion for different file types', async () => {
      const testCases = [
        { url: 'doc.pdf', base64: 'data:application/pdf;base64,abc123' },
        { url: 'image.png', base64: 'data:image/png;base64,xyz789' },
        {
          url: 'doc.docx',
          base64:
            'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,def456',
        },
      ];
      for (const testCase of testCases) {
        documentService.getBase64FromGcs.mockResolvedValue(testCase.base64);
        const result = await controller.gcsToBase64(testCase.url, Bucket.APAC);
        expect(result.data.base64).toBe(testCase.base64);
      }
    });
  });
});
