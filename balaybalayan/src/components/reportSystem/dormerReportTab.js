import React, { useState, useEffect } from 'react';
import "simple-table-core/styles.css";
import { SimpleTable, HeaderObject } from "simple-table-core";
import { db, collection, getDocs } from '../../firebase'; 

const DormerReportTab = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const querySnapshot = await getDocs(collection(db, "reports"));
              const reportData = [];
              querySnapshot.forEach((doc) => {
                  reportData.push({
                      id: doc.id,
                      ...doc.data()
                  });
              });
              setData(reportData);
          } catch (error) {
              console.error("Error fetching data:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  // modify some data before slapping onto the table 

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
        { accessor: "statusCode", label: "Status", width: 100, isSortable: true, type: "number" },
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
    
};

export default DormerReportTab;