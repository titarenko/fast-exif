import fs from "fs/promises";
import exifReader from "exif-reader";

export async function read(fileName: string, maxIterations?: number | true) {
  if (maxIterations === true) {
    // former isDeepSearch boolean argument
    maxIterations = Number.MAX_SAFE_INTEGER;
  }
  if (maxIterations === undefined) {
    maxIterations = 1;
  }
  let file;
  try {
    file = await fs.open(fileName, "r");
    const exifBuffer = await searchExif(file, maxIterations);
    if (exifBuffer) {
      const exif = exifReader(exifBuffer);
      return exif;
    }
  } finally {
    if (file) {
      await file.close();
    }
  }
}

async function searchExif(file: fs.FileHandle, remainingIterations: number) {
  const buffer = Buffer.alloc(512);
  let fileOffset = 0;
  while (remainingIterations--) {
    const result = await file.read(buffer, 0, buffer.length, null);
    if (!result.bytesRead) {
      return;
    }

    let bufferOffset = 0;
    while (bufferOffset < buffer.length) {
      if (buffer[bufferOffset++] == 0xff && buffer[bufferOffset] == 0xe1) {
        const exifBuffer = Buffer.alloc(buffer.readUInt16BE(++bufferOffset));
        await file.read(
          exifBuffer,
          0,
          exifBuffer.length,
          fileOffset + bufferOffset + 2
        );
        return exifBuffer;
      }
    }

    fileOffset += buffer.length;
  }
}
