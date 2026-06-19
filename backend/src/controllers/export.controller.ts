import { Request, Response } from "express";
import Lead from "../models/Lead.model";

export class ExportController {
  /**
   * Export the lead database to standard CSV format.
   */
  static async exportCSV(req: Request, res: Response) {
    try {
      const filter: any = { companyId: req.user.companyId };
      if (req.user.role === "sales") {
        filter.assignedTo = req.user._id;
      }
      const leads = await Lead.find(filter).populate("assignedTo", "name email");

      const headers = [
        "Lead Name",
        "Company Name",
        "Email",
        "Mobile Number",
        "Source",
        "Requirement",
        "Budget",
        "Status",
        "Assigned To",
        "Follow-up Date",
        "AI Score",
        "Created At",
      ];

      const escapeCSVValue = (val: any) => {
        if (val === undefined || val === null) return "";
        let str = String(val).replace(/"/g, '""'); // Escape double quotes
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          str = `"${str}"`;
        }
        return str;
      };

      let csvContent = headers.join(",") + "\n";

      leads.forEach((lead) => {
        const row = [
          lead.name,
          lead.company || "",
          lead.email || "",
          lead.mobile,
          lead.source,
          lead.requirement || "",
          lead.budget || 0,
          lead.status,
          lead.assignedTo ? (lead.assignedTo as any).name : "Unassigned",
          lead.followUpDate ? lead.followUpDate.toISOString() : "",
          lead.aiScore || "",
          lead.createdAt.toISOString(),
        ];
        csvContent += row.map(escapeCSVValue).join(",") + "\n";
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=leads_export.csv");
      res.status(200).send(csvContent);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to export CSV",
      });
    }
  }

  /**
   * Export the lead database to Microsoft Excel XLS format (HTML spreadsheet table).
   */
  static async exportExcel(req: Request, res: Response) {
    try {
      const filter: any = { companyId: req.user.companyId };
      if (req.user.role === "sales") {
        filter.assignedTo = req.user._id;
      }
      const leads = await Lead.find(filter).populate("assignedTo", "name email");

      // Generate HTML spreadsheet table conforming to Excel standards
      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Leads Database</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"/>
          <style>
            table { border-collapse: collapse; }
            th { background-color: #f2f2f2; font-weight: bold; border: 1px solid #cccccc; padding: 5px; }
            td { border: 1px solid #cccccc; padding: 5px; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Source</th>
                <th>Requirement</th>
                <th>Budget ($)</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Follow-up Date</th>
                <th>AI Score</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
      `;

      leads.forEach((lead) => {
        html += `
          <tr>
            <td>${this.escapeHTML(lead.name)}</td>
            <td>${this.escapeHTML(lead.company || "")}</td>
            <td>${this.escapeHTML(lead.email || "")}</td>
            <td>${this.escapeHTML(lead.mobile)}</td>
            <td>${this.escapeHTML(lead.source)}</td>
            <td>${this.escapeHTML(lead.requirement || "")}</td>
            <td>${lead.budget || 0}</td>
            <td>${this.escapeHTML(lead.status)}</td>
            <td>${this.escapeHTML(lead.assignedTo ? (lead.assignedTo as any).name : "Unassigned")}</td>
            <td>${lead.followUpDate ? lead.followUpDate.toISOString() : ""}</td>
            <td>${lead.aiScore || ""}</td>
            <td>${lead.createdAt.toISOString()}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "application/vnd.ms-excel");
      res.setHeader("Content-Disposition", "attachment; filename=leads_export.xls");
      res.status(200).send(html);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to export Excel",
      });
    }
  }

  private static escapeHTML(val: string): string {
    return val
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
