import { Component } from '@angular/core';
import { z } from 'zod';
import { CopilotSidebar, registerFrontendTool } from '@copilotkit/angular';
import { AguiService } from '../../services/agui.service';

@Component({
  selector: 'app-chatbot',
  imports: [CopilotSidebar],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
  host: {
    '[style.width.px]': 'sidebarOpen ? 380 : 0',
    '[style.transition]': '"width 0.3s ease-in-out"'
  }
})
export class ChatbotComponent {
  sidebarOpen = true;

  constructor(private aguiService: AguiService) {
    // Register frontend tool: applyIncidentFilters
    registerFrontendTool({
      name: 'applyIncidentFilters',
      description: 'Apply filters to the incidents grid',
      parameters: z.object({
        status: z.string().optional().describe('Filter by status: Open, Closed, All'),
        service: z.string().optional().describe('Filter by service name'),
        location: z.string().optional().describe('Filter by location/city'),
        window: z.string().optional().describe('Time window: 7 days, 14 days, 30 days'),
      }),
      handler: async (args) => {
        // Navigate to incidents page first
        this.aguiService.navigateTo('operational-support/incidents');

        // Apply filters
        this.aguiService.applyFilters({
          status: args.status,
          service: args.service,
          location: args.location,
          window: args.window,
        });

        const appliedFilters = Object.entries(args)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');

        return `Applied filters to the incidents grid: ${appliedFilters}`;
      },
    });

    // Register frontend tool: navigateToPage
    registerFrontendTool({
      name: 'navigateToPage',
      description: 'Navigate to a page in the Ops portal',
      parameters: z.object({
        page: z.string().describe('Page path: operational-support/incidents or billing'),
      }),
      handler: async (args) => {
        this.aguiService.navigateTo(args.page);
        return `Navigated to ${args.page}`;
      },
    });
  }
}
