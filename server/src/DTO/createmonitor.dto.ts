export class CreateMonitorDto{
  name: string;
  url: string;
  type: 'HTTP' | 'KEYWORD'; // can extend later
  interval?: number; // seconds, min 30
  timeout?: number; // seconds, max 60
  keywordType?: 'ALERT_EXISTS' | 'ALERT_NOT_EXISTS';
  keywordCaseType?: 0 | 1;
  keywordValue?: string;
  httpMethodType?: 'HEAD' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
  authType?: 'NONE' | 'HTTP_BASIC' | 'DIGEST';
  assignedAlertContacts?: AlertContact[];

}
interface AlertContact {
  alertContactId: number;
  threshold: number;
  recurrence: number;
}
