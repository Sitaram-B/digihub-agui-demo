import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface IncidentFilter {
  status?: string;
  service?: string;
  location?: string;
  window?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AguiService {
  // Reactive state signals
  readonly currentPage = signal<string>('operational-support/incidents');
  readonly activeFilters = signal<IncidentFilter>({});
  readonly filterPills = computed(() => {
    const filters = this.activeFilters();
    const pills: { label: string; key: string }[] = [];
    if (filters.status) pills.push({ label: `Status: ${filters.status}`, key: 'status' });
    if (filters.service) pills.push({ label: `Service: ${filters.service}`, key: 'service' });
    if (filters.location) pills.push({ label: `Location: ${filters.location}`, key: 'location' });
    if (filters.window) pills.push({ label: `Last ${filters.window}`, key: 'window' });
    return pills;
  });
  readonly appliedByAssistant = signal<boolean>(false);

  constructor(private router: Router) {}

  applyFilters(filters: IncidentFilter, byAssistant: boolean = true): void {
    this.activeFilters.set(filters);
    this.appliedByAssistant.set(byAssistant);
  }

  removeFilter(key: string): void {
    const current = this.activeFilters();
    const updated = { ...current };
    delete (updated as any)[key];
    this.activeFilters.set(updated);
    if (Object.keys(updated).length === 0) {
      this.appliedByAssistant.set(false);
    }
  }

  clearFilters(): void {
    this.activeFilters.set({});
    this.appliedByAssistant.set(false);
  }

  navigateTo(page: string): void {
    this.currentPage.set(page);
    this.router.navigate(['/' + page]);
  }
}
