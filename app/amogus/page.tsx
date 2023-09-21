"use client"
import { Button, ButtonProps, Col, Row, Upload, UploadProps, Image as AntdImage } from 'antd'
import { LoadingOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import Title from 'antd/es/typography/Title'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useRef, useState } from 'react';

const pattern = [
  [1,1,1,0,0,0,0,0],
  [1,0,1,1,0,0,0,0],
  [1,1,1,1,0,0,0,0],
  [1,0,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,0],
  [0,0,0,0,1,0,1,1],
  [0,0,0,0,1,1,1,1],
  [0,0,0,0,1,0,1,0],
]

function listToMatrix(list: Uint8ClampedArray, elementsPerSubArray: number) {
  var matrix = [], i, k, n;

  for (i=0; i<list.length/(elementsPerSubArray*4); i++) {
    let rowList = []
    for (k=0; k<elementsPerSubArray; k++) {
      let pixelList = []
      for (n=0; n<4; n++) {
        pixelList.push(list[i*elementsPerSubArray*4 + k*4 + n])
      }
      rowList.push(pixelList)
    }
    matrix.push(rowList)
  }
  
  return matrix;
}

// function matrixToList(matrix: number[][][]) {
//   let list = [], i, k, n

//   for (i=0; i<matrix.length; i++) {
//     for (k=0; k<matrix[i].length; k++) {
//       for (n=0; n<matrix[i][k].length; n++) {
//         list.push(list[i*elementsPerSubArray + k*4 + n])
//       }
//       rowList.push(pixelList)
//     }
//     matrix.push(rowList)
//   }
// }

const amogussify = (rawImageMatrix: Uint8ClampedArray, imageWidth: number) => {
  let i = 0
  let resultImage = listToMatrix(rawImageMatrix, imageWidth)

  // for row in rawImageMatrix:
  resultImage.forEach((row) => {
    amogussifyRow(row, i)
    i = (i + 1) % pattern.length
  })

  const flattened = resultImage.flat(3)

  return new Uint8ClampedArray(flattened)
}

// def amogussifyRow(rawRow: Array, rowIdx: int):
const amogussifyRow = (rawRow: number[][], rowIdx: number) => {
  let j = 0
  // for pixel in rawRow:
  rawRow.forEach((pixel) => {
    amogussifyPixel(pixel, rowIdx, j)
    j = (j+1) % pattern[0].length
  })
}

// def amogussifyPixel(rawPixel: number, rowIdx: int, colIdx: int):
const amogussifyPixel = (rawPixel: number[], rowIdx: number, colIdx: number) => {
  if (pattern[rowIdx][colIdx] == 1){
    const r = rawPixel[0]
    const g = rawPixel[1]
    const b = rawPixel[2]

    const rRev = r>170 ? 255 : r*1.5
    const gRev = g>170 ? 255 : g*1.5
    const bRev = b>170 ? 255 : b*1.5

    rawPixel[0] = rRev
    rawPixel[1] = gRev
    rawPixel[2] = bRev
  }

}

export default function Amogus() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const hiddenInputRef = useRef(null)
  const hiddenCanvasRef = useRef(null)

  const onSelectFile = async (e: any) => {
    const reader = new FileReader()
    const blob = new Blob()
    const file = e.target.files[0]

    reader.addEventListener(
      'load',
      () => {
        const url: string = (reader.result as string)
        setImageUrl(url)
      },
      false
    )

    if (file) {
      reader.readAsDataURL(file)
    }

    blob.arrayBuffer()
  }

  const onProcessFile = () => {
    const resultCanvas: HTMLCanvasElement = ((hiddenCanvasRef.current as unknown) as HTMLCanvasElement)
    const ctx: CanvasRenderingContext2D = resultCanvas?.getContext('2d')!
    const img = new Image()

    img.src = imageUrl
    img.addEventListener('load', () => {
      const imgW = 200
      const imgH = 200/img.width * img.height

      resultCanvas.width = imgW
      resultCanvas.height = imgH
      ctx?.drawImage(img, 0, 0, imgW, imgH)
      img.style.display = 'none'

      // const imgData = ctx.getImageData(0, 0, imgW, imgH)
      // const resultImgData = changeImageColorPattern(imgData)
      // ctx?.putImageData(resultImgData, 0, 0)
    })
  }

  const changeImageColorPattern = (imageData: ImageData) => {
    const sourceImgData = imageData.data
    // console.log(imageData)
    const amogussified = amogussify(sourceImgData, imageData.width)
    const resultImgData = new ImageData(amogussified, imageData.width, imageData.height, undefined)
    return resultImgData
  }
  
  return (
    <div className='flex justify-center p-8'>
      <div>
        <Title level={1} className='text-center'>Amogussifier</Title>
        <Title level={4} className='text-center'>Makes your picture contain pattern of the iconic character (and others)</Title>
        <div className='flex justify-center gap-x-2 p-3'>
          <input
            ref={hiddenInputRef}
            type='file'
            accept='image/*'
            multiple={false}
            hidden
            onChange={(e) => onSelectFile(e)}
          />
          <Button onClick={(e) => {((hiddenInputRef.current as unknown) as HTMLInputElement).click()}}>
            Select File
          </Button>
          <Button onClick={(e) => {onProcessFile()}}>
            Process
          </Button>
        </div>
        <div className='flex justify-center content-center'>
          <AntdImage
            className='rounded-l border'
            width={200}
            src={imageUrl}
            // fallback="data:image/png;base64,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"
          />
          <Title level={5} className='align-middle'>Transform to...</Title>
          <canvas
            className='rounded-l border'
            ref = {hiddenCanvasRef}
            id='resultCanvas'
          />
        </div>
      </div>
    </div>
  )
}