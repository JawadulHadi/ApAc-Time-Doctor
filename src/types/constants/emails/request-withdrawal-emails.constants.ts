export const htmlRequesterWithdrawn = `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>APAC Management System - Request Withdrawn - {{applicantFullName}} - {{requestType}} Request</title>
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
                              Request Withdrawn - {{applicantFullName}} - {{requestType}} Request
                           </p>
                        </div>
                     </td>
                  </tr>
                  <!-- Body Section -->
                  <tr>
                     <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                        <!-- Withdrawal Icon -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                           <tr>
                              <td style="padding-bottom:30px;">
                                 <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                    <span style="position:relative; top:-2px;">⚠️</span>
                                 </div>
                              </td>
                           </tr>
                        </table>
                        <!-- Content with Enhanced Typography -->
                        <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                           Hi {{applicantFullName}},
                        </p>
                        <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                           Your <strong style="color:#c92A2A;">{{requestType}}</strong> request has been <strong style="color:#c92A2A;">Withdrawn</strong>.
                        </p>
                        <!-- Request Details Card -->
                        <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                           <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                              📋 Request Details
                           </p>
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{applicantFullName}} <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{applicantRole}}</span></td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Team Lead:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{tLName}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Request Type:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{requestType}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Requested Dates:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{requestedDates}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Day(s):</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{totalDays}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Withdrawn By:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;"><span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{withdrawnBy}}</span></td>
                              </tr>
                           </table>
                        </div>
                        <!-- Enhanced Button - LEFT ALIGNED -->
                        <div style="margin:35px 0;">
                           <a href="{{actionURL}}"
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
                           View Request
                           </a>
                        </div>
                        <!-- Footer Text -->
                        <p style="margin-top:16px;color:#6c757d;font-size:14px;font-weight:300">
                           Thank you very much for your time.
                        </p>
                        <!-- Footer Text -->
                        <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:12px;border-left:4px solid #c92A2A;">
                           <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                              Best regards,<br>
                              <strong style="color:#2a2d37;font-size:16px;">APAC Management Team</strong>
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
export const htmlTLWithdrawn = `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>APAC Management System - Request Withdrawn - {{applicantFullName}} - {{requestType}} Request</title>
      <!--[if mso]>
      <style>
         .header-bg { background-color: #c92A2A !important; }
         .button-bg { background-color: #c92A2A !important; }
         .footer-bg { background-color: #2a2d37 !important; }
         .body-bg { background-color: #ffffff !important; }
      </style>
      <![endif]-->
   </head>
   <body style="margin:0;padding:0;background:linear-gradient(135deg, #f7f9fc 0%, #f0f2f5 100%);background-color:#f0f2f5;">
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
                              Request Withdrawn - {{applicantFullName}} - {{requestType}} Request
                           </p>
                        </div>
                     </td>
                  </tr>
                  <!-- Body Section -->
                  <tr>
                     <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                        <!-- Withdrawal Icon -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                           <tr>
                              <td style="padding-bottom:30px;">
                                 <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                    <span style="position:relative; top:-2px;">⚠️</span>
                                 </div>
                              </td>
                           </tr>
                        </table>
                        <!-- Content with Enhanced Typography -->
                        <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                           Hi {{recipientName}},
                        </p>
                        <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                           This is to inform you that the <strong style="color:#c92A2A;">{{requestType}}</strong> request from {{applicantFullName}} has been <strong style="color:#c92A2A;">Withdrawn</strong>. 
                        </p>
                        <!-- Request Details Card -->
                        <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                           <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                              📋 Request Details
                           </p>
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{applicantFullName}} <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{applicantRole}}</span></td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Team Lead:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{tLName}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Request Type:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{requestType}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Requested Dates:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{requestedDates}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Day(s):</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{totalDays}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Withdrawn By:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;"><span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{withdrawnBy}}</span></td>
                              </tr>
                           </table>
                        </div>
                        <!-- Enhanced Button - LEFT ALIGNED -->
                        <div style="margin:35px 0;">
                           <a href="{{actionURL}}"
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
                           View Request
                           </a>
                        </div>
                        <!-- Footer Text -->
                        <p style="margin-top:16px;color:#6c757d;font-size:14px;font-weight:300">
                           Thank you very much for your time.
                        </p>
                        <!-- Footer Text -->
                        <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #f7f9fc 0%, #fafafa 100%);background-color:#f7f9fc;border-radius:12px;border-left:4px solid #c92A2A;">
                           <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                              Best regards,<br>
                              <strong style="color:#2a2d37;font-size:16px;">APAC Management Team</strong>
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
export const htmlAdminWithdrawn = `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>APAC Management System - Request Withdrawn - {{applicantFullName}} - {{requestType}} Request</title>
      <!--[if mso]>
      <style>
         .header-bg { background-color: #c92A2A !important; }
         .button-bg { background-color: #c92A2A !important; }
         .footer-bg { background-color: #2a2d37 !important; }
         .body-bg { background-color: #ffffff !important; }
      </style>
      <![endif]-->
   </head>
   <body style="margin:0;padding:0;background:linear-gradient(135deg, #f7f9fc 0%, #f0f2f5 100%);background-color:#f0f2f5;">
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
                              Request Withdrawn - {{applicantFullName}} - {{requestType}} Request
                           </p>
                        </div>
                     </td>
                  </tr>
                  <!-- Body Section -->
                  <tr>
                     <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                        <!-- Withdrawal Icon -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                           <tr>
                              <td style="padding-bottom:30px;">
                                 <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                    <span style="position:relative; top:-2px;">⚠️</span>
                                 </div>
                              </td>
                           </tr>
                        </table>
                        <!-- Content with Enhanced Typography -->
                        <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                           Hi {{recipientName}},
                        </p>
                        <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                           This is to inform you that the <strong style="color:#c92A2A;">{{requestType}}</strong> request by {{applicantFullName}} has been formally <strong style="color:#c92A2A;">Withdrawn</strong>.
                        </p>
                        <!-- Request Details Card -->
                        <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                           <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                              📋 Request Details
                           </p>
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{applicantFullName}} <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{applicantRole}}</span></td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Team Lead:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{tLName}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Request Type:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{requestType}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Requested Dates:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{requestedDates}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Day(s):</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;">{{totalDays}}</td>
                              </tr>
                              <tr>
                                 <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Withdrawn By:</strong></td>
                                 <td style="padding:5px 0;color:#2a2d37;"><span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{withdrawnBy}}</span></td>
                              </tr>
                           </table>
                        </div>
                        <!-- Enhanced Button - LEFT ALIGNED -->
                        <div style="margin:35px 0;">
                           <a href="{{actionURL}}"
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
                           View Request
                           </a>
                        </div>
                        <!-- Footer Text -->
                        <p style="margin-top:16px;color:#6c757d;font-size:14px;font-weight:300">
                           Thank you very much for your time.
                        </p>
                        <!-- Footer Text -->
                        <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #f7f9fc 0%, #fafafa 100%);background-color:#f7f9fc;border-radius:12px;border-left:4px solid #c92A2A;">
                           <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                              Best regards,<br>
                              <strong style="color:#2a2d37;font-size:16px;">APAC Management Team</strong>
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
