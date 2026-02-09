import { Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { EMAIL_ERROR } from '../../types/constants/error-messages.constants';
import { EmailResponse, MailOptions } from '../../types/interfaces/email.interface';
export class Mail {
  transporter: unknown;
  mailOptions: MailOptions;
  constructor(to: string, subject: string, text?: string, html?: string) {
    this.mailOptions = {
      from: 'no-reply@agilebrains.com',
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
  }
  sendMail() {
    const data = JSON.stringify({
      plain_body: this.mailOptions.text,
      to: [this.mailOptions.to],
      from: this.mailOptions.from,
      html_body: this.mailOptions.html,
      subject: this.mailOptions.subject,
    });
    const config: AxiosRequestConfig = {
      method: 'post',
      url: 'https://postalmail.agilebrains.com/api/v1/send/message',
      headers: {
        'X-Server-API-Key': 'Q2lHmTvY0Tf12IY0tbm0MkfU',
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios
      .request<EmailResponse>(config)
      .then((response: AxiosResponse<EmailResponse>) => {
        if (response.data.status === 'success') {
          Logger.log(EMAIL_ERROR.SEND_SUCCESS);
        } else {
          Logger.log(EMAIL_ERROR.RECIPIENT_REQUIRED);
        }
      })
      .catch((error: unknown) => {
        Logger.log(EMAIL_ERROR.SEND_FAILED, error);
      });
  }
}
