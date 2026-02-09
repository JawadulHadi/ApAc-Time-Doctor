// import { Injectable, Logger } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class TimeDoctorService {
//   private readonly logger = new Logger(TimeDoctorService.name);
//   private readonly baseURL = 'https://webapi.timedoctor.com/v1.1';

//   async createEmployee(employeeData: any, companyId: string): Promise<any> {
//     try {
//       const response = await axios.post(
//         `${this.baseURL}/companies/${companyId}/users`,
//         {
//           email: employeeData.email,
//           first_name: employeeData.firstName,
//           last_name: employeeData.lastName,
//           role: 'employee',
//           send_invite: true,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.TIME_DOCTOR_ACCESS_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       return {
//         timeDoctorId: response.data.id,
//         inviteUrl: response.data.invite_url,
//         temporaryPassword: response.data.temporary_password,
//         createdAt: new Date().toISOString(),
//       };
//     } catch (error) {
//       this.logger.error(
//         'Time Doctor account creation failed:',
//         error.response?.data || error.message,
//       );
//       throw new Error('Failed to create Time Doctor account');
//     }
//   }

//   async assignProjects(userId: string, department: string, companyId: string): Promise<any> {
//     try {
//       const projects = this.getDepartmentProjects(department);

//       const response = await axios.post(
//         `${this.baseURL}/companies/${companyId}/tasks`,
//         {
//           user_id: userId,
//           tasks: projects.map(project => ({
//             name: project,
//             active: true,
//           })),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.TIME_DOCTOR_ACCESS_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       return response.data;
//     } catch (error) {
//       this.logger.error(
//         'Time Doctor project assignment failed:',
//         error.response?.data || error.message,
//       );
//       throw new Error('Failed to assign projects');
//     }
//   }

//   async setScreenshotRules(userId: string, companyId: string): Promise<any> {
//     try {
//       const response = await axios.post(
//         `${this.baseURL}/companies/${companyId}/screenshot_rules`,
//         {
//           user_id: userId,
//           frequency: 10,
//           blur: true,
//           apps_to_track: ['chrome', 'vscode', 'slack', 'teams', 'outlook'],
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.TIME_DOCTOR_ACCESS_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       return response.data;
//     } catch (error) {
//       this.logger.error(
//         'Time Doctor screenshot rules setup failed:',
//         error.response?.data || error.message,
//       );
//       throw new Error('Failed to set screenshot rules');
//     }
//   }

//   async getProductivityReport(
//     userId: string,
//     startDate: Date,
//     endDate: Date,
//     companyId: string,
//   ): Promise<any> {
//     try {
//       const response = await axios.get(`${this.baseURL}/companies/${companyId}/reports/worklogs`, {
//         params: {
//           user_id: userId,
//           start_date: startDate.toISOString().split('T')[0],
//           end_date: endDate.toISOString().split('T')[0],
//         },
//         headers: {
//           Authorization: `Bearer ${process.env.TIME_DOCTOR_ACCESS_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       return response.data;
//     } catch (error) {
//       this.logger.error(
//         'Time Doctor productivity report failed:',
//         error.response?.data || error.message,
//       );
//       throw new Error('Failed to get productivity report');
//     }
//   }

//   private getDepartmentProjects(department: string): string[] {
//     const projectMap = {
//       IT: ['Development', 'Code Review', 'Documentation', 'Meetings'],
//       HR: ['Recruitment', 'Onboarding', 'Training', 'Employee Relations'],
//       Sales: ['Lead Generation', 'Client Meetings', 'Proposals', 'Reporting'],
//       Operations: ['Project Management', 'Process Improvement', 'Reporting'],
//       Marketing: ['Campaigns', 'Content Creation', 'SEO', 'Analytics'],
//       Finance: ['Accounting', 'Reporting', 'Budgeting', 'Compliance'],
//     };

//     return projectMap[department] || ['General Tasks', 'Training', 'Meetings'];
//   }
// }
