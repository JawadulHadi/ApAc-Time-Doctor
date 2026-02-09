export const htmlCreateUser = `<!DOCTYPE html>
   <html lang="en">
      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>APAC Management System - {{emailSubject}}</title>
         <!--[if mso]>
         <style>
            /* Outlook-specific fixes */
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
                  <!-- Outer container -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 15px 50px rgba(201,42,42,0.15);border:1px solid rgba(201,42,42,0.1);">
                     <!-- Enhanced Header with Depth -->
                     <tr>
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                           <!-- Subtle Pattern Overlay -->
                           <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="80" cy="40" r="2" fill="white"/><circle cx="60" cy="80" r="2" fill="white"/></svg> </div>
                           <!-- Shaded Light Effect -->
                           <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                           <div style="position:relative;z-index:3;">
                              <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                 APAC MANAGEMENT SYSTEM
                              </h1>
                              <div style="height:3px;width:60px;background:linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);background-color:rgba(255,255,255,0.8);margin:12px 0 8px 0;border-radius:2px;"></div>
                              <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                 {{emailSubject}}
                              </p>
                           </div>
                        </td>
                     </tr>
                     <!-- Enhanced Body Section -->
                     <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                           <!-- Enhanced Icon -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td style="padding-bottom:30px;">
                                    <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                       👤
                                    </div>
                                 </td>
                              </tr>
                           </table>

                           <!-- Welcome Message -->
                           <p style="font-size:18px;line-height:1.6;margin:0 0 18px 0;color:#2a2d37;font-weight:500;">
                              Welcome to the Team, {{applicantName}}!
                              <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{applicantRole}}</span>
                           </p>

                           <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                              Your account has been successfully created in the APAC Management System. To activate your account and access all features, please verify your email address.
                           </p>

                           <!-- Account Information Card -->
                           <div style="margin:25px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                              <p style="margin:0 0 10px 0;font-size:14px;color:#6a7180;font-weight:600;">
                                 Ready to Get Started?
                              </p>
                              <p style="margin:0;font-size:13px;color:#6a7180;line-height:1.5;">
                                 Verify your email to complete registration and unlock full system access including request management, team collaboration, and more.
                              </p>
                           </div>

                           <!-- Enhanced Button -->
                           <p style="margin:24px 0;">
                              <a href="{{url}}"
                                 class="button-bg"
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
                                 position:relative;
                                 overflow:hidden;">
                              <span style="position:relative;z-index:2;">Activate Your Account</span>
                              </a>
                           </p>

                           <!-- Security Note -->
                           <div style="margin:25px 0;padding:15px;background:linear-gradient(135deg, #fff3f3 0%, #ffe6e6 100%);background-color:#fff3f3;border-radius:8px;border:1px solid rgba(201,42,42,0.2);">
                              <p style="margin:0;font-size:12px;color:#c92A2A;text-align:center;font-weight:500;">
                                 🔒 Secure Verification Link • Valid until activated
                              </p>
                           </div>

                           <!-- Next Steps -->
                           <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:10px;">
                              <p style="margin:0 0 12px 0;font-size:14px;color:#5a6170;font-weight:600;">
                                 📝 What's Next After Verification?
                              </p>
                              <ul style="margin:0;padding-left:18px;color:#5a6170;">
                                 <li style="margin-bottom:6px;font-size:13px;line-height:1.4;">
                                    Upload your profile picture
                                 </li>
                                 <li style="margin-bottom:6px;font-size:13px;line-height:1.4;">
                                    Manage your requests and view leave balances
                                 </li>
                                 <li style="margin-bottom:0;font-size:13px;line-height:1.4;">
                                    Review company policies and resources
                                 </li>
                              </ul>
                           </div>
                           <!-- Support Information -->
                           <div style="margin:25px 0 0 0;padding:15px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:8px;">
                              <p style="margin:0;font-size:12px;color:#6a7180;text-align:center;">
                                 Need help? Contact our support team at
                                 <a href="mailto:support@apac-management.com" style="color:#c92A2A;text-decoration:none;font-weight:500;">support@apac-management.com</a>
                              </p>
                           </div>

                           <!-- Footer Text -->
                           <div style="margin:24px 0 0 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                              <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                                 We're excited to have you on board!<br>
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
export const htmlResendActivation = `<!DOCTYPE html>
   <html lang="en">
      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>APAC Management System - {{emailSubject}}</title>
         <!--[if mso]>
         <style>
            /* Outlook-specific fixes */
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
                  <!-- Outer container -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(201,42,42,0.08);border:1px solid rgba(201,42,42,0.08);">
                     <!-- Enhanced Header with Depth -->
                     <tr>
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                           <!-- Subtle Pattern Overlay -->
                           <div style="position:absolute;top:0;left:0;width:480%;height:100%;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="80" cy="40" r="2" fill="white"/><circle cx="60" cy="80" r="2" fill="white"/></svg> </div>
                           <!-- Shaded Light Effect -->
                           <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                           <div style="position:relative;z-index:3;">
                              <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:28px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                 APAC MANAGEMENT SYSTEM
                              </h1>
                              <div style="height:3px;width:480px;background:linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);background-color:rgba(255,255,255,0.8);margin:12px 0 8px 0;border-radius:10px;"></div>
                              <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:14px;font-weight:500;color:#f8f9fa;letter-spacing:1.2px;">
                                 {{emailSubject}}
                              </p>
                           </div>
                        </td>
                     </tr>
                     <!-- Enhanced Body Section -->
                     <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                           <!-- Enhanced Icon with Reminder Symbol -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td style="padding-bottom:30px;">
                                    <div style="width:70px;height:70px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:70px;font-size:28px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.08);box-shadow:0 6px 20px rgba(201,42,42,0.12);">
                                       🔔
                                    </div>
                                 </td>
                              </tr>
                           </table>

                           <!-- Urgent Attention Message -->
                           <div style="margin:0 0 25px 0;padding:15px;background:linear-gradient(135deg, #fff3f3 0%, #ffe6e6 100%);background-color:#fff3f3;border-radius:10px;border-left:4px solid #c92A2A;">
                              <p style="margin:0;font-size:16px;color:#c92A2A;font-weight:600;text-align:center;">
                                 ⚠️ ATTENTION REQUIRED: Account Activation Reminder
                              </p>
                           </div>

                           <!-- Welcome Back Message -->
                           <p style="font-size:18px;line-height:1.6;margin:0 0 18px 0;color:#2a2d37;font-weight:500;">
                              Hello {{applicantName}}!
                              <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{applicantRole}}</span>
                           </p>

                           <p style="font-size:16px;line-height:1.7;margin:0 0 25px 0;color:#4a4f5c;">
                              We noticed that your account hasn't been activated yet. This is a <strong>reminder email</strong> to complete your account activation and start using the APAC Management System.
                           </p>

                           <!-- Important Information Card -->
                           <div style="margin:25px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                              <p style="margin:0 0 10px 0;font-size:14px;color:#6a7180;font-weight:600;">
                                 Complete Your Registration
                              </p>
                              <p style="margin:0;font-size:13px;color:#6a7180;line-height:1.5;">
                                 Your account was created but remains inactive. Activate now to access all system features including request management, team collaboration, and more.
                              </p>
                           </div>

                           <!-- Enhanced Button -->
                           <p style="margin:24px 0;">
                              <a href="{{url}}"
                                 class="button-bg"
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
                                 position:relative;
                                 overflow:hidden;">
                              <span style="position:relative;z-index:2;">Activate Your Account Now</span>
                              </a>
                           </p>

                           <!-- Security Note -->
                           <div style="margin:25px 0;padding:15px;background:linear-gradient(135deg, #fff3f3 0%, #ffe6e6 100%);background-color:#fff3f3;border-radius:8px;border:1px solid rgba(201,42,42,0.2);">
                              <p style="margin:0;font-size:12px;color:#c92A2A;text-align:center;font-weight:500;">
                                 🔒 New Secure Verification Link • Valid until activated
                              </p>
                           </div>

                           <!-- Reminder Context -->
                           <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:10px;">
                              <p style="margin:0 0 12px 0;font-size:14px;color:#5a6170;font-weight:600;">
                                 💡 Why You're Receiving This Email
                              </p>
                              <ul style="margin:0;padding-left:18px;color:#5a6170;">
                                 <li style="margin-bottom:6px;font-size:13px;line-height:1.4;">
                                    This is a follow-up reminder for account activation
                                 </li>
                                 <li style="margin-bottom:6px;font-size:13px;line-height:1.4;">
                                    Previous activation links are no longer valid
                                 </li>
                                 <li style="margin-bottom:0;font-size:13px;line-height:1.4;">
                                    New activation code generated for your security
                                 </li>
                              </ul>
                           </div>
                           <!-- Support Information -->
                           <div style="margin:25px 0 0 0;padding:15px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:8px;">
                              <p style="margin:0;font-size:12px;color:#6a7180;text-align:center;">
                                 Need help with activation? Contact our support team at
                                 <a href="mailto:support@apac-management.com" style="color:#c92A2A;text-decoration:none;font-weight:500;">support@apac-management.com</a>
                              </p>
                           </div>

                           <!-- Footer Text -->
                           <div style="margin:24px 0 0 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                              <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                                 Don't miss out on accessing your account!<br>
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
export const htmlResetPassword = `<!DOCTYPE html>
   <html lang="en">
      <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>APAC Management System - {{emailSubject}}</title>
         <!--[if mso]>
         <style>
            /* Outlook-specific fixes */
            .header-bg { background-color: #c92A2A !important; }
            .button-bg { background-color: #c92A2A !important; }
            .footer-bg { background-color: #2a2d37 !important; }
            .body-bg { background-color: #ffffff !important; }
         </style>
         <![endif]-->
      </head>
      <body style="margin:0;padding:0;background:linear-gradient(135deg, #fef7f7 0%, #f0f2f5 100%);background-color:#f0f2f5;">
         <table role="presentation" cellpadding="0" cellpadding="0" border="0" width="100%">
            <tr>
               <td align="center" style="padding:20px 30px;">
                  <!-- Outer container -->
                  <table role="presentation" cellpadding="0" cellpadding="0" border="0" width="600" style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 2px 8px rgba(201,42,42,0.08);border:1px solid rgba(201,42,42,0.08);">
                     <!-- Enhanced Header with Depth -->
                     <tr>
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                           <!-- Subtle Pattern Overlay -->
                           <div style="position:absolute;top:0;left:0;width:480%;height:100%;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05">
                           <circle cx="20" cy="20" r="2" fill="white"/>
                           <circle cx="80" cy="40" r="2" fill="white"/>
                           <circle cx="60" cy="80" r="2" fill="white"/>
                           </svg> </div>
                           <!-- Shaded Light Effect -->
                           <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                           <div style="position:relative;z-index:3;">
                              <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:28px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                 APAC MANAGEMENT SYSTEM
                              </h1>
                              <div style="height:3px;width:480px;background:linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);background-color:rgba(255,255,255,0.8);margin:12px 0 8px 0;border-radius:10px;"></div>
                              <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:14px;font-weight:500;color:#f8f9fa;letter-spacing:1.2px;">
                                 {{emailSubject}}
                              </p>
                           </div>
                        </td>
                     </tr>
                     <!-- Enhanced Body Section -->
                     <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                           <!-- Enhanced Icon -->
                           <table role="presentation" width="100%" cellpadding="0" cellpadding="0">
                              <tr>
                                 <td style="padding-bottom:30px;">
                        <div style="width:70px;height:70px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:70px;font-size:28px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.08);box-shadow:0 6px 20px rgba(201,42,42,0.12);">
                                       📨
                                    </div>
                                 </td>
                              </tr>
                           </table>
                           <!-- Content with Enhanced Typography -->
                           <p style="font-size:18px;line-height:1.6;margin:0 0 18px 0;color:#2a2d37;font-weight:500;">
                              Hi {{applicantName}}
                              <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;">{{applicantRole}}</span>
                           </p>
                           <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                              We received a request to reset your password for your APAC Management System account. Click the button below to securely reset your password:
                           </p>
                           <!-- Enhanced Button -->
                           <p style="margin:24px 0;">
                              <a href="{{url}}"
                                 class="button-bg"
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
                                 position:relative;
                                 overflow:hidden;">
                              <span style="position:relative;z-index:2;">Reset Password</span>
                              </a>
                           </p>
                           <!-- Security Notice -->
                           <p style="font-size:15px;line-height:1.7;margin:0 0 20px 0;color:#5a6170;">
                              This link is for one-time use and will remain valid until you reset your password.
                           </p>
                           <p style="font-size:15px;line-height:1.7;margin:0 0 30px 0;color:#5a6170;">
                              If you did not request this password reset, please ignore this email or contact support if you have concerns.
                           </p>
                           <!-- Footer Text -->
                           <p style="font-size:15px;line-height:1.7;margin:0 0 20px 0;color:#5a6170;">
                              Thank you for using APAC Management System.
                           </p>
                           <div style="margin:25px 0 0 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
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
   </html>
   `;
