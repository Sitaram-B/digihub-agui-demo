import { Component, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Incident } from '../../services/mock-data';
import { AguiService } from '../../services/agui.service';

@Component({
  selector: 'app-incidents',
  imports: [CommonModule],
  templateUrl: './incidents.html',
  styleUrl: './incidents.scss'
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  totalIncidents: number = 0;

  constructor(
    private mockDataService: MockDataService,
    public aguiService: AguiService
  ) {
    // React to filter changes from the AGUI service
    effect(() => {
      const filters = this.aguiService.activeFilters();
      if (Object.keys(filters).length > 0) {
        this.incidents = this.mockDataService.filterIncidents(filters);
      } else {
        this.incidents = this.mockDataService.getIncidents();
      }
    });
  }

  ngOnInit(): void {
    const allIncidents = this.mockDataService.getIncidents();
    this.incidents = allIncidents;
    this.totalIncidents = allIncidents.length;
  }

  removeFilter(key: string): void {
    this.aguiService.removeFilter(key);
  }

  clearAllFilters(): void {
    this.aguiService.clearFilters();
  }

  onColumnFilter(key: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;
    
    // Get current filters to merge with
    const currentFilters = { ...this.aguiService.activeFilters() } as any;
    
    if (value) {
      currentFilters[key] = value;
    } else {
      delete currentFilters[key];
    }
    
    // Apply filters and mark that it was done manually by the user
    this.aguiService.applyFilters(currentFilters, false);
  }
}
