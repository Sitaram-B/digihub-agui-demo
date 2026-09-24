import { Injectable } from '@angular/core';

export interface Incident {
  ticketNumber: string;
  createdDate: string;
  shortDescription: string;
  service: string;
  status: string;
  location: string;
  locationCity: string;
  priority: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private allIncidents: Incident[] = [
    { ticketNumber: 'CCD012146', createdDate: '26-Aug-2026, 16:31', shortDescription: 'MPLS link flapping', service: 'SITA CONNECT CORE', status: 'New', location: 'Ham_1_DEU_Hamburg_001', locationCity: 'Hamburg', priority: '4 - Low' },
    { ticketNumber: 'CCD012131', createdDate: '25-Aug-2026, 09:14', shortDescription: 'Latency on primary path', service: 'SITA CONNECT LIGHT', status: 'Assigned', location: 'Ham_1_DEU_Hamburg_002', locationCity: 'Hamburg', priority: '3 - Moderate' },
    { ticketNumber: 'CCD012098', createdDate: '24-Aug-2026, 21:47', shortDescription: 'Circuit down at edge', service: 'SITA CONNECT CORE', status: 'In Progress', location: 'Ham_1_DEU_Hamburg_001', locationCity: 'Hamburg', priority: '2 - High' },
    { ticketNumber: 'CCD012074', createdDate: '23-Aug-2026, 11:05', shortDescription: 'Intermittent packet loss', service: 'SITA CONNECT CORE', status: 'Assigned', location: 'Ham_2_DEU_Hamburg_004', locationCity: 'Hamburg', priority: '4 - Low' },
    { ticketNumber: 'CCD012061', createdDate: '22-Aug-2026, 08:33', shortDescription: 'Router CPU threshold', service: 'SITA CONNECT LIGHT', status: 'Assigned', location: 'Ham_1_DEU_Hamburg_002', locationCity: 'Hamburg', priority: '3 - Moderate' },
    { ticketNumber: 'CCD012055', createdDate: '21-Aug-2026, 17:52', shortDescription: 'Failover did not complete', service: 'SITA CONNECT CORE', status: 'New', location: 'Ham_2_DEU_Hamburg_004', locationCity: 'Hamburg', priority: '2 - High' },
    { ticketNumber: 'CCD012033', createdDate: '20-Aug-2026, 14:20', shortDescription: 'DNS resolution failure', service: 'SITA CONNECT CORE', status: 'Resolved', location: 'Fra_1_DEU_Frankfurt_001', locationCity: 'Frankfurt', priority: '3 - Moderate' },
    { ticketNumber: 'CCD012021', createdDate: '19-Aug-2026, 10:45', shortDescription: 'VPN tunnel flapping', service: 'SITA CONNECT LIGHT', status: 'Resolved', location: 'Fra_1_DEU_Frankfurt_001', locationCity: 'Frankfurt', priority: '2 - High' },
    { ticketNumber: 'CCD012010', createdDate: '18-Aug-2026, 07:30', shortDescription: 'Bandwidth saturation', service: 'SITA CONNECT CORE', status: 'Closed', location: 'Par_1_FRA_Paris_001', locationCity: 'Paris', priority: '1 - Critical' },
    { ticketNumber: 'CCD011998', createdDate: '17-Aug-2026, 22:15', shortDescription: 'BGP peer session dropped', service: 'SITA CONNECT CORE', status: 'Closed', location: 'Lon_1_GBR_London_001', locationCity: 'London', priority: '2 - High' },
    { ticketNumber: 'CCD011985', createdDate: '16-Aug-2026, 15:00', shortDescription: 'Interface CRC errors', service: 'SITA CONNECT LIGHT', status: 'Closed', location: 'Mad_1_ESP_Madrid_001', locationCity: 'Madrid', priority: '4 - Low' },
    { ticketNumber: 'CCD011970', createdDate: '15-Aug-2026, 09:30', shortDescription: 'Firewall rule misconfigured', service: 'SITA CONNECT CORE', status: 'Closed', location: 'Ham_1_DEU_Hamburg_001', locationCity: 'Hamburg', priority: '3 - Moderate' },
  ];

  getIncidents(): Incident[] {
    return [...this.allIncidents];
  }

  filterIncidents(filters: {
    status?: string;
    service?: string;
    location?: string;
    window?: string;
  }): Incident[] {
    let result = [...this.allIncidents];

    if (filters.status && filters.status !== 'All') {
      if (filters.status.toLowerCase() === 'open') {
        // Open = New, Assigned, In Progress
        result = result.filter(i =>
          ['New', 'Assigned', 'In Progress'].includes(i.status)
        );
      } else if (filters.status.toLowerCase() === 'closed') {
        result = result.filter(i =>
          ['Closed', 'Resolved'].includes(i.status)
        );
      } else {
        result = result.filter(i =>
          i.status.toLowerCase() === filters.status!.toLowerCase()
        );
      }
    }

    if (filters.service) {
      const svc = filters.service.toLowerCase();
      result = result.filter(i => i.service.toLowerCase().includes(svc));
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(i =>
        i.locationCity.toLowerCase().includes(loc) ||
        i.location.toLowerCase().includes(loc)
      );
    }

    // window filter is cosmetic for the demo (all data is within range)

    return result;
  }
}
