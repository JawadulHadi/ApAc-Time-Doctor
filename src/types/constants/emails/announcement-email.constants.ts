export const htmlAnnouncementEmail = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mission Statement 2026 - APAC Management System</title>
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
                <tr><td align="center" style="padding:20px 30px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 15px 50px rgba(201,42,42,0.15);border:1px solid rgba(201,42,42,0.1);">

                        <!-- Header Section -->
                        <tr><td class="header-bg" style="background:linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);background-color:#c92A2A;padding:40px 30px;color:#ffffff;text-align:left;position:relative;overflow:hidden;">
                           <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:url('data:image/svg+xml,
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05">
                              <circle cx="20" cy="20" r="2" fill="white"/>
                              <circle cx="80" cy="40" r="2" fill="white"/>
                              <circle cx="60" cy="80" r="2" fill="white"/>
                           </svg>
                           </div>
                           <div style="position:absolute;top:-30%;right:-30%;width:60%;height:160%;background:radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);transform:rotate(25deg);z-index:2;"></div>
                           <div style="position:relative;z-index:3;">
                              <h1 style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:32px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#ffffff;text-shadow:0 4px 12px rgba(0,0,0,0.3);line-height:1.1;">
                                 APAC MANAGEMENT SYSTEM
                              </h1>
                              <div style="height:3px;width:60px;background:linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%);background-color:rgba(255,255,255,0.8);margin:12px 0 8px 0;border-radius:2px;"></div>
                              <p style="margin:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:15px;font-weight:600;color:#f8f9fa;letter-spacing:1.2px;">
                                 Mission Statement 2026
                              </p>
                           </div>
                        </td></tr>

                        <!-- Body Section -->
                        <tr><td class="body-bg" style="padding:45px 35px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#2a2d37;text-align:left;background:linear-gradient(180deg, #ffffff 0%, #fdfdfd 100%);background-color:#ffffff;">

                           <!-- Icon -->
                           <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                 <td style="padding-bottom:30px;">
                                    <div style="width:90px;height:90px;background:linear-gradient(135deg, rgba(201,42,42,0.08) 0%, rgba(226,87,87,0.12) 100%);background-color:rgba(201,42,42,0.08);border-radius:50%;line-height:90px;text-align:center;font-size:36px;color:#c92A2A;border:2px solid rgba(201,42,42,0.1);box-shadow:0 8px 25px rgba(201,42,42,0.15);">
                                       📢
                                    </div>
                                 </td>
                              </tr>
                           </table>

                           <h2 style="margin:0 0 20px 0;color:#c92A2A;font-size:18px;font-weight:600;">Mission Statement Now Available!</h2>

                           <div style="text-align:left;color:#4a4f5c;font-size:16px;line-height:1.7;">
                              <p style="margin:0 0 16px 0;color:#2a2d37;">Hi {{userName}},</p>
                              <p style="margin:0 0 30px 0;color:#4a4f5c;">Now you will be able to review your <strong style="color:#c92A2A;">Mission Statement for the year ${new Date().getFullYear()}</strong> on your Dashboard.</p>

                              <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                                 <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    💡 Mission Statement Benefits
                                 </p>
                                 <p style="margin:0;color:#4a4f5c;font-size:15px;line-height:1.6;">
                                    We have added this to your profile so that each time you visit the dashboard, you are reminded of your commitment and stay motivated to achieve your goals.
                                 </p>
                              </div>

                              <!-- Mission Statement Image Card -->
                              <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);background-color:#f8f9fa;border-radius:12px;border-left:4px solid #c92A2A;">
                                 <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    📄 Your Mission Statement
                                 </p>
                                 <div style="text-align:center;margin:20px 0;">
                                    <img src="{{imageUrl}}" alt="Mission Statement ${new Date().getFullYear()}" style="max-width:100%;height:auto;border-radius:8px;border:1px solid #ddd;" width="550"/>
                                 </div>
                              </div>
                              <!-- Action Button -->
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                                 <tr>
                                    <td align="left">
                                       <a href="{{dashboardUrl}}"
                                             target="_blank"
                                       rel="noopener noreferrer"
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
                                          View Dashboard
                                          </a>
                                    </td>
                                 </tr>
                              </table>

                              <!-- Coordination Note -->
                              <div style="margin:30px 0;padding:25px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:12px;border-left:4px solid #c92A2A;">
                                 <p style="font-size:16px;font-weight:600;color:#2a2d37;margin:0 0 15px 0;display:flex;align-items:center;">
                                    🙏 Special Thanks
                                 </p>
                                 <p style="margin:0;color:#4a4f5c;font-size:15px;line-height:1.6;">
                                    Thank you, <strong style="color:#c92A2A;">Ebad Khan</strong>, for the coordination.
                                 </p>
                              </div>

                              <!-- Footer Text -->
                              <div style="margin:35px 0 0 0;padding:25px;background:linear-gradient(135deg, #fef7f7 0%, #fafafa 100%);background-color:#fef7f7;border-radius:12px;border-left:4px solid #c92A2A;">
                                 <p style="font-size:15px;line-height:1.6;margin:0;font-style:italic;color:#6a7180;">
                                    With appreciation,<br>
                                    <strong style="color:#2a2d37;font-size:16px;">The APAC Management Team</strong>
                                 </p>
                              </div>
                        </td></tr>
<!-- Footer Section -->
                            <tr><td class="footer-bg" style="background-color:#2a2d37;padding:12px 15px;text-align:center;font-size:11px;color:#a0a7b5;">
                                <p style="margin:0;color:#a0a7b5;">
                                    Copyright ${new Date().getFullYear()} APAC Management System. All rights reserved.
                                    
                                </p>
                            </td></tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>`;
export const htmlLeaveBank = `<!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>APAC Management System - Leave Bank</title>
            <!--[if mso]>
            <style>
                .header-bg { background-color: #c92A2A !important; }
                .button-bg { background-color: #c92A2A !important; }
                .footer-bg { background-color: #2a2d37 !important; }
                .body-bg { background-color: #ffffff !important; }
                .animated-gradient {
                background: linear-gradient(135deg, #c92A2A 0%, #ff8f8f 100%);
                background-size: 200% 200%;
                animation: moveGradient 2s ease-in infinite;
                }

                @keyframes moveGradient {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
        }
            </style>
            <![endif]-->
        </head>

        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #fef7f7 0%, #f0f2f5 100%)">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td align="center" style="padding: 20px 10px">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="
                            background-color: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 8px 30px rgba(201, 42, 42, 0.1);
                        ">
                            <!-- Header Section -->
                            <tr>
                                <td class="header-bg" style="
                                    background: linear-gradient(135deg, #c92A2A 0%, #d43f3f 50%, #e25757 100%);
                                    padding: 30px 20px;
                                    color: #ffffff;
                                    text-align: center;
                                    position: relative;
                                    overflow: hidden;
                                ">
                                    <div style="
                                        position: absolute;
                                        top: -30%;
                                        right: -30%;
                                        width: 60%;
                                        height: 160%;
                                        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
                                        transform: rotate(25deg);
                                        z-index: 2;
                                    "></div>
                                    <div style="position: relative; z-index: 3;">
                                        <h1 style="
                                            margin: 0;
                                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                            font-size: 24px;
                                            font-weight: 700;
                                            letter-spacing: 0.5px;
                                            text-transform: uppercase;
                                            color: #ffffff;
                                            line-height: 1.1;
                                        ">
                                            APAC MANAGEMENT SYSTEM
                                        </h1>
                                        <div style="
                                        height: 2px;
                                        width: 40px;
                                        background: rgba(255,255,255,0.8);
                                            margin: 8px auto;
                                            border-radius: 1px;
                                        "></div>
                                        <p style="
                                            margin: 0;
                                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                            font-size: 14px;
                                            font-weight: 600;
                                            color: #f8f9fa;
                                        ">
                                            Leave Bank
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Body Section -->
                            <tr>
                                <td style="
                                    padding: 30px 25px;
                                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    color: #2a2d37;
                                    text-align: center;
                                ">
                                    <!-- Feature Icon -->
                                    <div style="
                                        width: 60px;
                                        height: 60px;
                                        background: linear-gradient(135deg, rgba(201, 42, 42, 0.1) 0%, rgba(226, 87, 87, 0.15) 100%);
                                        border-radius: 50%;
                                        line-height: 60px;
                                        text-align: center;
                                        font-size: 24px;
                                        color: #c92A2A;
                                        margin: 0 auto 20px;
                                        border: 2px solid rgba(201, 42, 42, 0.1);
                                    ">
                                        📢
                                    </div>

                                    <h2 style="color: #c92A2A; margin: 0 0 15px 0; font-size: 20px;">
                                        Leave Bank Now Available!
                                    </h2>

                                    <!-- Content with Enhanced Typography -->
                                    <p
                                        style="font-size: 16px; line-height: 1.7; margin: 0 0 16px 0; color: #2a2d37; text-align: left;">
                                        Hi {{employeeName}},
                                    </p>
                                    <p
                                        style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #2a2d37; text-align: left;">
                                        We're pleased to share that <strong style="color: #c92A2A;">Leave Bank</strong> has been
                                        added to the APAC Management System,
                                        making leave tracking more convenient for you.
                                    </p>

                                    <!-- Feature Benefits -->
                                    <div style="
                                        background: #fff5f5;
                                        padding: 15px;
                                        border-radius: 8px;
                                        margin: 20px 0;
                                        text-align: left;
                                    ">
                                        <p style="
                                            font-size: 14px;
                                            margin: 0 0 10px 0;
                                            color: #c92A2A;
                                            font-weight: 600;
                                        ">
                                            What's new:
                                        </p>
                                        <ul style="font-size: 14px; color: #374151; margin: 0; padding-left: 15px">
                                            <li style="margin-bottom: 5px">You can now easily track your leave balance.</li>
                                            <li style="margin-bottom: 5px">Monthly leave bank history is maintained for better
                                                visibility.</li>
                                            <li>Team Leads/Reporting Lines have access to their team's leave balance to support
                                                administrative coordination.</li>
                                        </ul>
                                    </div>

                                    <!-- Special Thanks -->
                                    <div style="
                                        margin: 20px 0;
                                        padding: 15px;
                                        background: linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%);
                                        border-radius: 8px;
                                        text-align: center;
                                    ">
                                        <p style="font-size: 14px; margin: 0; color: #374151">
                                            A special thanks to <strong>Rayan Ahmad</strong> for his efforts in making this
                                            feature a <strong style="color: #c92A2A;">success</strong>.👏
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
