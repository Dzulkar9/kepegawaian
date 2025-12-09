
import { Page } from "./App";

export interface Employee {
  id: string;
  nip: string;
  name: string;
  position: string;
  department: string;
  status: 'Aktif' | 'Tidak Aktif';
  avatarUrl: string;
  joinDate: string;
  email: string;
}

export enum AttendanceStatus {
  Hadir = 'Hadir',
  Sakit = 'Sakit',
  Izin = 'Izin',
  Alpha = 'Alpha',
}
export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
}

export enum LeaveStatus {
  Menunggu = 'Menunggu',
  Disetujui = 'Disetujui',
  Ditolak = 'Ditolak',
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewDate: string;
  reviewerId: string;
  score: number; // 1-5
  comments: string;
}

export enum OvertimeStatus {
    Menunggu = 'Menunggu',
    Disetujui = 'Disetujui',
    Ditolak = 'Ditolak',
}
export interface OvertimeRequest {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  reason: string;
  status: OvertimeStatus;
}

export interface AppNotification {
  id: string;
  userId: string; // employeeId or 'admin'
  message: string;
  read: boolean;
  timestamp: number;
  link?: Page;
}
