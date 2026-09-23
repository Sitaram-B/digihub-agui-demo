import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Incident } from '../../services/mock-data';

@Component({
  selector: 'app-incidents',
  imports: [CommonModule],
  templateUrl: './incidents.html',
  styleUrl: './incidents.scss'
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.incidents = this.mockDataService.getIncidents();
  }
}
