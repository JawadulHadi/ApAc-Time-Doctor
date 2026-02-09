// import { Types } from 'mongoose';
// import {
//   ReviewMissionStatementDto,
//   SubmitMissionStatementDto,
//   SubmitSuccessIndicatorsArrayDto,
//   SuccessIndicatorDto,
//   UpdateProfileDto,
// } from './profile.dto';
// import { IStatementStatus, IndicatorStatus } from '../../../types/enums/profile.enums';
// describe('Profile DTOs', () => {
//   describe('SubmitMissionStatementDto', () => {
//     it('should create a valid SubmitMissionStatementDto', () => {
//       const dto: SubmitMissionStatementDto = {
//         content:
//           'This is my mission statement for the quarter. I aim to deliver high-quality work and collaborate effectively with my team.',
//       };
//       expect(dto.content).toBe(
//         'This is my mission statement for the quarter. I aim to deliver high-quality work and collaborate effectively with my team.',
//       );
//       expect(dto.content.length).toBeGreaterThan(0);
//     });
//     it('should handle empty content', () => {
//       const dto: SubmitMissionStatementDto = {
//         content: '',
//       };
//       expect(dto.content).toBe('');
//     });
//     it('should handle long content', () => {
//       const longContent = 'A'.repeat(1000);
//       const dto: SubmitMissionStatementDto = {
//         content: longContent,
//       };
//       expect(dto.content).toBe(longContent);
//       expect(dto.content.length).toBe(1000);
//     });
//   });
//   describe('ReviewMissionStatementDto', () => {
//     it('should create a valid ReviewMissionStatementDto with approved status', () => {
//       const dto: ReviewMissionStatementDto = {
//         status: IStatementStatus.APPROVED,
//         changesRequired: 'Statement is approved. Great work!',
//       };
//       expect(dto.status).toBe(IStatementStatus.APPROVED);
//       expect(dto.changesRequired).toBe('Statement is approved. Great work!');
//     });
//     it('should create a valid ReviewMissionStatementDto with suggest changes status', () => {
//       const dto: ReviewMissionStatementDto = {
//         status: IStatementStatus.SUGGEST_CHANGES,
//         changesRequired: 'Please add more specific metrics and timelines to your statement.',
//       };
//       expect(dto.status).toBe(IStatementStatus.SUGGEST_CHANGES);
//       expect(dto.changesRequired).toBe(
//         'Please add more specific metrics and timelines to your statement.',
//       );
//     });
//     it('should create a valid ReviewMissionStatementDto with rejected status', () => {
//       const dto: ReviewMissionStatementDto = {
//         status: IStatementStatus.PENDING,
//         changesRequired: 'The statement does not meet the requirements. Please rewrite completely.',
//       };
//       expect(dto.status).toBe(IStatementStatus.PENDING);
//       expect(dto.changesRequired).toBe(
//         'The statement does not meet the requirements. Please rewrite completely.',
//       );
//     });
//     it('should handle empty changesRequired for approved status', () => {
//       const dto: ReviewMissionStatementDto = {
//         status: IStatementStatus.APPROVED,
//         changesRequired: '',
//       };
//       expect(dto.status).toBe(IStatementStatus.APPROVED);
//       expect(dto.changesRequired).toBe('');
//     });
//   });
//   describe('SuccessIndicatorDto', () => {
//     it('should create a valid SuccessIndicatorDto', () => {
//       const dto: SuccessIndicatorDto = {
//         id: 1,
//         key: 1,
//         content: 'Complete project documentation',
//         status: IndicatorStatus.IN_PROGRESS,
//         quarter: 1,
//         isMoved: false,
//         fromQuarter: 1,
//         toQuarter: null,
//       };
//       expect(dto.content).toBe('Complete project documentation');
//       expect(dto.status).toBe(IndicatorStatus.IN_PROGRESS);
//       expect(dto.quarter).toBe(1);
//       expect(dto.isMoved).toBe(false);
//       expect(dto.fromQuarter).toBe(1);
//       expect(dto.toQuarter).toBeNull();
//       expect(dto.from).toBe('1');
//       expect(dto.to).toBeNull();
//     });
//     it('should create a moved SuccessIndicatorDto', () => {
//       const dto: SuccessIndicatorDto = {
//         id: 1,
//         key: 1,
//         content: 'Review code changes',
//         status: IndicatorStatus.UNMET,
//         quarter: 1,
//         isMoved: true,
//         fromQuarter: 1,
//         toQuarter: 2,
//       };
//       expect(dto.content).toBe('Review code changes');
//       expect(dto.status).toBe(IndicatorStatus.UNMET);
//       expect(dto.quarter).toBe(1);
//       expect(dto.isMoved).toBe(true);
//       expect(dto.fromQuarter).toBe(1);
//       expect(dto.toQuarter).toBe(2);
//       expect(dto.from).toBe('1');
//       expect(dto.to).toBe('2');
//     });
//     it('should validate quarter ranges', () => {
//       const validQuarters = [1, 2, 3, 4];
//       validQuarters.forEach(quarter => {
//         const dto: SuccessIndicatorDto = {
//           content: `Test indicator ${quarter}`,
//           id: 1,
//           key: 1,
//           status: IndicatorStatus.UNMET,
//           quarter,
//           isMoved: false,
//           from: quarter.toString(),
//           to: null,
//         };
//         expect(dto.quarter).toBeGreaterThanOrEqual(1);
//         expect(dto.quarter).toBeLessThanOrEqual(4);
//         expect(dto.fromQuarter).toBeGreaterThanOrEqual(1);
//         expect(dto.from).toBeGreaterThanOrEqual(1);
//       });
//     });
//     it('should handle different status values', () => {
//       const validStatuses = [
//         IndicatorStatus.UNMET,
//         IndicatorStatus.IN_PROGRESS,
//         IndicatorStatus.MET,
//         IndicatorStatus.PARTIALLY_MET,
//         IndicatorStatus.UNMET,
//       ];
//       validStatuses.forEach(status => {
//         const dto: SuccessIndicatorDto = {
//           content: `Test indicator with ${status} status`,
//           id: 1,
//           key: 1,
//           status,
//           quarter: 1,
//           isMoved: false,
//           from: '1',
//           to: null,
//         };
//         expect(dto.status).toBe(status);
//       });
//     });
//   });
//   describe('SubmitSuccessIndicatorsArrayDto', () => {
//     it('should create a valid SubmitSuccessIndicatorsArrayDto with multiple indicators', () => {
//       const dto: SubmitSuccessIndicatorsArrayDto = {
//         successIndicators: [
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 1,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Complete project documentation',
//                 status: IndicatorStatus.IN_PROGRESS,
//                 quarter: 1,
//                 isMoved: false,
//                 from: '1',
//                 to: null,
//               },
//             ],
//           },
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 1,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Review code changes',
//                 status: IndicatorStatus.MET,
//                 quarter: 1,
//                 isMoved: false,
//                 from: '1',
//                 to: null,
//               },
//             ],
//           },
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 1,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Update test cases',
//                 status: IndicatorStatus.UNMET,
//                 quarter: 2,
//                 isMoved: false,
//                 from: '2',
//                 to: null,
//               },
//             ],
//           },
//         ],
//       };
//       expect(dto.successIndicators).toHaveLength(3);
//       expect(dto.successIndicators[0].indicators[0].content).toBe('Complete project documentation');
//       expect(dto.successIndicators[1].status).toBe(IndicatorStatus.MET);
//       expect(dto.successIndicators[2].quarter).toBe(2);
//     });
//     it('should create a valid SubmitSuccessIndicatorsArrayDto with single indicator', () => {
//       const dto: SubmitSuccessIndicatorsArrayDto = {
//         successIndicators: [
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 1,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Single indicator',
//                 status: IndicatorStatus.IN_PROGRESS,
//                 quarter: 1,
//                 isMoved: false,
//                 from: '1',
//                 to: null,
//               },
//             ],
//           },
//         ],
//       };
//       expect(dto.successIndicators).toHaveLength(1);
//       expect(dto.successIndicators[0].indicators[0].content).toBe('Single indicator');
//     });
//     it('should handle empty successIndicators array', () => {
//       const dto: SubmitSuccessIndicatorsArrayDto = {
//         successIndicators: [],
//       };
//       expect(dto.successIndicators).toHaveLength(0);
//       expect(Array.isArray(dto.successIndicators)).toBe(true);
//     });
//     it('should handle indicators for all quarters', () => {
//       const dto: SubmitSuccessIndicatorsArrayDto = {
//         successIndicators: [
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 1,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Q1 Task',
//                 status: IndicatorStatus.MET,
//                 quarter: 1,
//                 isMoved: false,
//                 from: '1',
//                 to: null,
//               },
//             ],
//           },
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 2,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Q2 Task',
//                 status: IndicatorStatus.IN_PROGRESS,
//                 quarter: 2,
//                 isMoved: false,
//                 from: '2',
//                 to: null,
//               },
//             ],
//           },
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 3,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Q3 Task',
//                 status: IndicatorStatus.UNMET,
//                 quarter: 3,
//                 isMoved: false,
//                 from: '3',
//                 to: null,
//               },
//             ],
//           },
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 4,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Q4 Task',
//                 status: IndicatorStatus.UNMET,
//                 quarter: 4,
//                 isMoved: false,
//                 from: '4',
//                 to: null,
//               },
//             ],
//           },
//         ],
//       };
//       expect(dto.successIndicators).toHaveLength(4);
//       const quarters = dto.successIndicators.map(ind => ind.quarter);
//       expect(quarters).toContain(1);
//       expect(quarters).toContain(2);
//       expect(quarters).toContain(3);
//       expect(quarters).toContain(4);
//     });
//     it('should handle moved indicators across quarters', () => {
//       const dto: SubmitSuccessIndicatorsArrayDto = {
//         successIndicators: [
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 1,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Moved from Q1 to Q2',
//                 status: IndicatorStatus.IN_PROGRESS,
//                 quarter: 1,
//                 isMoved: true,
//                 from: '1',
//                 to: '2',
//               },
//             ],
//           },
//           {
//             isActive: true,
//             year: 2026,
//             quarter: 2,
//             indicators: [
//               {
//                 id: 1,
//                 key: 1,
//                 content: 'Target in Q2',
//                 status: IndicatorStatus.UNMET,
//                 quarter: 2,
//                 isMoved: false,
//                 from: '2',
//                 to: null,
//               },
//             ],
//           },
//         ],
//       };
//       expect(dto.successIndicators).toHaveLength(2);
//       expect(dto.successIndicators[0].indicators[0].isMoved).toBe(true);
//       expect(dto.successIndicators[0].indicators[0].to).toBe('2');
//       expect(dto.successIndicators[1].indicators[0].isMoved).toBe(false);
//       expect(dto.successIndicators[1].indicators[0].to).toBeNull();
//     });
//   });
//   describe('UpdateProfileDto', () => {
//     it('should create a valid UpdateProfileDto with all fields', () => {
//       const dto: UpdateProfileDto = {
//         fullName: 'John Updated Doe',
//         email: 'john.updated@example.com',
//         designation: 'Senior Software Engineer',
//         contactNumber: '+12345678901',
//         currentAddress: '123 Main St, City, State',
//       };
//       expect(dto.fullName).toBe('John Updated Doe');
//       expect(dto.email).toBe('john.updated@example.com');
//       expect(dto.designation).toBe('Senior Software Engineer');
//       expect(dto.contactNumber).toBe('+12345678901');
//       expect(dto.currentAddress).toBe('123 Main St, City, State');
//     });
//     it('should create a valid UpdateProfileDto with partial fields', () => {
//       const dto: UpdateProfileDto = {
//         fullName: 'Jane Doe',
//         designation: 'Product Manager',
//       };
//       expect(dto.fullName).toBe('Jane Doe');
//       expect(dto.designation).toBe('Product Manager');
//       expect(dto.email).toBeUndefined();
//     });
//     it('should handle empty strings', () => {
//       const dto: UpdateProfileDto = {
//         fullName: '',
//         email: '',
//         designation: '',
//         contactNumber: '',
//         currentAddress: '',
//       };
//       expect(dto.fullName).toBe('');
//       expect(dto.email).toBe('');
//       expect(dto.designation).toBe('');
//       expect(dto.contactNumber).toBe('');
//       expect(dto.currentAddress).toBe('');
//     });
//     it('should handle long text fields', () => {
//       const longBio = 'A'.repeat(500);
//       const longAddress = 'B'.repeat(200);
//       const dto: UpdateProfileDto = {
//         currentAddress: longAddress,
//       };
//       expect(dto.currentAddress).toBe(longAddress);
//       expect(dto.currentAddress.length).toBe(200);
//     });
//     it('should validate email format', () => {
//       const validEmails = [
//         'test@example.com',
//         'user.name@domain.co.uk',
//         'user+tag@example.org',
//         'user123@test-domain.com',
//       ];
//       validEmails.forEach(email => {
//         const dto: UpdateProfileDto = {
//           email,
//         };
//         expect(dto.email).toBe(email);
//       });
//     });
//     it('should handle phone number formats', () => {
//       const phoneNumbers = [
//         { contactNumber: '+12345678901' },
//         '(123) 456-7890',
//         '123-456-7890',
//         '1234567890',
//       ];
//       phoneNumbers.forEach(phone => {
//         if (typeof phone === 'object') {
//           const dto: UpdateProfileDto = {
//             contactNumber: phone.contactNumber,
//           };
//           expect(dto.contactNumber).toBe('+12345678901');
//         } else {
//           const dto: UpdateProfileDto = {
//             contactNumber: phone,
//           };
//           expect(dto.contactNumber).toBe('+12345678901');
//         }
//       });
//     });
//   });
//   describe('DTO Validation Edge Cases', () => {
//     it('should handle special characters in text fields', () => {
//       const dto: UpdateProfileDto = {
//         fullName: "John Ö'Connor-Smith",
//         currentAddress: '123 Main St, Apt #4B, New York, NY 10001',
//       };
//       expect(dto.fullName).toBe("John Ö'Connor-Smith");
//       expect(dto.currentAddress).toBe('123 Main St, Apt #4B, New York, NY 10001');
//     });
//     it('should handle Unicode characters', () => {
//       const dto: UpdateProfileDto = {
//         fullName: '张三',
//         currentAddress: 'This is a test with Unicode: 🚀 🎉 📚',
//       };
//       expect(dto.fullName).toBe('张三');
//       expect(dto.currentAddress).toBe('This is a test with Unicode: 🚀 🎉 📚');
//     });
//     it('should handle very long indicator names', () => {
//       const longIndicator = 'A'.repeat(200);
//       const dto: SubmitSuccessIndicatorsArrayDto = {
//         successIndicators: [
//           {
//             Indicator: longIndicator,
//             status: IndicatorStatus.UNMET,
//             quarter: 1,
//             isMoved: false,
//             fromQuarter: 1,
//             toQuarter: null,
//           },
//         ],
//       };
//       expect(dto.successIndicators[0].Indicator).toBe(longIndicator);
//       expect(dto.successIndicators[0].Indicator.length).toBe(200);
//     });
//   });
// });
