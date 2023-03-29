# fast-exif

[![Build Status](https://travis-ci.org/titarenko/fast-exif.svg?branch=master)](https://travis-ci.org/titarenko/fast-exif)

Because you do not need to read megabytes of JPEG to obtain EXIF. 512 bytes should be enough.

## Installation

```bash
npm i fast-exif --save
```

## Usage

```js
const exif = require("fast-exif");
exif.read("my.jpg").then(console.log).catch(console.error);
```

```
{ image:
   { Make: 'Canon',
     Model: 'Canon EOS 30D',
     Orientation: 1,
     XResolution: 72,
     YResolution: 72,
     ResolutionUnit: 2,
     Software: 'Aperture 3.4.3',
     ModifyDate: Tue Dec 25 2012 04:25:39 GMT+0200 (EET),
     ExifOffset: 194 },
  exif:
   { ExposureTime: 0.0015625,
     FNumber: 10,
     ExposureProgram: 3,
     ISO: 1250,
     ExifVersion: <Buffer 30 32 32 31>,
     DateTimeOriginal: Tue Dec 25 2012 04:25:39 GMT+0200 (EET),
     DateTimeDigitized: Tue Dec 25 2012 04:25:39 GMT+0200 (EET),
     ComponentsConfiguration: <Buffer 00 00 00 00>,
     ShutterSpeedValue: 9.321929824561403,
     ApertureValue: 6.643859649122807,
     ExposureBiasValue: -0.3333333333333333,
     MaxApertureValue: 5.595918367346939,
     MeteringMode: 5,
     Flash: 16,
     FocalLength: 18,
     FlashpixVersion: <Buffer 30 31 30 30>,
     ColorSpace: 1,
     PixelXDimension: 1613,
     PixelYDimension: 1075,
     FocalPlaneXResolution: 3959.322033898305,
     FocalPlaneYResolution: 3959.322033898305,
     FocalPlaneResolutionUnit: 2,
     CustomRendered: 0,
     ExposureMode: 0,
     WhiteBalance: 0,
     SceneCaptureType: 0 } }
```

## Why?

Because [most popular npm module for exif](https://www.npmjs.com/package/exif) [reads complete file into memory](https://github.com/gomfunkel/node-exif/issues/27) causing OOM kill.

## Advanced usage

If `fast-exif` returned `null` instead of object with EXIF info, then

- either file does not have any EXIF info
- or EXIF marker is located outside of first 512 bytes

In such case

- specify number of 512-byte blocks to examine while searching for EXIF (`exif.read('my.jpeg', 20)`)
- or specify `true` for unlimited (to the end of file) search (`exif.read('my.jpeg', true)`)

## License

MIT
