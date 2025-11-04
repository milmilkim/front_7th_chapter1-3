import fs from 'fs/promises';
import path from 'path';

export default async () => {
  const __dirname = path.resolve();
  const mockDir = path.join(__dirname, 'src/__mocks__/response');

  try {
    // e2e-worker-*.json 패턴과 일치하는 모든 파일 찾기
    const files = await fs.readdir(mockDir);
    const workerDbFiles = files.filter((file) => /^e2e-worker-\d+\.json$/.test(file));

    // 모든 워커 DB 파일 삭제
    await Promise.all(
      workerDbFiles.map(async (file) => {
        const filePath = path.join(mockDir, file);
        try {
          await fs.unlink(filePath);
          console.log(`Cleaned up: ${file}`);
        } catch (error) {
          // 파일이 이미 없으면 무시 (데드락 방지)
          if ((error as { code?: string }).code !== 'ENOENT') {
            console.error(`Failed to delete ${file}:`, error);
          }
        }
      })
    );

    console.log('Global teardown completed');
  } catch (error) {
    console.error('Global teardown failed:', error);
  }
};
