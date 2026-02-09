// ============================================
// Success Indicators Email Templates
// ============================================
// Use Case 1: Adding New Indicators with Custom Status
const SuccessIndicatorAdded = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - New Success Indicators Added</title>
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
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #d43f3f 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                            <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="80" cy="40" r="2" fill="white"/><circle cx="60" cy="80" r="2" fill="white"/></svg></div>
                            <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                            <div style="position:relative;z-index:3;">
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;text-align:left;">
                                    {{companyName}}
                                </h1>
                                <p style="margin:8px 0 0 0;font-family:'Georgia', 'Times New Roman', serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;text-align:left;">
                                    ✓ New Success Indicators Added
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
                                New success indicators have been added for <strong style="color:#c92A2A;">{{employeeName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span> for <strong style="color:#c92A2A;">{{quarter}} {{year}}</strong>.
                            </p>
                            
                            <!-- Details Card -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📊 New Indicators Summary
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{employeeName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Quarter:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{quarter}} {{year}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Added By:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{addedByName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{addedByRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Date Added:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{dateAdded}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">New Indicators:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{newIndicatorsCount}}</td>
                                    </tr>
                                </table>
                            </div>
                            <!-- View Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{indicatorsUrl}}"
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
                                            View Indicators
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
                                Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
// Use Case 2: Moving Indicators Between Quarters
const SuccessIndicatorMoved = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Success Indicators Moved</title>
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
                                <p style="margin:8px 0 0 0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                    🔄 Success Indicators Moved
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
                                Hi {{recipientName}},
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                Success indicators have been moved for <strong style="color:#c92A2A;">{{employeeName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span>.
                            </p>
                            
                            <!-- Movement Details Card -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    🔄 Movement Details
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{employeeName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">From Quarter:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{fromQuarter}} {{year}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">To Quarter:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{toQuarter}} {{year}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Moved By:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{movedByName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{movedByRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Date Moved:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{dateMoved}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Indicators Moved:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{movedIndicatorsCount}}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- View Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{indicatorsUrl}}"
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
                                            View Indicators
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
                                Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
// Use Case 3: Deleting an Indicator
const SuccessIndicatorDeleted = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Success Indicators Deleted</title>
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
                                <p style="margin:8px 0 0 0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                    Success Indicators Deleted
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
                                            
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <!-- Content -->
                            <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                                Hi {{recipientName}},
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                Success indicators have been deleted for <strong style="color:#c92A2A;">{{employeeName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span> from <strong style="color:#c92A2A;">{{quarter}} {{year}}</strong>.
                            </p>
                            
                            <!-- Deletion Details Card -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    Deletion Details
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{employeeName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Quarter:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{quarter}} {{year}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Deleted By:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{deletedByName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{deletedByRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Date Deleted:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{dateDeleted}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Indicators Deleted:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{deletedIndicatorsCount}}</td>
                                    </tr>
                                </table>
                            </div>
                            <!-- View Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{indicatorsUrl}}"
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
                                            View Indicators
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
                                Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
// Use Case 4: Duplicating Unmet Indicators to Next Quarter
const SuccessIndicatorDuplicated = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Success Indicators Duplicated</title>
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
                                <p style="margin:8px 0 0 0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                    📋 Success Indicators Duplicated
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
                                Unmet success indicators have been duplicated for <strong style="color:#c92A2A;">{{employeeName}}</strong> <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span> from <strong style="color:#c92A2A;">{{fromQuarter}} {{year}}</strong> to <strong style="color:#c92A2A;">{{toQuarter}} {{year}}</strong>.
                            </p>
                            
                            <!-- Duplication Details Card -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📋 Duplication Details
                                </p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Employee:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{employeeName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{employeeRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">From Quarter:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{fromQuarter}} {{year}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">To Quarter:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{toQuarter}} {{year}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Duplicated By:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{duplicatedByName}} <span style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 100%);color:white;padding:1px 8px;border-radius:4px;font-size:0.95em;font-weight:700;">({{duplicatedByRole}})</span></td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Date Duplicated:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{dateDuplicated}}</td>
                                    </tr>
                                    <tr>
                                        <td width="140" style="padding:5px 0;"><strong style="color:#5a6170;">Indicators Duplicated:</strong></td>
                                        <td style="padding:5px 0;color:#2a2d37;">{{duplicatedIndicatorsCount}}</td>
                                    </tr>
                                </table>
                            </div>
                            <!-- View Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 10px 0;">
                                <tr>
                                    <td align="left">
                                        <a href="{{indicatorsUrl}}"
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
                                            View Indicators
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
                                Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
// Export templates
export const htmlSuccessIndicatorAdded = SuccessIndicatorAdded;
export const htmlSuccessIndicatorMoved = SuccessIndicatorMoved;
export const htmlSuccessIndicatorDeleted = SuccessIndicatorDeleted;
export const htmlSuccessIndicatorDuplicated = SuccessIndicatorDuplicated;
