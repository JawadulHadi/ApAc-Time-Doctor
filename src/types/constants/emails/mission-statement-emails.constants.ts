const StatementAcknowledgement = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>{{companyName}} - Mission Statement Acknowledgement</title>
                            <!--[if mso]>
                            <style>
                                .header-bg { background-color: #c92A2A !important; }
                                .button-bg { background-color: #c92A2A !important; }
                                .footer-bg { background-color: #2a2d37 !important; }
                                .body-bg { background-color: #ffffff !important; }
                            </style>
                            <![endif]-->
                            <style>
                                @media only screen and (max-width:480px) {
                                .container { width: 100% !important; }
                                .button { display: block !important; width: 100% !important; text-align: center !important; }
                                }
                            </style>
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
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                        {{companyName}}
                                </h1>
                                        <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                            ✓ Mission Statement Received | In Review
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
                                                Hi {{recipientName}},
                                                </p>
                                                <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                                Your mission statement is now under review by <strong style="color:#c92A2A;">{{reviewerName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;       padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{reviewerRole}})</span>.
                                                </p>
                                                    <!-- Combined Cards Section -->
                                                <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                                    <!-- Submission Confirmation -->
                                                    <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                                        📋 Submission Confirmation
                                                    </p>
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Submitted By:</strong></td>
                                                        <td style="padding:5px 0;color:#2a2d37;">{{recipientName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Submitted:</strong></td>
                                                        <td style="padding:5px 0;color:#2a2d37;">{{submissionDate}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewer:</strong></td>
                                                        <td style="padding:5px 0;color:#2a2d37;">{{reviewerName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{reviewerRole}})</span></td>
                                                    </tr>
                                                </table>
                                                
                                                <!-- Your Mission Statement -->
                                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:20px 0 15px 0;display:flex;align-items:center;">
                                                    📜 Mission Statement
                                                </p>
                                                <div style="font-size:14px;line-height:1.8;color:#4a4f5c;padding:15px;background-color:white;border-radius:8px;border-left:3px solid #c92A2A;">
                                                    {{missionStatement}}
                                                </div>
                                                </div>
                                                <!-- View Submission Button -->
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                                <tr>
                                                    <td align="left">
                                                        <a href="{{statementUrl}}"
                                                            style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);background-color:#c92A2A;
                                                            color:#ffffff !important;
                                                            padding:14px 40px;
                                                            text-decoration:none;
                                                            border-radius:8px;
                                                            font-weight:600;
                                                            font-size:14px;
                                                            display:inline-block;
                                                            box-shadow:0 4px 16px rgba(201,42,42,0.3);
                                                            border:1px solid rgba(255,255,255,0.15);
                                                            transition:all 0.3s ease;
                                                            letter-spacing:0.5px;
                                                            text-align:left;">
                                                            View Statement
                                                        </a>
                                                    </td>
                                                </tr>
                                                </table>
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
const ReviewRequest = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>{{companyName}} - Mission Statement Review Required</title>
                            <!--[if mso]>
                            <style>
                                .header-bg { background-color: #c92A2A !important; }
                                .button-bg { background-color: #c92A2A !important; }
                                .footer-bg { background-color: #2a2d37 !important; }
                                .body-bg { background-color: #ffffff !important; }
                            </style>
                            <![endif]-->
                            <style>
                                @media only screen and (max-width:480px) {
                                    .container { width: 100% !important; }
                                    .button { display: block !important; width: 100% !important; text-align: center !important; }
                                }
                            </style>
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
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                        {{companyName}}
                                </h1>
                                                        <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                                            Action Required: Review Mission Statement
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
                                                                    🔍
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Content -->
                                                    <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                                                        Hi {{recipientName}},
                                                    </p>
                                                    <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                                    A mission statement from <strong style="color:#c92A2A;">{{applicantName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span>  is ready for your review.
                                                    </p>
                                                    <!-- Combined Cards Section -->
                                                    <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                                        <!-- Employee Details -->
                                                        <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                                            📋 Employee Details
                                                        </p>
                                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                            <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                                            <td style="padding:5px 0;color:#2a2d37;">{{applicantName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                                                <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Submitted:</strong></td>
                                                                <td style="padding:5px 0;color:#2a2d37;">{{submissionDate}}</td>
                                                            </tr>
                                                        </table>
                                                        
                                                        <!-- Mission Statement Content -->
                                                        <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:20px 0 15px 0;display:flex;align-items:center;">
                                                            📜 Mission Statement
                                                        </p>
                                                        <div style="font-size:14px;line-height:1.8;color:#4a4f5c;padding:15px;background-color:white;border-radius:8px;border-left:3px solid #c92A2A;">
                                                            {{missionStatement}}
                                                        </div>
                                                    </div>
                                                    <!-- Action Button -->
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                                        <tr>
                                                                <td align="left">
                                                                    <a href="{{statementUrl}}"
                                                                style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);background-color:#c92A2A;
                                                                color:#ffffff !important;
                                                                padding:18px 50px;
                                                                text-decoration:none;
                                                                border-radius:10px;
                                                                font-weight:700;
                                                                font-size:16px;
                                                                display:inline-block;
                                                                box-shadow:0 6px 20px rgba(23,162,184,0.4);
                                                                border:1px solid rgba(255,255,255,0.2);
                                                                transition:all 0.3s ease;
                                                                letter-spacing:0.5px;
                                                                text-align:left;">
                                                                View Statement
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
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
const SubmittedNotification = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>{{companyName}} - Mission Statement Received | In Review</title>
                            <!--[if mso]>
                            <style>
                                .header-bg { background-color: #c92A2A !important; }
                                .button-bg { background-color: #c92A2A !important; }
                                .footer-bg { background-color: #2a2d37 !important; }
                                .body-bg { background-color: #ffffff !important; }
                            </style>
                            <![endif]-->
                            <style>
                                @media only screen and (max-width:480px) {
                                    .container { width: 100% !important; }
                                    .button { display: block !important; width: 100% !important; text-align: center !important; }
                                }
                            </style>
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
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                        {{companyName}}
                                </h1>
                                                        <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                                            Mission Statement Received & In Review
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
                                                                    📊
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Content -->
                                                    <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                                                        Hi {{recipientName}},
                                                    </p>
                                                    <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                                    A mission statement from <strong style="color:#c92A2A;">{{applicantName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span> is received and In Review for <strong style="color:#c92A2A;">{{reviewerName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{reviewerRole}})</span>.
                                                    </p>

                                                    <!-- Combined Cards Section -->
                                                    <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                                        <!-- Employee Details -->
                                                        <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                                                    📋 Employee Details
                                                        </p>
                                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                            <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                                            <td style="padding:5px 0;color:#2a2d37;">{{applicantName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                                                <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Submitted:</strong></td>
                                                                <td style="padding:5px 0;color:#2a2d37;">{{submissionDate}}</td>
                                                            </tr>
                                                            <tr>
                                                                <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewer:</strong></td>
                                                                <td style="padding:5px 0;color:#2a2d37;">{{reviewerName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{reviewerRole}})</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Status:</strong></td>
                                                                <td style="padding:5px 0;color:#2a2d37;">
                                                                    <span style="background-color:#ffc107;color:#856404;padding:4px 12px;border-radius:10px;font-size:12px;font-weight:600;">
                                                                        Review In Progress
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </table>

                                                        <!-- Mission Statement Content -->
                                                        <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:20px 0 15px 0;display:flex;align-items:center;">
                                                            📜 Mission Statement
                                                        </p>
                                                        <div style="font-size:14px;line-height:1.8;color:#4a4f5c;padding:15px;background-color:white;border-radius:8px;border-left:3px solid #c92A2A;">
                                                            {{missionStatement}}
                                                        </div>
                                                    </div>

                                                    <!-- View Record Button -->
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                                        <tr>
                                                            <td align="left">
                                                                <a href="{{statementUrl}}"
                                                                    style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);background-color:#c92A2A;
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
                                                                    text-align:left;">
                                                                    View Statement
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
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
const StatusApproved = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Mission Statement Approved</title>
    <!--[if mso]>
    <style>
        .header-bg { background-color: #c92A2A !important; }
        .button-bg { background-color: #c92A2A !important; }
        .footer-bg { background-color: #2a2d37 !important; }
        .body-bg { background-color: #ffffff !important; }
    </style>
    <![endif]-->
    <style>
        @media only screen and (max-width:480px) {
            .container { width: 100% !important; }
            .button { display: block !important; width: 100% !important; text-align: center !important; }
        }
    </style>
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
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                        {{companyName}}
                                </h1>
                                <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                Mission Statement Approved</p>
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
                                Hi {{applicantName}},
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                Your mission statement has been reviewed and marked as <strong style="color:#c92A2A;">Approved</strong> by 
                                <strong style="color:#c92A2A;">{{approverName}}</strong>
                                <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span>.
                            </p>

                            <!-- Combined Cards Section -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <!-- Review Details -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📋 Review Details
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewed:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{reviewDate}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewer:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{approverName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Status:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">
                                            <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:4px 12px;border-radius:10px;font-size:12px;font-weight:600;">
                                                Approved
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Approved Mission Statement -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:20px 0 15px 0;display:flex;align-items:center;">
                                    📜 Mission Statement
                                </p>
                                <div style="font-size:14px;line-height:1.8;color:#4a4f5c;padding:15px;background-color:white;border-radius:8px;border-left:3px solid #c92A2A;">
                                    {{finalContent}}
                                </div>
                            </div>

                            <!-- View Statement Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{profileUrl}}"
                                            style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);background-color:#c92A2A;
                                            color:#ffffff !important;
                                            padding:14px 40px;
                                            text-decoration:none;
                                            border-radius:8px;
                                            font-weight:600;
                                            font-size:14px;
                                            display:inline-block;
                                            box-shadow:0 4px 16px rgba(201,42,42,0.3);
                                            border:1px solid rgba(255,255,255,0.15);
                                            transition:all 0.3s ease;
                                            letter-spacing:0.5px;
                                            text-align:left;">
                                            View Statement
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                            <p style="margin:0;color:#a0a7b5;">
                                Copyright {{currentYear}} {{companyName}}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
const StatusSuggestChanges = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Mission Statement Requires Changes</title>
    <!--[if mso]>
    <style>
        .header-bg { background-color: #c92A2A !important; }
        .button-bg { background-color: #c92A2A !important; }
        .footer-bg { background-color: #2a2d37 !important; }
        .body-bg { background-color: #ffffff !important; }
    </style>
    <![endif]-->
    <style>
        @media only screen and (max-width:480px) {
            .container { width: 100% !important; }
            .button { display: block !important; width: 100% !important; text-align: center !important; }
        }
    </style>
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
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                        {{companyName}}
                                </h1>
                                <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                    Mission Statement Requires Changes
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
                                            🔄
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Content -->
                            <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                                Hi {{applicantName}},
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                Your mission statement has been reviewed and marked as <strong style="color:#c92A2A;">Suggest Changes</strong> by 
                                <strong style="color:#c92A2A;">{{approverName}}</strong>
                                <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span>.
                            </p>

                            <!-- Combined Cards Section -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <!-- Review Details -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📋 Review Details
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewed:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{reviewDate}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewer:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{approverName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Status:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">
                                            <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:4px 12px;border-radius:10px;font-size:12px;font-weight:600;">
                                                Suggest Changes
                                            </span>
                                        </td>
                                    </tr>
                                    {{#if reviewerFeedback}}
                                    <tr>
                                        <td width="140" style="padding:5px 0;vertical-align:top;"><strong style="color:#5a6170;">Feedback:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{reviewerFeedback}}</td>
                                    </tr>
                                    {{/if}}
                                </table>
                                
                                <!-- Mission Statement Content -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:20px 0 15px 0;display:flex;align-items:center;">
                                    📜 Mission Statement
                                </p>
                                <div style="font-size:14px;line-height:1.8;color:#4a4f5c;padding:15px;background-color:white;border-radius:8px;border-left:3px solid #c92A2A;">
                                    {{finalContent}}
                                </div>
                            </div>
                            <!-- Action Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{profileUrl}}"
                                            style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);background-color:#c92A2A;
                                            color:#ffffff !important;
                                            padding:14px 40px;
                                            text-decoration:none;
                                            border-radius:8px;
                                            font-weight:600;
                                            font-size:14px;
                                            display:inline-block;
                                            box-shadow:0 4px 16px rgba(201,42,42,0.3);
                                            border:1px solid rgba(255,255,255,0.15);
                                            transition:all 0.3s ease;
                                            letter-spacing:0.5px;
                                            text-align:left;">
                                            View Statement
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                            <p style="margin:0;color:#a0a7b5;">
                                Copyright {{currentYear}} {{companyName}}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
const StatusApprovedLAndD = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Mission Statement Approved </title>
    <!--[if mso]>
    <style>
        .header-bg { background-color: #c92A2A !important; }
        .button-bg { background-color: #c92A2A !important; }
        .footer-bg { background-color: #2a2d37 !important; }
        .body-bg { background-color: #ffffff !important; }
    </style>
    <![endif]-->
    <style>
        @media only screen and (max-width:480px) {
            .container { width: 100% !important; }
            .button { display: block !important; width: 100% !important; text-align: center !important; }
        }
    </style>
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
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                        {{companyName}}
                                </h1>
                                <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                        Mission Statement Approved
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
                                Hi L & D - Operations,
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                The mission statement for 
                                <strong style="color:#c92A2A;">{{applicantName}}</strong>
                                <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span>
                                has been reviewed and marked as <strong style="color:#c92A2A;">Approved</strong> by 
                                <strong style="color:#c92A2A;">{{approverName}}</strong>
                                <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span>.
                            </p>

                            <!-- Combined Cards Section -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <!-- Review Details -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📋 Review Details
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewed:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{reviewDate}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewer:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{approverName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Status:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">
                                            <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:4px 12px;border-radius:10px;font-size:12px;font-weight:600;">
                                                Approved
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Approved Mission Statement -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:20px 0 15px 0;display:flex;align-items:center;">
                                    📜 Mission Statement
                                </p>
                                <div style="font-size:14px;line-height:1.8;color:#4a4f5c;padding:15px;background-color:white;border-radius:8px;border-left:3px solid #c92A2A;">
                                    {{finalContent}}
                                </div>
                            </div>

                            <!-- View Statement Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{profileUrl}}"
                                            style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);background-color:#c92A2A;
                                            color:#ffffff !important;
                                            padding:14px 40px;
                                            text-decoration:none;
                                            border-radius:8px;
                                            font-weight:600;
                                            font-size:14px;
                                            display:inline-block;
                                            box-shadow:0 4px 16px rgba(201,42,42,0.3);
                                            border:1px solid rgba(255,255,255,0.15);
                                            transition:all 0.3s ease;
                                            letter-spacing:0.5px;
                                            text-align:left;">
                                            View Statement
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                            <p style="margin:0;color:#a0a7b5;">
                                Copyright {{currentYear}} {{companyName}}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
const StatusSuggestChangesLAndD = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Mission Statement Requires Changes Record</title>
    <!--[if mso]>
    <style>
        .header-bg { background-color: #c92A2A !important; }
        .button-bg { background-color: #c92A2A !important; }
        .footer-bg { background-color: #2a2d37 !important; }
        .body-bg { background-color: #ffffff !important; }
    </style>
    <![endif]-->
    <style>
        @media only screen and (max-width:480px) {
            .container { width: 100% !important; }
            .button { display: block !important; width: 100% !important; text-align: center !important; }
        }
    </style>
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
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                        {{companyName}}
                                </h1>
                                <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                    Record: Mission Statement Requires Changes
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
                                Hi L & D - Operations,
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                The mission statement for 
                                <strong style="color:#c92A2A;">{{applicantName}}</strong>
                                <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span>
                                has been reviewed and marked as <strong style="color:#c92A2A;">Suggest Changes</strong> by 
                                <strong style="color:#c92A2A;">{{approverName}}</strong>
                                <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span>.
                            </p>

                            <!-- Combined Cards Section -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <!-- Review Details -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📋 Review Details
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{applicantRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Department:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{applicantDepartment}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewed:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{reviewDate}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Reviewer:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{approverName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{approverRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Status:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">
                                            <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:4px 12px;border-radius:10px;font-size:12px;font-weight:600;">
                                                Suggest Changes
                                            </span>
                                        </td>
                                    </tr>
                                    {{#if reviewerFeedback}}
                                    <tr>
                                        <td width="140" style="padding:5px 0;vertical-align:top;"><strong style="color:#5a6170;">Feedback:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{reviewerFeedback}}</td>
                                    </tr>
                                    {{/if}}
                                </table>
                                
                                <!-- Mission Statement Content -->
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:20px 0 15px 0;display:flex;align-items:center;">
                                    📜 Mission Statement
                                </p>
                                <div style="font-size:14px;line-height:1.8;color:#4a4f5c;padding:15px;background-color:white;border-radius:8px;border-left:3px solid #c92A2A;">
                                    {{finalContent}}
                                </div>
                            </div>

                            <!-- View Statement Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{statementUrl}}"
                                            style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);background-color:#c92A2A;
                                            color:#ffffff !important;
                                            padding:14px 40px;
                                            text-decoration:none;
                                            border-radius:8px;
                                            font-weight:600;
                                            font-size:14px;
                                            display:inline-block;
                                            box-shadow:0 4px 16px rgba(201,42,42,0.3);
                                            border:1px solid rgba(255,255,255,0.15);
                                            transition:all 0.3s ease;
                                            letter-spacing:0.5px;
                                            text-align:left;">
                                            View Statement
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                            <p style="margin:0;color:#a0a7b5;">
                                Copyright {{currentYear}} {{companyName}}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
export const htmlAcknowledgement = StatementAcknowledgement;
export const htmlReviewRequest = ReviewRequest;
export const htmlSubmitted = SubmittedNotification;
export const htmlStatusApproved = StatusApproved;
export const htmlStatusSuggestChanges = StatusSuggestChanges;
export const htmlStatusApprovedLAndD = StatusApprovedLAndD;
export const htmlStatusSuggestChangesLAndD = StatusSuggestChangesLAndD;
