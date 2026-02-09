export const htmlLeaveBankNotification_Member = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>APAC Management System - Leave Balance Update</title>
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
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:30px 35px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                            <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot; opacity=&quot;0.05&quot;><circle cx=&quot;20&quot; cy=&quot;20&quot; r=&quot;2&quot; fill=&quot;white&quot;/><circle cx=&quot;80&quot; cy=&quot;40&quot; r=&quot;2&quot; fill=&quot;white&quot;/><circle cx=&quot;60&quot; cy=&quot;80&quot; r=&quot;2&quot; fill=&quot;white&quot;/></svg>');"></div>
                            <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                            <div style="position:relative;z-index:3;">
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:28px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                    APAC MANAGEMENT SYSTEM
                                </h1>
                                <p style="margin:5px 0 0 0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:18px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                    Leave Balance Update
                                </p>
                            </div>
                        </td>
                    </tr>
                    <!-- Body Section -->
                    <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                            <!-- Success Icon -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom:30px;">
                                        <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:left;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                            📊
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <!-- Content with Enhanced Typography -->
                            <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                                Hi <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:0.6px">{{employeeName}}</span>,
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                We're pleased to inform you that your leave bank records have been successfully updated. You can now view your latest leave balances and history.
                            </p>

                            <!-- Important Notice & Action -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <p style="font-size:16px;font-weight:600;color:#c92A2A;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📢 Important Notice
                                </p>
                                <p style="font-size:15px;line-height:1.6;margin:0 0 20px 0;color:#4a4f5c;">
                                    Please review your updated leave bank. For any questions or discrepancies, kindly reach out to your <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:4px;font-weight:600;white-space:nowrap;">Team Lead/Reporting Line</span> for assistance.
                                </p>
                                <!-- Enhanced Button -->
                                <div style="margin:20px 0 0 0;">
                                    <a href="{{dashboardUrl}}" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;color:#ffffff !important;padding:16px 40px;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;display:inline-block;box-shadow:0 6px 20px rgba(201,42,42,0.08);border:1px solid rgba(255,255,255,0.2);transition:all 0.3s ease;letter-spacing:0.5px;text-align:left;">
                                        View Leave Bank
                                    </a>
                                </div>
                            </div>

                           <!-- Footer Text -->
                        <div style="margin:35px 0 0 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                           <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                              Thank you for using APAC Management System.<br/>
                              <strong style="color:#000000ff;font-size:16px;">We're committed to keeping your records accurate and up-to-date.</strong>
                           </p>
                        </div>
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
export const htmlLeaveBankNotification_TeamLead = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>APAC Management System - Leave Balance Update</title>
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
                        <td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:30px 35px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                            <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot; opacity=&quot;0.05&quot;><circle cx=&quot;20&quot; cy=&quot;20&quot; r=&quot;2&quot; fill=&quot;white&quot;/><circle cx=&quot;80&quot; cy=&quot;40&quot; r=&quot;2&quot; fill=&quot;white&quot;/><circle cx=&quot;60&quot; cy=&quot;80&quot; r=&quot;2&quot; fill=&quot;white&quot;/></svg>');"></div>
                            <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                            <div style="position:relative;z-index:3;">
                                <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:28px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                    APAC MANAGEMENT SYSTEM
                                </h1>
                                <p style="margin:5px 0 0 0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:18px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                    Leave Balance Update
                                </p>
                            </div>
                        </td>
                    </tr>
                    <!-- Body Section -->
                    <tr>
                        <td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">
                            <!-- Success Icon -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom:30px;">
                                        <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:left;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                            📊
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <!-- Content with Enhanced Typography -->
                            <p style="font-size:16px;line-height:1.6;margin:0 0 16px 0;color:#2a2d37;">
                                Hi <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:0.6px">{{employeeName}}</span>,
                            </p>
                            <p style="font-size:16px;line-height:1.7;margin:0 0 30px 0;color:#4a4f5c;">
                                This notification confirms that your team member's leave bank records have been updated. Please review the changes to ensure accuracy.
                            </p>

                            <!-- Important Notice & Action -->
                            <div style="margin:24px 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                                <p style="font-size:16px;font-weight:600;color:#c92A2A;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📢 Important Notice
                                </p>
                                <p style="font-size:15px;line-height:1.6;margin:0 0 20px 0;color:#4a4f5c;">
                                    Kindly verify your team's updated leave records. Should you find any discrepancies, please contact to <span style="background:#c92A2A;color:white;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:4px;font-weight:600;">Administration Department</span> for immediate clarification.
                                </p>
                                <!-- Enhanced Button -->
                                <div style="margin:20px 0 0 0;">
                                    <a href="{{dashboardUrl}}" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;color:#ffffff !important;padding:16px 40px;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;display:inline-block;box-shadow:0 6px 20px rgba(201,42,42,0.08);border:1px solid rgba(255,255,255,0.2);transition:all 0.3s ease;letter-spacing:0.5px;text-align:left;">
                                        View Leave Bank
                                    </a>
                                </div>
                            </div>

                           <!-- Footer Text -->
                        <div style="margin:35px 0 0 0;padding:20px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:10px;border-left:4px solid #c92A2A;">
                           <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                              Thank you for using APAC Management System.<br/>
                              <strong style="color:#000000ff;font-size:16px;">We're committed to keeping your records accurate and up-to-date.</strong>
                           </p>
                        </div>
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
