import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function BackupDirectoryListing() {
  // Path to the public/assets/backup directory
  const directoryPath = path.join(process.cwd(), 'public', 'assets', 'backup');
  
  let files: string[] = [];
  try {
    files = fs.readdirSync(directoryPath);
  } catch (error) {
    console.error("Could not read directory", error);
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>Index of /assets/backup</h1>
      <hr />
      <table style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last modified</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Link href="/assets/">../</Link></td>
            <td>-</td>
            <td>-</td>
          </tr>
          {files.map(file => {
            const filePath = path.join(directoryPath, file);
            let stats;
            try {
              stats = fs.statSync(filePath);
            } catch (e) {
              return null;
            }
            
            // Format date like Apache: 2026-05-08 03:00
            const mtime = stats.mtime.toISOString().replace('T', ' ').substring(0, 16);
            
            return (
              <tr key={file}>
                <td>
                  <a href={`/assets/backup/${file}`}>{file}</a>
                </td>
                <td>{mtime}</td>
                <td>{stats.size}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr />
      <address>SparkEdge/4.2.1-Enterprise Server at localhost Port 3000</address>
    </div>
  );
}
