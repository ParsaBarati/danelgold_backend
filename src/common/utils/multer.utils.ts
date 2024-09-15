import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { createSubdirectory } from './create-directory.utils';
import { BadRequestException } from '@nestjs/common';

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', 'm4v'];

export const multerConfigFactory = (configService: ConfigService) => ({
  storage: diskStorage({
    destination: async (req, file, cb) => {
      try {
        const subdirectory = createSubdirectory(new Date());
        const directory = configService.get<string>('MULTER_DEST');
        if (!directory) {
          throw new Error('MULTER_DEST configuration is missing.');
        }
        const uploadDir = path.join(directory, subdirectory);
        console.log(`uploadDir >>> ${uploadDir}`);
        await fs.ensureDir(uploadDir);
        cb(null, uploadDir);
      } catch (error) {
        cb(new Error(String(error)), '');
      }
    },
    filename: async (req, file, cb) => {
      try {
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);
        const directory = configService.get<string>('MULTER_DEST');
        const subdirectory = createSubdirectory(new Date());
        const uploadDir = path.resolve(directory, subdirectory);

        let finalFilename = `${baseName}${extension}`;
        let filePath = path.resolve(uploadDir, finalFilename);
        let counter = 1;

        while (await fs.pathExists(filePath)) {
          finalFilename = `${baseName}-${counter}${extension}`;
          filePath = path.resolve(uploadDir, finalFilename);
          counter++;
        }

        cb(null, finalFilename);
      } catch (error) {
        cb(new Error(String(error)), '');
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'فرمت فایل مجاز نیست. فقط فایل‌های jpg, jpeg, png, و webp قابل قبول هستند.',
        ),
        false,
      );
    }
  },
});
