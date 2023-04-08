export async function fetchReports() {
    const response = await fetch('reports.json');
    const data = await response.json();
    return data;
}

export async function deleteReport(reportId) {
    const response = await fetch('delete_report.php', {
        method: 'POST',
        body: JSON.stringify({ id: reportId }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

// function createReportListItem(report) {
//     const li = document.createElement('li');
//     li.textContent = `ID: ${report.id}, Name: ${report.name}, Location: ${report.street}, ${report.city}, ${report.postal_code}`;
//     const deleteButton = document.createElement('button');
//     deleteButton.textContent = 'Supprimer';
//     deleteButton.onclick = async () => {
//         const result = await deleteReport(report.id);
//         if (result.status === 'success') {
//             li.remove();
//         } else {
//             alert('Erreur lors de la suppression du rapport');
//         }
//     };
//     li.appendChild(deleteButton);
//     return li;
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     const reportList = document.getElementById('report-list');
//     const reports = await fetchReports();
//     reports.forEach(report => {
//         const listItem = createReportListItem(report);
//         reportList.appendChild(listItem);
//     });
// });