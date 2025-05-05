import React from 'react';
import "simple-table-core/styles.css";
import { SimpleTable, HeaderObject } from "simple-table-core";



const DormerReportTab = () => {

    const data = [{
        id: "KAN-666",
        subject: "broke the window :( sorry",
        status: "ongoing",
        dateSubmitted: "2025-05-05",
        actionTaken: "repair scheduled on may 6, 2026"
      }];

      const headers: HeaderObject[] = [
        { accessor: "id", label: "ID", width: 100, isSortable: true, type: "number" },
        {
          accessor: "subject",
          label: "Subject",
          minWidth: 275,
          width: "1fr",
          isSortable: true,
          type: "string",
        },
        { accessor: "status", label: "Status", width: 100, isSortable: true, type: "number" },
        { accessor: "dateSubmitted", label: "Date Submitted", width: 150, isSortable: true, type: "string" },
        { accessor: "actionTaken", label: "Action Taken", width: 300, isSortable: true, type: "string" },
      ];

      const rows = data.map((item) => ({
        rowMeta: { rowId: item.id },
        rowData: item,
      }));
    
    return (
        <SimpleTable theme="dark" defaultHeaders={headers} editColumns rows={rows} rowHeight={48} selectableCells />
    );

        // <div className='reportContainer'>

        // <div className='reportHeader'>
        //     <span>Report ID</span>
        //     <span>Concern</span>
        //     <span>Date Submitted</span>
        //     <span>Status</span>
        //     <span>Action Taken</span>
        // </div>

        // <div className='reportContent'>
        //     <span>{dummyData.id}</span>
        //     <span>{dummyData.subject}</span>
        //     <span>{dummyData.dateSubmitted}</span>
        //     <span>{dummyData.status}</span>
        //     <span>{dummyData.actionTaken}</span>
        // </div>

        // </div>


    
};

export default DormerReportTab;