import { Injectable } from '@angular/core';

export interface Incident {
  ticketNumber: string;
  createdDate: string;
  shortDescription: string;
  service: string;
  status: string;
  location: string;
  priority: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  getIncidents(): Incident[] {
    return [
      { ticketNumber: 'CCD012146', createdDate: '26-Aug-2026, 16:31', shortDescription: 'MPLS link flapping', service: 'SITA CONNECT CORE', status: 'New', location: 'Ham_1_DEU_Hamburg_001', priority: '4 - Low' },
      { ticketNumber: 'CCD012131', createdDate: '25-Aug-2026, 09:14', shortDescription: 'Latency on primary path', service: 'SITA CONNECT LIGHT', status: 'Assigned', location: 'Ham_1_DEU_Hamburg_002', priority: '3 - Moderate' },
      { ticketNumber: 'CCD012098', createdDate: '24-Aug-2026, 21:47', shortDescription: 'Circuit down at edge', service: 'SITA CONNECT CORE', status: 'In Progress', location: 'Ham_1_DEU_Hamburg_001', priority: '2 - High' },
      { ticketNumber: 'CCD012074', createdDate: '23-Aug-2026, 11:05', shortDescription: 'Intermittent packet loss', service: 'SITA CONNECT CORE', status: 'Assigned', location: 'Ham_2_DEU_Hamburg_004', priority: '4 - Low' },
      { ticketNumber: 'CCD012061', createdDate: '22-Aug-2026, 08:33', shortDescription: 'Router CPU threshold', service: 'SITA CONNECT LIGHT', status: 'Assigned', location: 'Ham_1_DEU_Hamburg_002', priority: '3 - Moderate' },
      { ticketNumber: 'CCD012055', createdDate: '21-Aug-2026, 17:52', shortDescription: 'Failover did not complete', service: 'SITA CONNECT CORE', status: 'New', location: 'Ham_2_DEU_Hamburg_004', priority: '2 - High' }
    ];
  }
}
