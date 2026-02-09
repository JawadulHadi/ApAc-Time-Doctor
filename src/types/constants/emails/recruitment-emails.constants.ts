export const htmlClarificationSubmittedToRecruiter = `<!DOCTYPE html>
   <html lang="en">
      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>APAC Management System - Clarification Form Submitted</title>
         <!--[if mso]>
         <style>
            .header-bg { background-color: #c92A2A !important; }
            .button-bg { background-color: #c92A2A !important; }
            .footer-bg { background-color: #2a2d37 !important; }
            .body-bg { background-color: #ffffff !important; }
         </style>
         <![endif]-->
      </head>
      <body style="margin:0;padding:0;background:linear-gradient(135deg, #fef7f7 0%, #f0f2f5 100%);background-color:#f0f2f5;">
         <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
               <td align="center" style="padding:20px 30px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 15px 50px rgba(201,42,42,0.15);border:1px solid rgba(201,42,42,0.1);">
                     <!-- Header Section -->
                     <tr>
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                           <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="80" cy="40" r="2" fill="white"/><circle cx="60" cy="80" r="2" fill="white"/></svg></div>
                           <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                           <div style="position:relative;z-index:3;">
                              <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                 APAC MANAGEMENT SYSTEM
                              </h1>
                              <div style="height:3px;width:60px;background:linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);background-color:rgba(255,255,255,0.8);margin:12px 0 8px 0;border-radius:2px;"></div>
                              <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                 Clarification Form Submitted - {{jobTitle}}
                              </p>
                           </div>
                        </td>
                     </tr>
                     <!-- Body Section -->
                     <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                           <!-- Icon -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td style="padding-bottom:30px;">
                                    <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                       ✅
                                    </div>
                                 </td>
                              </tr>
                           </table>
                           <!-- Content -->
                           <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                              Hi {{recruiterName}},
                           </p>
                           <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                              Candidate <strong style="color:#c92A2A;">{{candidateName}}</strong> has submitted the clarification form for the position of <strong style="color:#c92A2A;">{{jobTitle}}</strong>.
                           </p>
                           <!-- Details Card -->
                           <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                              <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                 📋 Submission Details
                              </p>
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Candidate:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{candidateName}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Position:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{jobTitle}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Email:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{candidateEmail}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Submitted At:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{submittedAt}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Form Type:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">Clarification Form</td>
                                 </tr>
                              </table>
                           </div>
                           <!-- Action Button -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                              <tr>
                                 <td align="left">
                                    <p style="font-size:15px;line-height:1.6;margin:0 0 10px 0;color:#5a6170;">
                                       You can now review the submitted information in the APAC Management System.
                                    </p>
                                    <a href="{{dashboardUrl}}"
                                       style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;
                                       color:#ffffff !important;
                                       padding:16px 40px;
                                       text-decoration:none;
                                       border-radius:10px;
                                       font-weight:700;
                                       font-size:16px;
                                       display:inline-block;
                                       box-shadow:0 6px 20px rgba(201,42,42,0.4);
                                       border:1px solid rgba(255,255,255,0.2);
                                       transition:all 0.3s ease;
                                       letter-spacing:0.5px;
                                       text-align:center;">
                                    View in Dashboard
                                    </a>
                                 </td>
                              </tr>
                           </table>

                           <!-- Footer Text -->
                           <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:12px;border-left:4px solid #c92A2A;">
                              <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                                 This is an automated notification from the APAC Management System.<br>
                                 <strong style="color:#2a2d37;font-size:16px;">Please review the candidate's information at your earliest convenience.</strong>
                              </p>
                           </div>
                        </td>
                     </tr>
                    <!-- Footer Section -->
                        <tr><td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                            <p style="margin:0;color:#a0a7b5;">
                                Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                                
                            </p>
                        </td></tr>
                  </table>
               </td>
            </tr>
         </table>
      </body>
   </html>`;
export const htmlPersonalInfoSubmittedToRecruiter = `<!DOCTYPE html>
   <html lang="en">
      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>APAC Management System - Personal Info & Documents Submitted</title>
         <!--[if mso]>
         <style>
            .header-bg { background-color: #c92A2A !important; }
            .button-bg { background-color: #c92A2A !important; }
            .footer-bg { background-color: #2a2d37 !important; }
            .body-bg { background-color: #ffffff !important; }
         </style>
         <![endif]-->
      </head>
      <body style="margin:0;padding:0;background:linear-gradient(135deg, #fef7f7 0%, #f0f2f5 100%);background-color:#f0f2f5;">
         <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
               <td align="center" style="padding:20px 30px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 15px 50px rgba(201,42,42,0.15);border:1px solid rgba(201,42,42,0.1);">
                     <!-- Header Section -->
                     <tr>
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                           <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="80" cy="40" r="2" fill="white"/><circle cx="60" cy="80" r="2" fill="white"/></svg></div>
                           <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                           <div style="position:relative;z-index:3;">
                              <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                 APAC MANAGEMENT SYSTEM
                              </h1>
                              <div style="height:3px;width:60px;background:linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);background-color:rgba(255,255,255,0.8);margin:12px 0 8px 0;border-radius:2px;"></div>
                              <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                 Personal Info & Documents Submitted - {{jobTitle}}
                              </p>
                           </div>
                        </td>
                     </tr>
                     <!-- Body Section -->
                     <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                           <!-- Icon -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td style="padding-bottom:30px;">
                                    <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                       ✅
                                    </div>
                                 </td>
                              </tr>
                           </table>
                           <!-- Content -->
                           <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                              Hi {{recruiterName}},
                           </p>
                           <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                              Candidate <strong style="color:#c92A2A;">{{candidateName}}</strong> has successfully submitted the personal information and required documents for the position of <strong style="color:#c92A2A;">{{jobTitle}}</strong>.
                           </p>
                           <!-- Details Card -->
                           <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                              <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                 📋 Submission Summary
                              </p>
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Candidate:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{candidateName}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Position:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{jobTitle}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Email:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{candidateEmail}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Submitted At:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">{{submittedAt}}</td>
                                 </tr>
                                 <tr>
                                    <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Form Type:</strong></td>
                                    <td style="padding:5px 0;color:#2a2d37;">Personal Info & Documents</td>
                                 </tr>
                              </table>
                           </div>
                           <!-- Action Button -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                              <tr>
                                 <td align="left">
                                    <p style="font-size:15px;line-height:1.6;margin:0 0 10px 0;color:#5a6170;">
                                       All required information has been submitted. The candidate is now ready for the next stage.
                                    </p>
                                    <a href="{{dashboardUrl}}"
                                       style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;
                                       color:#ffffff !important;
                                       padding:16px 40px;
                                       text-decoration:none;
                                       border-radius:10px;
                                       font-weight:700;
                                       font-size:16px;
                                       display:inline-block;
                                       box-shadow:0 6px 20px rgba(201,42,42,0.4);
                                       border:1px solid rgba(255,255,255,0.2);
                                       transition:all 0.3s ease;
                                       letter-spacing:0.5px;
                                       text-align:center;">
                                    Review Submission
                                    </a>
                                 </td>
                              </tr>
                           </table>

                           <!-- Important Notice -->
                           <div style="margin:30px 0 0 0;padding:25px;background:linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);border-radius:12px;border-left:4px solid #ffc107;">
                              <p style="font-size:15px;font-weight:600;color:#856404;margin:0 0 10px 0;display:flex;align-items:center;">
                                 ⚡ Next Steps Required
                              </p>
                              <p style="font-size:14px;line-height:1.6;margin:0;color:#856404;">
                                 1. Verify all submitted documents are complete and valid<br>
                                 2. Check personal information for accuracy<br>
                                 3. Proceed with the next recruitment stage when ready
                              </p>
                           </div>
                           <!-- Footer Text -->
                           <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:12px;border-left:4px solid #c92A2A;">
                              <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                                 This is an automated notification from the APAC Management System.<br>
                                 <strong style="color:#2a2d37;font-size:16px;">The candidate has completed all submission requirements.</strong>
                              </p>
                           </div>
                        </td>
                     </tr>
                        <!-- Footer Section -->
                              <tr><td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                                 <p style="margin:0;color:#a0a7b5;">
                                    Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                                    
                                 </p>
                              </td></tr>
                  </table>
               </td>
            </tr>
         </table>
      </body>
   </html>`;
export const htmlPersonalInfoCompletedCandidate = `<!DOCTYPE html>
   <html lang="en">
      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>APAC Management System - Complete Your Personal Information</title>
         <!--[if mso]>
         <style>
            .header-bg { background-color: #c92A2A !important; }
            .button-bg { background-color: #c92A2A !important; }
            .footer-bg { background-color: #2a2d37 !important; }
            .body-bg { background-color: #ffffff !important; }
         </style>
         <![endif]-->
      </head>
      <body style="margin:0;padding:0;background:linear-gradient(135deg, #fef7f7 0%, #f0f2f5 100%);background-color:#f0f2f5;">
         <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
               <td align="center" style="padding:20px 30px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 15px 50px rgba(201,42,42,0.15);border:1px solid rgba(201,42,42,0.1);">
                     <!-- Header Section -->
                     <tr>
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                           <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="80" cy="40" r="2" fill="white"/><circle cx="60" cy="80" r="2" fill="white"/></svg></div>
                           <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                           <div style="position:relative;z-index:3;">
                              <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                 APAC MANAGEMENT SYSTEM
                              </h1>
                              <div style="height:3px;width:60px;background:linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);background-color:rgba(255,255,255,0.8);margin:12px 0 8px 0;border-radius:2px;"></div>
                              <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                 Action Required: Complete Your Information - {{jobTitle}}
                              </p>
                           </div>
                        </td>
                     </tr>
                     <!-- Body Section -->
                     <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                           <!-- Icon -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td style="padding-bottom:30px;">
                                    <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                       📋
                                    </div>
                                 </td>
                              </tr>
                           </table>
                           <!-- Content -->
                           <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                              Dear {{candidateName}},
                           </p>
                           <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                              We need you to <strong style="color:#c92A2A;">complete or update your personal information and documents</strong> for the position of <strong style="color:#c92A2A;">{{jobTitle}}</strong>.
                           </p>
                           <!-- Important Notice -->
                           <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);border-radius:12px;border-left:4px solid #ffc107;">
                              <p style="font-size:15px;font-weight:600;color:#856404;margin:0 0 10px 0;display:flex;align-items:center;">
                                 ⚠️ Review Requested
                              </p>
                              <p style="font-size:14px;line-height:1.6;margin:0;color:#856404;">
                                 Our recruitment team has reviewed your submission and requires additional information or updates to proceed with your application. Please review and complete all required fields.
                              </p>
                           </div>
                           <!-- What to Submit -->
                           <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                              <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                 📝 What You Need to Submit
                              </p>
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                 <tr>
                                    <td style="padding:8px 0;color:#2a2d37;font-size:14px;">
                                       ✓ Personal Information (gender, marital status, contact details, etc.)
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="padding:8px 0;color:#2a2d37;font-size:14px;">
                                       ✓ Emergency Contact Information
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="padding:8px 0;color:#2a2d37;font-size:14px;">
                                       ✓ Educational Background
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="padding:8px 0;color:#2a2d37;font-size:14px;">
                                       ✓ Employment History
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="padding:8px 0;color:#2a2d37;font-size:14px;">
                                       ✓ Required Documents (CNIC, Photograph, Resume)
                                    </td>
                                 </tr>
                              </table>
                           </div>
                           <!-- Action Button -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                              <tr>
                                 <td align="center">
                                    <p style="font-size:15px;line-height:1.6;margin:0 0 20px 0;color:#5a6170;">
                                       Click the button below to access the secure form and complete your submission:
                                    </p>
                                    <a href="{{dashboardUrl}}"
                                       style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;
                                       color:#ffffff !important;
                                       padding:18px 50px;
                                       text-decoration:none;
                                       border-radius:10px;
                                       font-weight:700;
                                       font-size:16px;
                                       display:inline-block;
                                       box-shadow:0 6px 20px rgba(201,42,42,0.4);
                                       border:1px solid rgba(255,255,255,0.2);
                                       transition:all 0.3s ease;
                                       letter-spacing:0.5px;
                                       text-align:center;">
                                    Complete Your Information
                                    </a>
                                 </td>
                              </tr>
                           </table>
                           <!-- Important Information -->
                           <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);background-color:#e3f2fd;border-radius:12px;border-left:4px solid #1976d2;">
                              <p style="font-size:15px;font-weight:600;color:#0d47a1;margin:0 0 10px 0;display:flex;align-items:center;">
                                 ℹ️ Important Information
                              </p>
                              <p style="font-size:14px;line-height:1.6;margin:0;color:#2a2d37;">
                                 • This link is valid for 45 days from the date of this email<br>
                                 • You can update your information multiple times before final submission<br>
                                 • All information will be kept confidential and secure<br>
                                 • If you have any questions, please contact our recruitment team
                              </p>
                           </div>
                           <!-- Footer Text -->
                           <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:12px;border-left:4px solid #c92A2A;">
                              <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                                 This is an automated notification from the APAC Management System.<br>
                                 <strong style="color:#2a2d37;font-size:16px;">Please complete your submission at your earliest convenience.</strong>
                              </p>
                           </div>
                        </td>
                     </tr>
                        <!-- Footer Section -->
                           <tr><td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                              <p style="margin:0;color:#a0a7b5;">
                                 Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                                 
                              </p>
                           </td></tr>
                  </table>
               </td>
            </tr>
         </table>
      </body>
   </html>`;
