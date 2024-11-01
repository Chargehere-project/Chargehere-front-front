// /src/pages/api/admin/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';

// Multer 설정
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 파일 크기 제한 (2MB)
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        console.error('API Route Error:', error);
        res.status(501).json({ error: `Something went wrong: ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req: NextApiRequest & { file: Express.Multer.File }, res: NextApiResponse) => {
    const file = req.file;
    if (!file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl: `data:image/png;base64,${file.buffer.toString('base64')}`,
    });
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apiRoute;
